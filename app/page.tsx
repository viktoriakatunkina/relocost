import { getAllCitiesForSearch, getPopularCities } from "@/lib/cities";
import { CityCard } from "@/components/CityCard";
import { SearchBar } from "@/components/SearchBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export default async function HomePage() {
  const [popular, searchItems] = await Promise.all([
    getPopularCities(6),
    getAllCitiesForSearch(),
  ]);

  return (
    <>
      <section className="relative min-h-[88vh] flex flex-col justify-center px-6 py-20 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(106,120,77,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(196,134,109,0.18) 0%, transparent 50%)",
          }}
          aria-hidden
        />

        <div className="max-w-4xl mx-auto text-center w-full">
          <p className="text-pale-copper font-medium tracking-wider uppercase text-sm mb-6">
            Relocost · калькулятор переезда
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-8">
            Сколько стоит переехать в&nbsp;другой город или страну?
          </h1>
          <p className="text-brandy/90 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Аренда, еда, транспорт, виза — считаем реальный бюджет на месяц.
            Реальные цены, отзывы переехавших, гайды по&nbsp;10&nbsp;направлениям.
          </p>

          <SearchBar items={searchItems} />
        </div>
      </section>

      <section id="popular" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-4xl md:text-5xl text-cream">
              Популярные направления
            </h2>
            <span className="text-brandy/60 text-sm hidden md:block">
              {popular.length} городов
            </span>
          </div>

          {popular.length === 0 ? (
            <p className="text-brandy/70">
              Города пока не заполнены — загляни позже.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((city, i) => (
                <CityCard key={city.id} city={city} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
      <CTABanner />
      <Footer />
    </>
  );
}
