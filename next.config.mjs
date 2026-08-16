import createNextIntlPlugin from "next-intl/plugin";

// next-intl: путь к i18n/request.ts (конфиг запроса с загрузкой словарей).
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Деплой на Node-VPS: nginx + systemd + `next start` читает обычный .next.
  // Без output:"standalone" — он несовместим с `next start` и ломал запуск.

  // Низкопамятная сборка (флаг LOWMEM_BUILD=1, его ставит deploy-lowmem.sh):
  // генерим страницы по одной, без worker-потоков (cpus:1, workerThreads:false).
  // На 8-ГБ Mac параллельная сборка 1549 страниц уходит в OOM-kill — порционный
  // режим резко снижает пиковую память (медленнее, но доходит до конца).
  // На обычных машинах флаг не ставится → сборка идёт штатно, в полную силу.
  ...(process.env.LOWMEM_BUILD
    ? { experimental: { workerThreads: false, cpus: 1 } }
    : {}),

  // Лимит генерации одной статической страницы. Дефолт Next.js — 60 сек. При
  // одно­поточной сборке (cpus:1) страницы генерятся последовательно, и один
  // медленный запрос в Supabase (статемент-таймаут 57014 на en/uz) стопорит всю
  // очередь — голова очереди упирается в 60 сек и сборка падает на случайной
  // блог-странице. 300 сек дают очереди время разгрестись. На быстрых машинах
  // страница строится за миллисекунды, так что лимит там не срабатывает.
  staticPageGenerationTimeout: 600,

  images: {
    remotePatterns: [
      {
        // Supabase Storage (bucket photos) — основной источник фото.
        // Доступен с российского VPS, в отличие от images.unsplash.com.
        protocol: "https",
        hostname: "ftkyoneazoqlkrpisdef.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Фолбэк/dev: используется, пока local-колонки не заполнены.
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Cloudflare R2 публичный bucket (pub-*.r2.dev).
        // Подключается при NEXT_PUBLIC_R2_URL. Fallback при Supabase egress quota.
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
    ],
    // Только WebP. AVIF кодируется в разы тяжелее и на 2-ядерном VPS обложка
    // (1600px) оптимизировалась по несколько секунд — отсюда «долго грузится».
    formats: ["image/webp"],
    // Кэш оптимизированных картинок держим дольше, чтобы повторные заходы
    // не пересобирали их заново.
    minimumCacheTTL: 2592000,
  },
};

export default withNextIntl(nextConfig);
