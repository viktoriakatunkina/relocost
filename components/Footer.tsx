import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";

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
    { href: "/privacy", label: t("privacy") },
    { href: "/contacts", label: t("contacts") },
  ];
  const listLinks = [
    { href: "/list/samye-deshevye", label: t("listCheapest") },
    { href: "/list/do-50000-rubley", label: t("listBudget") },
    { href: "/list/dlya-zimovki", label: t("listWinter") },
    { href: "/list/u-morya", label: t("listSeaside") },
    { href: "/list/dlya-udalenki", label: t("listRemote") },
  ];

  const columns = [
    { title: t("colNav"), links: navLinks },
    { title: t("colLists"), links: listLinks },
    { title: t("colProject"), links: projectLinks },
  ];

  const logoBlock = (
    <div>
      <Link href="/" className="inline-block mb-4 group w-fit">
        <Logo variant="horizontal" size="md" withHover />
      </Link>
      <p className="text-brandy/70 text-sm max-w-xs leading-relaxed">
        {t("tagline")}
      </p>
    </div>
  );

  return (
    <footer className="relative border-t hairline mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 md:py-16">

        {/* Десктоп: логотип + 3 колонки в одной сетке */}
        <div className="hidden md:grid md:grid-cols-[1.5fr,repeat(3,1fr)] md:gap-10">
          {logoBlock}
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

        {/* Мобиль: логотип сверху, затем 2 колонки */}
        <div className="md:hidden">
          <div className="mb-6">{logoBlock}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-cream/80 text-[10px] uppercase tracking-[0.18em] mb-2">{col.title}</div>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-brandy/80 hover:text-copper text-xs transition">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-6 mt-6 border-t hairline text-[11px] text-brandy/55">
          <p>{t("rights", { year })}</p>
          <p style={{ overflowWrap: "anywhere" }}>
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
