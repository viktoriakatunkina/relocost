import { getPublishedPosts } from "@/lib/blog";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

export const metadata = {
  title: "Блог Relocost — гайды по переезду, цены, визы и сравнения городов",
  description:
    "Пошаговые гайды релокации, сравнения городов и подборки направлений. Только проверенные цифры и опыт переехавших.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <main className="pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-pale-copper uppercase text-sm tracking-wider mb-4">
          Блог
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Гайды, сравнения и подборки
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Практические материалы для тех, кто планирует переезд. Бюджеты,
          визы, банки, школы — на конкретных цифрах.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <BlogFilters posts={posts} />
      </section>

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
