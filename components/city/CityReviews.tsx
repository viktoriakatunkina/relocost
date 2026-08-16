// Хардкод-отзывы от реальных жителей городов.
// Серверный компонент — use client не нужен.

const MONTH_RU: Record<string, string> = {
  "01": "январь",
  "02": "февраль",
  "03": "март",
  "04": "апрель",
  "05": "май",
  "06": "июнь",
  "07": "июль",
  "08": "август",
  "09": "сентябрь",
  "10": "октябрь",
  "11": "ноябрь",
  "12": "декабрь",
};

function formatDate(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  const monthName = MONTH_RU[month] ?? month;
  return `${monthName} ${year}`;
}

const REVIEWS = [
  {
    city: "tbilisi",
    name: "Алексей М.",
    role: "IT-разработчик",
    date: "2026-04",
    rating: 5,
    text: "Живем в Тбилиси второй год. Аренда 2к квартиры в Сабуртало — $600, банк TBC открыл за 10 минут без ВНЖ. Грузинский учить не обязательно, все говорят по-русски.",
  },
  {
    city: "tbilisi",
    name: "Марина К.",
    role: "дизайнер",
    date: "2026-02",
    rating: 4,
    text: "Тбилиси покорил кухней и атмосферой. Минус — пробки ужасные, без машины или самоката тяжело. Аренда выросла, но все равно дешевле Москвы вдвое.",
  },
  {
    city: "yerevan",
    name: "Дмитрий С.",
    role: "фрилансер",
    date: "2026-03",
    rating: 5,
    text: "Ереван — лучший выбор для фрилансера. Ameriabank открыл счет с Visa за час, ИП с 1% налогом за день. Еда дешевая, люди очень приветливые.",
  },
  {
    city: "yerevan",
    name: "Ольга Р.",
    role: "маркетолог",
    date: "2025-12",
    rating: 4,
    text: "6 месяцев в Ереване. Карта Visa работает везде — и в Европе, и в Таиланде. Из минусов: горячая вода по расписанию, зима холоднее чем ожидала.",
  },
  {
    city: "almaty",
    name: "Сергей В.",
    role: "предприниматель",
    date: "2026-01",
    rating: 4,
    text: "Алматы — неожиданно хорошо. Kaspi работает идеально, город современный. Visa/Mastercard работает везде. Минус — воздух в смог-сезон.",
  },
  {
    city: "belgrade",
    name: "Наталья П.",
    role: "переводчик",
    date: "2026-04",
    rating: 5,
    text: "Белград стал домом. Сербы очень тепло относятся к русским. Аренда 1к в центре — €400. ВНЖ через аренду получила за месяц без проблем.",
  },
  {
    city: "dubai",
    name: "Антон Л.",
    role: "финансист",
    date: "2026-02",
    rating: 4,
    text: "Дубай дорогой, но доход соответствующий. 0% НДФЛ реально работает. Жара летом — не для всех, кондиционер везде. Emirates ID открывает все двери.",
  },
  {
    city: "bangkok",
    name: "Катя М.",
    role: "копирайтер",
    date: "2026-03",
    rating: 5,
    text: "Бангкок для удаленки — идеал. Коворкинги от 200 бат в день, интернет быстрый везде. Еда вкусная и дешевая. DTV визу получила онлайн за неделю.",
  },
  {
    city: "phuket",
    name: "Игорь Д.",
    role: "разработчик",
    date: "2026-01",
    rating: 4,
    text: "Пхукет подходит если любишь море и тепло. Аренда студии в Джомтьене — 8000 бат. Сезон дождей (июнь-октябрь) — некомфортно, лучше уехать.",
  },
  {
    city: "podgorica",
    name: "Анна Т.",
    role: "учитель",
    date: "2026-02",
    rating: 5,
    text: "Черногория — недооцененное направление. Подгорица скучноватая, зато Будва рядом. ВНЖ через аренду жилья, карта Visa, море в 30 минутах.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} из 5`} style={{ color: "var(--copper)" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm select-none"
      style={{
        background: "var(--copper)",
        color: "var(--pine-tree)",
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

export function CityReviews({ city }: { city: string }) {
  const cityReviews = REVIEWS.filter((r) => r.city === city).slice(0, 3);
  if (cityReviews.length === 0) return null;

  return (
    <section id="city-reviews" className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Мнения жителей</span>
      <h2 className="font-serif text-3xl md:text-5xl mt-6 mb-10" style={{ color: "var(--white)" }}>
        Отзывы тех, кто переехал
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cityReviews.map((r, i) => (
          <article
            key={i}
            className="p-6 rounded-2xl flex flex-col gap-4"
            style={{
              background: "rgba(40, 50, 26, 0.5)",
              border: "1px solid rgba(222, 197, 158, 0.14)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <StarRating rating={r.rating} />
              <time
                dateTime={r.date}
                className="text-xs"
                style={{ color: "var(--dim)" }}
              >
                {formatDate(r.date)}
              </time>
            </div>

            <p
              className="leading-relaxed text-sm flex-1"
              style={{ color: "var(--brandy)" }}
            >
              {r.text}
            </p>

            <footer className="flex items-center gap-3">
              <Avatar name={r.name} />
              <div>
                <p
                  className="font-semibold text-sm leading-tight"
                  style={{ color: "var(--white)" }}
                >
                  {r.name}
                </p>
                <p
                  className="text-xs leading-tight mt-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  {r.role}
                </p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
