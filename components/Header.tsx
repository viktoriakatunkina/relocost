import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { FavoritesNavLink } from "@/components/FavoritesNavLink";

const NAV_ITEM_CLASS =
  "px-3 py-2 rounded-pill text-brandy/85 hover:text-cream hover:bg-cream/5 transition";

export async function Header() {
  const t = await getTranslations("nav");
  const nav = [
    { href: "/search", label: t("cities") },
    { href: "/countries", label: t("countries") },
    { href: "/quiz", label: t("quiz") },
    { href: "/blog", label: t("blog") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-pine-tree/75 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group" aria-label={t("logoAlt")}>
          <span className="w-9 h-9 rounded-2xl bg-copper text-pine-tree flex items-center justify-center font-serif text-xl font-semibold group-hover:rotate-6 transition-transform">
            R
          </span>
          <span className="font-serif text-2xl text-cream tracking-tight">
            Relocost
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_ITEM_CLASS}>
              {item.label}
            </Link>
          ))}
          <FavoritesNavLink className={NAV_ITEM_CLASS} label={t("favorites")} />
          <Link
            href="/#popular"
            className="ml-2 px-4 py-2 rounded-pill bg-copper text-pine-tree text-sm font-semibold hover:bg-brandy transition"
          >
            {t("calculate")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
