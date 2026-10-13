#!/usr/bin/env bash
# Атомарный деплой Relocost на VPS reg.ru.
# Идея: новый билд сначала полностью заливается в staging-папку, и только потом
# мгновенным `mv` подменяет «живой» .next. Работающий сервис никогда не видит
# недособранную папку → нет 15-секундного крэш-лупа/502, который был при
# прямом `rsync --delete` в живой каталог. Если сайт не поднялся — авто-откат.
set -euo pipefail

HOST="root@168.222.143.151"
KEY="$HOME/.ssh/relocost_vps"
APP="/opt/relocost"
SITE="https://relocost.ru"
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=10 -o ServerAliveCountMax=6 -o ConnectTimeout=20"
# 2026-10-13: ServerAlive* — без них долгие rsync-передачи при нестабильной
# сети (например, фоновые SSH-брутфорс-атаки ботов на порт 22 временно
# переполняют очередь sshd) рвутся по-тихому без явной ошибки. Через
# RSYNC_RSH (переменная окружения), а не inline `-e "$SSH"` — на связке
# "старый rsync 2.6.9 из macOS + сложная цитируемая -e строка" однажды
# поймали нестабильный парсинг аргументов под высокой нагрузкой системы
# (rsync принимал саму ssh-команду за путь файла) — RSYNC_RSH эту
# неоднозначность исключает.
export RSYNC_RSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=10 -o ServerAliveCountMax=6 -o ConnectTimeout=20"

cd "$(dirname "$0")"

# Повторяет команду до 5 раз с паузой — устойчивость к временным сетевым
# сбоям (см. комментарий про RSYNC_RSH выше). Используем для ВСЕХ rsync к
# серверу, не только первого шага заливки.
retry() {
  local attempt=1 max=5
  until "$@"; do
    if [ "$attempt" -ge "$max" ]; then
      echo "!! Не удалось после $max попыток: $*" >&2
      return 1
    fi
    echo "   попытка $attempt не удалась, пробую снова через 10с..."
    attempt=$((attempt + 1))
    sleep 10
  done
}

# --rollback: откат на .next.prev (билд, который был живым непосредственно
# ДО последнего успешного деплоя). Без пересборки — просто меняет .next и
# .next.prev местами и рестартует сервис.
#
# 2026-09-03: раньше .next.prev не поддерживался деплой-скриптом вообще —
# был разовым ручным бэкапом от 19 августа, который никто не обновлял. При
# сбое 2026-09-03 "откат" выполнили через него вручную и улетели на билд
# двухнедельной давности, потеряв P0-фикс оплаты и весь свежий контент. Теперь
# .next.prev — часть штатного пайплайна (см. блок 4/4 ниже) и всегда содержит
# билд, живший непосредственно до текущего .next.
if [[ "${1:-}" == "--rollback" ]]; then
  echo "==> Rollback: меняю $APP/.next на $APP/.next.prev"
  if ! $SSH "$HOST" "test -d $APP/.next.prev"; then
    echo "!! $APP/.next.prev не найден — откатывать нечего."
    echo "   Проверь вручную: ssh -i $KEY $HOST 'ls -la $APP'"
    exit 1
  fi
  $SSH "$HOST" "cd $APP \
    && rm -rf .next.rollback_from \
    && mv .next .next.rollback_from \
    && mv .next.prev .next \
    && (rsync -a --ignore-existing .next.rollback_from/static/ .next/static/ 2>/dev/null || true) \
    && systemctl restart relocost"
  echo "==> Жду готовности $SITE (до ~20с)"
  if curl -fsS --retry 20 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
    # Билд, с которого откатились, сохраняем как новый .next.prev — это даёт
    # возможность "откатить откат" (снова ./deploy.sh --rollback) при ошибке.
    $SSH "$HOST" "cd $APP && rm -rf .next.prev && mv .next.rollback_from .next.prev"
    echo "==> Rollback выполнен ✓  Сайт отвечает 200."
    exit 0
  else
    echo "!! После отката сайт всё равно не поднялся."
    echo "   Логи: ssh -i $KEY $HOST 'journalctl -u relocost -n 80 --no-pager'"
    exit 1
  fi
fi

echo "==> 1/4 Сборка (NEXT_PUBLIC_SITE_URL=$SITE)"
# --max-old-space-size: с i18n (~1549 страниц + OG-картинки) воркеры экспорта
# уходят в OOM и билд падает с "Cannot find module ./chunks/*.js". 8 ГБ кучи
# лечит. См. reference-relocost-build-oom.
NODE_OPTIONS="--max-old-space-size=8192" NEXT_PUBLIC_SITE_URL="$SITE" npm run build

