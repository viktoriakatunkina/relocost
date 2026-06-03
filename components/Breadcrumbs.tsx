import Link from "next/link";

export type Crumb = { name: string; href?: string };

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Хлебные крошки"
      className="max-w-6xl mx-auto px-6 pt-6 text-sm text-brandy/60"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link
                href={c.href}
                className="hover:text-copper transition"
              >
                {c.name}
              </Link>
            ) : (
              <span className="text-brandy/80" aria-current="page">
                {c.name}
              </span>
            )}
            {i < items.length - 1 && (
              <span className="text-brandy/30" aria-hidden>
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
