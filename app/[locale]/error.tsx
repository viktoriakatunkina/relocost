"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: "var(--pine-tree)" }}
    >
      <div className="max-w-lg w-full text-center">
        <p
          className="font-serif font-bold leading-none mb-6 select-none"
          style={{ fontSize: "clamp(72px, 15vw, 120px)", color: "var(--copper)" }}
          aria-hidden
        >
          !
        </p>

        <h1
          className="font-serif font-semibold mb-4"
          style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "var(--white)" }}
        >
          Что-то пошло не так
        </h1>

        <p
          className="mb-3 leading-relaxed"
          style={{ color: "var(--brandy)", fontSize: "16px" }}
        >
          Произошла непредвиденная ошибка. Попробуйте обновить страницу или
          вернитесь на главную.
        </p>

        {error.digest && (
          <p
            className="mb-8 font-mono text-xs"
            style={{ color: "var(--dim)" }}
          >
            Код: {error.digest}
          </p>
        )}

        {!error.digest && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: "var(--copper)",
              color: "var(--pine-tree)",
              padding: "12px 28px",
              fontSize: "15px",
              minHeight: "44px",
              border: "none",
            }}
          >
            Попробовать снова
          </button>

          <button
            onClick={() => { window.location.href = "/"; }}
            className="inline-flex items-center justify-center rounded-full font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{
              border: "1.5px solid var(--copper)",
              color: "var(--copper)",
              padding: "12px 28px",
              fontSize: "15px",
              minHeight: "44px",
              background: "transparent",
            }}
          >
            На главную
          </button>
        </div>
      </div>
    </main>
  );
}
