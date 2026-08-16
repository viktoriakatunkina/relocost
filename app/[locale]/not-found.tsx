import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: "var(--pine-tree)" }}
    >
      <div className="max-w-lg w-full text-center">
        <p
          className="font-serif font-bold leading-none mb-6 select-none"
          style={{ fontSize: "clamp(96px, 20vw, 160px)", color: "var(--copper)" }}
          aria-hidden
        >
          404
        </p>

        <h1
          className="font-serif font-semibold mb-4"
          style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "var(--white)" }}
        >
          Страница не найдена
        </h1>

        <p
          className="mb-10 leading-relaxed"
          style={{ color: "var(--brandy)", fontSize: "16px" }}
        >
          Такой страницы не существует. Возможно, она была удалена или Вы
          ошиблись в адресе.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--copper)",
              color: "var(--pine-tree)",
              padding: "12px 28px",
              fontSize: "15px",
              minHeight: "44px",
            }}
          >
            На главную
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full font-semibold transition-all hover:-translate-y-0.5"
            style={{
              border: "1.5px solid var(--copper)",
              color: "var(--copper)",
              padding: "12px 28px",
              fontSize: "15px",
              minHeight: "44px",
            }}
          >
            Все города
          </Link>
        </div>
      </div>
    </main>
  );
}
