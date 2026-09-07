#!/usr/bin/env bash
# Деплой Relocost для машины с малым объёмом RAM (8 ГБ Mac).
# Идентичен deploy.sh, но heap V8 = 4 ГБ вместо 8 ГБ: на 8-гиг машине
# --max-old-space-size=8192 == вся память, и сборка 1549 страниц уходит в
# OOM-kill (процесс убивают, .next остаётся неполным → 502 при старте).
# 4 ГБ заставляют V8 чистить память агрессивнее и укладываться в физическую RAM.
#
# Перед запуском желательно: перезагрузить Мак и открыть только VS Code/Терминал
# (свежая память = надёжная сборка). Запуск:  ./deploy-lowmem.sh
set -euo pipefail

HOST="root@168.222.143.151"
KEY="$HOME/.ssh/relocost_vps"
APP="/opt/relocost"
SITE="https://relocost.ru"
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new"

cd "$(dirname "$0")"

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
    && systemctl restart relocost"
  echo "==> Жду готовности $SITE (до ~30с)"
  if curl -fsS --retry 30 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
    # Билд, с которого откатились, сохраняем как новый .next.prev — это даёт
    # возможность "откатить откат" (снова ./deploy-lowmem.sh --rollback) при ошибке.
    $SSH "$HOST" "cd $APP && rm -rf .next.prev && mv .next.rollback_from .next.prev"
    echo "==> Rollback выполнен ✓  Сайт отвечает 200."
    exit 0
  else
    echo "!! После отката сайт всё равно не поднялся."
    echo "   Логи: ssh -i $KEY $HOST 'journalctl -u relocost -n 80 --no-pager'"
    exit 1
  fi
fi

echo "==> 1/4 Сборка (heap 4 ГБ, порционный режим LOWMEM_BUILD, NEXT_PUBLIC_SITE_URL=$SITE)"
# LOWMEM_BUILD=1 → next.config включает experimental.cpus:1 + workerThreads:false:
# страницы генерятся по одной, без параллельных воркеров → минимум памяти.
LOWMEM_BUILD=1 NODE_OPTIONS="--max-old-space-size=4096" NEXT_PUBLIC_SITE_URL="$SITE" npm run build

echo "==> 2/4 Заливка сборки в staging ($APP/.next.incoming)"
# Повтор rsync: первый проход иногда ловит code 24 (file vanished), если ОС
# ещё дописывает .next/types сразу после билда — второй проход добирает.
rsync -az --delete --exclude 'cache' -e "$SSH" .next/ "$HOST:$APP/.next.incoming/" \
  || rsync -az --delete --exclude 'cache' -e "$SSH" .next/ "$HOST:$APP/.next.incoming/"
# config/ — next.config.mjs читает отсюда (например config/blog-redirects.json
# для redirects()) через readFileSync при СТАРТЕ сервера. 2026-08-31: без этой
# синхронизации next.config.mjs уехал на сервер раньше config/, next start упал
# с ENOENT, systemd ушёл в restart-loop → 502 на всём сайте, и авто-откат тоже
# не спасал (откатывает только .next, не next.config.mjs). Синхронизируем
# ДО next.config.mjs, чтобы файл уже существовал к моменту рестарта.
if [ -d "config" ]; then
  rsync -az -e "$SSH" config/ "$HOST:$APP/config/"
fi
rsync -az -e "$SSH" next.config.mjs "$HOST:$APP/next.config.mjs"
# Статика из /public — синхронизируем только если папка не пуста.
if [ -d "public/images" ]; then
  rsync -az -e "$SSH" public/images/ "$HOST:$APP/public/images/"
fi

echo "==> 3/4 Атомарная замена + рестарт"
# .next.old — временная копия ТЕКУЩЕГО (до этого деплоя) билда, живёт только
# на время health-check ниже.
$SSH "$HOST" "cd $APP \
  && rm -rf .next.old \
  && mv .next .next.old \
  && mv .next.incoming .next \
  && systemctl restart relocost"

echo "==> 4/4 Жду готовности $SITE (до ~30с)"
if curl -fsS --retry 30 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
  # БАГ (найден 2026-09-03, починен): раньше здесь было `rm -rf .next.old` —
  # бэкап предыдущего билда удалялся сразу при успехе, поэтому .next.prev
  # (для --rollback) не обновлялся деплоями вообще и протухал неделями.
  # Теперь .next.old при успехе становится новым .next.prev.
  $SSH "$HOST" "cd $APP && rm -rf .next.prev && mv .next.old .next.prev"
  echo "==> Готово ✓  Сайт отвечает 200. Прошлый билд сохранён как .next.prev (./deploy-lowmem.sh --rollback)."
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
