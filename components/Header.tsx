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
  const tf = await getTranslations("footer");
  const nav = [
    { href: "/search", label: t("cities") },
    { href: "/countries", label: t("countries") },
    { href: "/match", label: t("match") },
    { href: "/quiz", label: t("quiz") },
    { href: "/blog", label: t("blog") },
  ] as const;

  // Мобильное меню богаче десктопной навигации (Виктория, 2026-08-25:
  // "недостаточно пунктов, неудобное, неинтересное") — добавлены Рейтинг,
  // Чек-лист, О проекте (уже есть на сайте, просто не были в бургере) +
  // иконки у каждого пункта.
  const mobileNav = [
    { href: "/search", label: t("cities"), icon: "city" as const },
    { href: "/countries", label: t("countries"), icon: "globe" as const },
    { href: "/match", label: t("match"), icon: "sliders" as const },
    { href: "/quiz", label: t("quiz"), icon: "compass" as const },
    { href: "/rating", label: t("rating"), icon: "star" as const },
    { href: "/blog", label: t("blog"), icon: "book" as const },
    { href: "/checklist", label: t("checklist"), icon: "check" as const },
    { href: "/about", label: tf("about"), icon: "info" as const },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-pine-tree/75 backdrop-blur-xl">
      {/* На мобильном компактнее (py-3, gap-3): на узких экранах
          (iPhone SE 320px и подобных) хедер выглядел непропорционально
          просторным — Виктория прислала скриншот 2026-08-25. */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 md:gap-4 px-3 sm:px-6 py-3 md:py-4">
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
            nav={mobileNav}
            favoritesLabel={t("favorites")}
            calculateLabel={t("calculate")}
          />
        </div>
      </div>
    </header>
  );
}
