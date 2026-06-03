// Заглушка-галерея на градиентах — заменим на Unsplash, когда получим ключ.
const ACCENTS = [
  ["#33432B", "#6A784D"],
  ["#202808", "#33432B"],
  ["#C4866D", "#33432B"],
  ["#6A784D", "#DEC59E"],
  ["#33432B", "#202808"],
  ["#5A6A45", "#33432B"],
];

export function PhotoGallery({ cityName }: { cityName: string }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="font-serif text-3xl text-cream mb-6">{cityName} в кадрах</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {ACCENTS.map(([a, b], i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-72 md:w-80 aspect-[4/3] rounded-2xl border border-dingley/30"
            style={{
              background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
            }}
            aria-label="Фото города (placeholder)"
          />
        ))}
      </div>
      <p className="text-brandy/50 text-xs mt-3">
        Реальные фото подгрузим из Unsplash после подключения API.
      </p>
    </section>
  );
}
