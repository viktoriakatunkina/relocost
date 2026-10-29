import { Link } from "@/i18n/navigation";

// Четыре страницы сайта решают одну и ту же задачу "подобрать город для
// переезда" разными интерфейсами (тест-квиз, слайдеры-подбор, ручной поиск,
// общий рейтинг) — без этой подсказки пользователь не понимает, зачем их
// четыре и чем они отличаются. Короткая фраза-дифференциатор под заголовком
// каждой из четырёх страниц + перелинковка на остальные три.
export type ToolKey = "quiz" | "match" | "search" | "rating";

type Pitch = { pre: string; label: string; href: "/quiz" | "/match" | "/search" | "/rating"; post: string };

// Сообщение описывает КОГДА стоит переключиться на этот инструмент — одно и
// то же сообщение для target-инструмента показывается на всех страницах,
// кроме его собственной.
const PITCH: Record<ToolKey, Pitch> = {
  quiz: {
    pre: "Нужен быстрый персональный вариант — пройдите ",
    label: "Тест",
    href: "/quiz",
    post: " (6 вопросов)",
  },
  match: {
    pre: "Хотите точнее настроить веса критериев — попробуйте ",
    label: "Подбор",
    href: "/match",
    post: " через слайдеры",
  },
  search: {
    pre: "Хотите сами посмотреть список городов и отфильтровать — откройте ",
    label: "Поиск",
    href: "/search",
    post: "",
  },
  rating: {
    pre: "Хотите сразу увидеть общий топ городов — посмотрите ",
    label: "Рейтинг",
    href: "/rating",
    post: "",
  },
};

const ORDER: ToolKey[] = ["quiz", "match", "search", "rating"];

export function ToolsCrossNote({ current }: { current: ToolKey }) {
  const others = ORDER.filter((k) => k !== current);
  return (
    <p className="text-brandy/55 text-sm max-w-2xl mt-5 leading-relaxed">
      {others.map((k) => {
        const p = PITCH[k];
        return (
          <span key={k}>
            {p.pre}
            <Link
              href={p.href}
              className="text-copper hover:text-brandy underline underline-offset-2"
            >
              {p.label}
            </Link>
            {p.post}
            {". "}
          </span>
        );
      })}
    </p>
  );
}
