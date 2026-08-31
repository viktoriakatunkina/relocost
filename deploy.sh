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
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new"

cd "$(dirname "$0")"

echo "==> 1/4 Сборка (NEXT_PUBLIC_SITE_URL=$SITE)"
# --max-old-space-size: с i18n (~1549 страниц + OG-картинки) воркеры экспорта
# уходят в OOM и билд падает с "Cannot find module ./chunks/*.js". 8 ГБ кучи
# лечит. См. reference-relocost-build-oom.
NODE_OPTIONS="--max-old-space-size=8192" NEXT_PUBLIC_SITE_URL="$SITE" npm run build

echo "==> 2/4 Заливка сборки в staging ($APP/.next.incoming)"
# --exclude 'cache': иначе rsync может упасть с "file has vanished" на
# .next/cache/webpack; рантайму build-cache не нужен.
rsync -az --delete --exclude 'cache' -e "$SSH" .next/ "$HOST:$APP/.next.incoming/"
# config/ — next.config.mjs читает отсюда (например config/blog-redirects.json
# для redirects()) через readFileSync при СТАРТЕ сервера. 2026-08-31: без этой
# синхронизации next.config.mjs уехал на сервер раньше config/, next start упал
# с ENOENT, systemd ушёл в restart-loop → 502 на всём сайте, и авто-откат тоже
# не спасал (откатывает только .next, не next.config.mjs). Синхронизируем
# ДО next.config.mjs, чтобы файл уже существовал к моменту рестарта.
if [ -d "config" ]; then
  rsync -az -e "$SSH" config/ "$HOST:$APP/config/"
fi
# next.config.mjs читается `next start` с диска при запуске, поэтому держим его
# на сервере в синхроне (иначе runtime-конфиг расходится со сборкой).
rsync -az -e "$SSH" next.config.mjs "$HOST:$APP/next.config.mjs"
# Статика из /public — синхронизируем только если папка не пуста.
if [ -d "public/images" ]; then
  rsync -az -e "$SSH" public/images/ "$HOST:$APP/public/images/"
fi

echo "==> 3/4 Атомарная замена + рестарт"
$SSH "$HOST" "cd $APP \
  && rm -rf .next.old \
  && mv .next .next.old \
  && mv .next.incoming .next \
  && systemctl restart relocost"

echo "==> 4/4 Жду готовности $SITE (до ~20с)"
if curl -fsS --retry 20 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
  $SSH "$HOST" "cd $APP && rm -rf .next.old"
  echo "==> Готово ✓  Сайт отвечает 200, старый билд удалён."
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
