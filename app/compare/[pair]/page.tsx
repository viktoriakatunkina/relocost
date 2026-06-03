import { notFound } from "next/navigation";
import {
  allCompareParams,
  loadCompare,
  parsePair,
} from "@/lib/compare";
import { CompareHero } from "@/components/compare/CompareHero";
import { CompareTable } from "@/components/compare/CompareTable";
import { Verdict } from "@/components/compare/Verdict";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;

export async function generateStaticParams() {
  return allCompareParams();
}

export async function generateMetadata({
  params,
}: {
  params: { pair: string };
}) {
  const parsed = parsePair(params.pair);
  if (!parsed) return {};
  const data = await loadCompare(parsed[0], parsed[1]);
  if (!data) return {};
  return {
    title: `${data.a.name_ru} или ${data.b.name_ru} — где жить дешевле в 2026 году | Relocost`,
    description: `Сравниваем ${data.a.name_ru} и ${data.b.name_ru}: аренда, продукты, транспорт, ЖКХ и сложность переезда. Конкретные цифры и победитель по каждой категории.`,
  };
}

export default async function ComparePage({
  params,
}: {
  params: { pair: string };
}) {
  const parsed = parsePair(params.pair);
  if (!parsed) notFound();
  const data = await loadCompare(parsed[0], parsed[1]);
  if (!data) notFound();

  return (
    <main className="pb-24">
      <CompareHero a={data.a} b={data.b} />
      <CompareTable a={data.a} b={data.b} lines={data.lines} />
      <Verdict
        a={data.a}
        b={data.b}
        scoreA={data.scoreA}
        scoreB={data.scoreB}
      />
      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
