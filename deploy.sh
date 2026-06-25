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
# next.config.mjs читается `next start` с диска при запуске, поэтому держим его
# на сервере в синхроне (иначе runtime-конфиг расходится со сборкой).
rsync -az -e "$SSH" next.config.mjs "$HOST:$APP/next.config.mjs"

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
else
  echo "!! Сайт не поднялся — откат на прошлый билд"
  $SSH "$HOST" "cd $APP \
    && rm -rf .next.bad && mv .next .next.bad \
    && mv .next.old .next \
    && systemctl restart relocost"
  echo "!! Откат выполнен. Логи: ssh $HOST 'journalctl -u relocost -n 50 --no-pager'"
  exit 1
fi
