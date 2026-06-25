import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/search", label: tn("cities") },
    { href: "/countries", label: tn("countries") },
    { href: "/quiz", label: tn("quiz") },
    { href: "/rating", label: tn("rating") },
    { href: "/checklist", label: tn("checklist") },
    { href: "/blog", label: tn("blog") },
    { href: "/favorites", label: tn("favorites") },
  ];
  const projectLinks = [
    { href: "/about", label: t("about") },
    { href: "/offer", label: t("offer") },
    { href: "/contacts", label: t("contacts") },
  ];
  const listLinks = [
    { href: "/list/samye-deshevye", label: "Самые дешевые" },
    { href: "/list/do-50000-rubley", label: "До 50 000 ₽" },
    { href: "/list/dlya-zimovki", label: "Для зимовки" },
    { href: "/list/u-morya", label: "У моря" },
    { href: "/list/dlya-udalenki", label: "Для удаленки" },
  ];

  const columns = [
    { title: t("colNav"), links: navLinks },
    { title: t("colLists"), links: listLinks },
    { title: t("colProject"), links: projectLinks },
  ];

  return (
    <footer className="relative border-t hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr,repeat(3,1fr)] mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <span className="w-9 h-9 rounded-2xl bg-copper text-pine-tree flex items-center justify-center font-serif text-xl font-semibold group-hover:rotate-6 transition-transform">
                R
              </span>
              <span className="font-serif text-2xl text-cream">Relocost</span>
            </Link>
            <p className="text-brandy/70 text-sm max-w-xs leading-relaxed">
              {t("tagline")}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-cream/80 text-xs uppercase tracking-[0.18em] mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-brandy/80 hover:text-copper text-sm transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-8 border-t hairline text-xs text-brandy/55">
          <p>{t("rights", { year })}</p>
          <p>
            {t("legal")}
            <Link href="/contacts" className="hover:text-copper transition">
              {t("requisites")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
