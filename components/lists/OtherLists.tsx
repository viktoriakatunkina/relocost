import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getAllListsPreview } from "@/lib/lists";
import { isR2Src, isUnsplashSrc } from "@/lib/photo";

// «Другие подборки» — перелинковка между лендингами /list.
//
// До 07.09.2026 на 9 из 14 подборок не вело НИ ОДНОЙ внутренней ссылки: в
// футере жили только 5. Блок ставится в конец каждой подборки и связывает их
// между собой (заодно ведёт пользователя из «до 50 000 ₽» в «50–80 000 ₽»
// и из «зимовки» в «тёплые страны» — это соседние по смыслу шаги выбора).
//
// 2026-09-29: раньше — голые текстовые пилюли вразброс на пустом фоне
// ("пусто и одиноко"). Теперь те же карточки с фото, что на индексе /list
// и в блоке "Подборки" на главной (getAllListsPreview) — визуально один
// и тот же язык везде, где показываются подборки.
export async function OtherLists({ currentSlug }: { currentSlug: string }) {
  const others = (await getAllListsPreview()).filter((l) => l.slug !== currentSlug);
  if (!others.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-cream mb-6">
        Другие подборки
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {others.map((l) => (
          <Link
            key={l.slug}
            href={`/list/${l.slug}`}
            className="group relative flex h-28 sm:h-32 flex-col justify-end overflow-hidden rounded-2xl border hairline bg-surface transition hover:-translate-y-1 hover:border-copper/40 hover:shadow-card"
          >
            {l.photo ? (
              <Image
                src={l.photo}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized={isR2Src(l.photo) || isUnsplashSrc(l.photo)}
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-kombu-green via-kombu-green to-pine-tree"
                aria-hidden
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/65 to-transparent" />
            <span className="relative z-10 px-3 sm:px-4 pb-3 sm:pb-4 text-cream font-serif text-sm sm:text-base leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:text-copper transition">
              {l.shortTitle}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
