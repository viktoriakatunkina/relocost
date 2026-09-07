// Единая schema.org FAQPage-разметка страницы.
//
// Google учитывает на странице ТОЛЬКО ОДИН блок FAQPage: если их два (как было
// на страницах стран — CountryFAQ + CountryDynamicFAQ рендерили по своему
// JSON-LD), второй игнорируется, а вопросы из него теряются для выдачи.
// Поэтому визуальных FAQ-секций может быть сколько угодно, но разметка
// собирается один раз здесь — из объединённого списка вопросов.
//
// Пустые вопросы/ответы отсекаются, дубли по тексту вопроса — тоже.

export type FaqItem = { q: string; a: string };

export function FaqSchema({ items }: { items: FaqItem[] }) {
  const seen = new Set<string>();
  const clean = items.filter((it) => {
    const q = (it.q ?? "").trim();
    const a = (it.a ?? "").trim();
    if (!q || !a || seen.has(q)) return false;
    seen.add(q);
    return true;
  });
  if (clean.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: clean.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
