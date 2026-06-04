// Атмосферные декоративные слои: лёгкая дымка в hero и тёплые цветные
// свечения в секциях. Чистый CSS/SVG, без интерактива. Уважают
// prefers-reduced-motion (классы animate-* отключаются в globals.css).

// Мягкая светлая дымка поверх hero-фото — «туман в лесу», плывёт медленно.
export function HeroMist() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      <span
        className="orb animate-drift"
        style={{
          top: "10%",
          left: "-8%",
          width: "46vw",
          height: "20vh",
          background:
            "radial-gradient(closest-side, rgba(246,241,232,0.12), transparent)",
          animationDuration: "34s",
        }}
      />
      <span
        className="orb animate-drift"
        style={{
          top: "26%",
          right: "-10%",
          width: "38vw",
          height: "18vh",
          background:
            "radial-gradient(closest-side, rgba(230,207,168,0.10), transparent)",
          animationDuration: "44s",
          animationDelay: "-8s",
        }}
      />
      <span
        className="orb animate-floaty"
        style={{
          top: "58%",
          left: "12%",
          width: "30vw",
          height: "14vh",
          background:
            "radial-gradient(closest-side, rgba(246,241,232,0.08), transparent)",
          animationDuration: "13s",
        }}
      />
    </div>
  );
}

// Тёплые цветные свечения за секцией — добавляют цвет и глубину,
// разбивают «всё зелёное». Палитра: персик, янтарь, небесно-голубой акцент.
export function WarmOrbs({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <span
        className="orb animate-glow"
        style={{
          top: "-10%",
          left: "-8%",
          width: "34vw",
          height: "34vw",
          background:
            "radial-gradient(closest-side, rgba(232,155,110,0.38), transparent)",
        }}
      />
      <span
        className="orb animate-glow"
        style={{
          bottom: "-14%",
          right: "-10%",
          width: "38vw",
          height: "38vw",
          background:
            "radial-gradient(closest-side, rgba(224,169,62,0.30), transparent)",
          animationDelay: "-5s",
        }}
      />
      <span
        className="orb animate-floaty"
        style={{
          top: "34%",
          right: "20%",
          width: "22vw",
          height: "22vw",
          background:
            "radial-gradient(closest-side, rgba(127,168,184,0.26), transparent)",
          animationDuration: "14s",
        }}
      />
    </div>
  );
}
