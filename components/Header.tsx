import Link from "next/link";

const NAV = [
  { href: "/search", label: "Поиск" },
  { href: "/blog", label: "Блог" },
  { href: "/favorites", label: "Избранное" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-dingley/30 bg-pine-tree/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-2xl text-cream group-hover:text-pale-copper transition">
            Relocost
          </span>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-brandy/60">
            калькулятор переезда
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-brandy/80">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-pale-copper transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
