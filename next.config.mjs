/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Канонический домен — relocost.ru. Технический домен Vercel 301-редиректим,
  // чтобы не плодить дубль и собрать весь SEO-вес на бренд-домене.
  // Точное совпадение хоста — превью-деплои (*.vercel.app) не затрагиваются.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "relocost.vercel.app" }],
        destination: "https://relocost.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
