export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-dingley/30 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl text-cream">Relocost</span>
          <span className="text-brandy/60">·</span>
          <span className="text-brandy/60">калькулятор переезда</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-brandy/70">
          <a href="/" className="hover:text-pale-copper">Главная</a>
          <a href="/search" className="hover:text-pale-copper">Поиск</a>
          <a href="/favorites" className="hover:text-pale-copper">Избранное</a>
          <a href="/blog" className="hover:text-pale-copper">Блог</a>
        </nav>
        <p className="text-brandy/50">© {year}</p>
      </div>
    </footer>
  );
}
