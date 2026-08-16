import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { FavoritesNavLink } from "@/components/FavoritesNavLink";
import { MobileNav } from "@/components/MobileNav";
import { Logo } from "@/components/Logo";

const NAV_ITEM_CLASS =
  "px-3 py-2 rounded-pill text-brandy/85 hover:text-cream hover:bg-cream/5 transition";

export async function Header() {
  const t = await getTranslations("nav");
  const nav = [
    { href: "/search", label: t("cities") },
    { href: "/countries", label: t("countries") },
    { href: "/match", label: t("match") },
    { href: "/quiz", label: t("quiz") },
    { href: "/blog", label: t("blog") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-pine-tree/75 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        {/* Логотип */}
        <Link href="/" className="group shrink-0" aria-label={t("logoAlt")}>
          <Logo variant="horizontal" size="md" withHover />
        </Link>

        {/* Десктопная навигация — скрыта на мобильном */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_ITEM_CLASS}>
              {item.label}
            </Link>
          ))}
          <FavoritesNavLink className={NAV_ITEM_CLASS} label={t("favorites")} />
          <Link
            href="/search"
            className="ml-2 px-4 py-2 rounded-pill bg-copper text-pine-tree text-sm font-semibold hover:bg-brandy transition"
          >
            {t("calculate")}
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* Правый блок на мобильном: переключатель языка + бургер */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <MobileNav
            nav={nav}
            favoritesLabel={t("favorites")}
            calculateLabel={t("calculate")}
          />
        </div>
      </div>
    </header>
  );
}
