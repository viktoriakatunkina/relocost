import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-dingley via-kombu-green to-pine-tree p-12 md:p-16 text-center border border-dingley/40">
        <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">
          Готов переезжать?
        </h2>
        <p className="text-brandy/90 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Выбери город — посчитаем сколько денег понадобится в первый месяц
          и что ждёт по визе и быту.
        </p>
        <Link
          href="#popular"
          className="inline-block px-8 py-4 rounded-pill bg-pale-copper text-pine-tree font-semibold transition hover:bg-brandy"
        >
          Выбрать город
        </Link>
      </div>
    </section>
  );
}
