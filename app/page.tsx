export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-2xl">
        <p className="text-pale-copper font-medium tracking-wider uppercase text-sm mb-6">
          Relocost · MVP
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-cream leading-tight mb-6">
          Сколько стоит переехать в другой город или страну?
        </h1>
        <p className="text-brandy text-lg md:text-xl mb-10">
          Калькулятор стоимости жизни, реальные цены, визы и гайды для тех, кто
          планирует переезд внутри России или за рубеж.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-pill bg-kombu-green text-brandy text-sm">
          <span className="w-2 h-2 rounded-full bg-pale-copper animate-pulse" />
          Сайт в разработке — запуск в ближайшие недели
        </div>
      </div>
    </main>
  );
}