echo "==> 2/4 Заливка сборки в staging ($APP/.next.incoming)"
# --exclude 'cache': иначе rsync может упасть с "file has vanished" на
# .next/cache/webpack; рантайму build-cache не нужен. retry — устойчивость
# к временным сетевым сбоям (см. комментарий про RSYNC_RSH выше).
retry rsync -az --delete --exclude 'cache' .next/ "$HOST:$APP/.next.incoming/"
# config/ — next.config.mjs читает отсюда (например config/blog-redirects.json
# для redirects()) через readFileSync при СТАРТЕ сервера. 2026-08-31: без этой
# синхронизации next.config.mjs уехал на сервер раньше config/, next start упал
# с ENOENT, systemd ушёл в restart-loop → 502 на всём сайте, и авто-откат тоже
# не спасал (откатывает только .next, не next.config.mjs). Синхронизируем
# ДО next.config.mjs, чтобы файл уже существовал к моменту рестарта.
if [ -d "config" ]; then
  retry rsync -az config/ "$HOST:$APP/config/"
fi
# next.config.mjs читается `next start` с диска при запуске, поэтому держим его
# на сервере в синхроне (иначе runtime-конфиг расходится со сборкой).
retry rsync -az next.config.mjs "$HOST:$APP/next.config.mjs"
# Статика из /public — синхронизируем только если папка не пуста.
if [ -d "public/images" ]; then
  retry rsync -az public/images/ "$HOST:$APP/public/images/"
fi

echo "==> 3/4 Атомарная замена + рестарт"
# .next.old — временная копия ТЕКУЩЕГО (до этого деплоя) билда, живёт только
# на время health-check ниже.
#
# 2026-09-29 (Вебвизор поймал живого пользователя с полностью неоформленной
# страницей — голый HTML без CSS): после mv .next .next.old хэшированные
# JS/CSS файлы предыдущего билда (/_next/static/css/<hash>.css и т.п.)
# физически исчезают с диска. У любого, чей браузер уже загрузил HTML со
# ссылками на СТАРЫЙ хэш (открыл страницу за секунды до этого свапа, или
# просто держит вкладку открытой и подгружает ленивый чанк) — 404 на CSS/JS,
# сайт рендерится без стилей. Имена файлов у Next.js — content-hash,
# коллизий не бывает, поэтому безопасно донести файлы старого билда,
# которых нет в новом, в новый .next/static — --ignore-existing ничего не
# перезаписывает, просто расширяет набор доступных файлов на один цикл
# деплоя вперёд. Не критично к неудаче (fresh-инсталл без .next.old/static) —
# обёрнуто в подшелл с || true, чтобы не сорвать цепочку &&.
$SSH "$HOST" "cd $APP \
  && rm -rf .next.old \
  && mv .next .next.old \
  && mv .next.incoming .next \
  && (rsync -a --ignore-existing .next.old/static/ .next/static/ 2>/dev/null || true) \
  && systemctl restart relocost"

echo "==> 4/4 Жду готовности $SITE (до ~20с)"
if curl -fsS --retry 20 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
  # БАГ (найден 2026-09-03, починен): раньше здесь было `rm -rf .next.old` —
  # бэкап предыдущего билда удалялся сразу при успехе, поэтому .next.prev
  # (для --rollback) не обновлялся деплоями вообще и протухал неделями.
  # Теперь .next.old при успехе становится новым .next.prev.
  $SSH "$HOST" "cd $APP && rm -rf .next.prev && mv .next.old .next.prev"
  echo "==> Готово ✓  Сайт отвечает 200. Прошлый билд сохранён как .next.prev (./deploy.sh --rollback)."
  echo "==> IndexNow: уведомляем Яндекс и Bing о страницах"
  node scripts/indexnow.mjs || echo "!! IndexNow вернул ошибку (не критично)"
else
  echo "!! Сайт не поднялся — откат на прошлый билд"
  $SSH "$HOST" "cd $APP \
    && rm -rf .next.bad && mv .next .next.bad \
    && mv .next.old .next \
    && systemctl restart relocost"
  echo "!! Откат выполнен. Логи: ssh $HOST 'journalctl -u relocost -n 50 --no-pager'"
  exit 1
fi
