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

echo "==> 1/4 Сборка (heap 4 ГБ, порционный режим LOWMEM_BUILD, NEXT_PUBLIC_SITE_URL=$SITE)"
# LOWMEM_BUILD=1 → next.config включает experimental.cpus:1 + workerThreads:false:
# страницы генерятся по одной, без параллельных воркеров → минимум памяти.
LOWMEM_BUILD=1 NODE_OPTIONS="--max-old-space-size=4096" NEXT_PUBLIC_SITE_URL="$SITE" npm run build

echo "==> 2/4 Заливка сборки в staging ($APP/.next.incoming)"
# Повтор rsync: первый проход иногда ловит code 24 (file vanished), если ОС
# ещё дописывает .next/types сразу после билда — второй проход добирает.
rsync -az --delete --exclude 'cache' -e "$SSH" .next/ "$HOST:$APP/.next.incoming/" \
  || rsync -az --delete --exclude 'cache' -e "$SSH" .next/ "$HOST:$APP/.next.incoming/"
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

echo "==> 4/4 Жду готовности $SITE (до ~30с)"
if curl -fsS --retry 30 --retry-delay 1 --retry-all-errors -o /dev/null "$SITE/"; then
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
