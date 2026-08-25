// Данные чек-листа переезда (статичный контент-планировщик). Вынесено из
// lib/checklist.ts отдельно, БЕЗ react/хуков — чтобы серверные страницы могли
// импортировать шаги (для HowTo-разметки) без ошибки «useEffect в Server
// Component». Хук и localStorage-логика — в lib/checklist.ts ("use client").

export type ChecklistVariant = "foreign" | "russia";
export type ChecklistGroupKey = "before" | "arrival" | "month";

export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
  group: ChecklistGroupKey;
  // Необязательная ссылка на полезный материал по теме шага (статья блога
  // или инструмент сайта) — показывается прямо внутри пункта чек-листа.
  link?: { href: string; label: string };
};

export const GROUP_LABELS: Record<ChecklistGroupKey, string> = {
  before: "До переезда",
  arrival: "По прибытии",
  month: "Первый месяц",
};

export const VARIANT_LABELS: Record<ChecklistVariant, string> = {
  foreign: "За границу",
  russia: "По России",
};

export const CHECKLIST_STEPS: Record<ChecklistVariant, ChecklistStep[]> = {
  foreign: [
    {
      id: "passport",
      group: "before",
      title: "Проверьте загранпаспорт",
      description:
        "Срок действия — минимум 1,5 года к дате въезда. При активных поездках оформите второй загранпаспорт.",
    },
    {
      id: "basis",
      group: "before",
      title: "Выберите основание и подайте на визу/ВНЖ",
      description:
        "Работа, учёба, цифровой кочевник, бизнес, недвижимость, воссоединение семьи — от основания зависят сроки и документы.",
    },
    {
      id: "apostille",
      group: "before",
      title: "Апостиль и переводы документов",
      description:
        "Диплом, свидетельства о рождении и браке, справки — заранее проставьте апостиль и сделайте присяжный перевод.",
      link: { href: "/blog/apostil-na-dokumenty-2026", label: "Где поставить апостиль и сколько это стоит" },
    },
    {
      id: "money",
      group: "before",
      title: "Сформируйте финансовую подушку",
      description:
        "Заложите 3–6 месяцев расходов плюс депозит и первый платёж за жильё. Подумайте, как переводить деньги за рубеж.",
      link: { href: "/blog/skolko-deneg-nuzhno-na-pereezd-2026", label: "Сколько денег нужно на переезд — расчёт" },
    },
    {
      id: "home-ru",
      group: "before",
      title: "Решите вопрос с текущим жильём",
      description:
        "Продать, сдать в аренду или оставить — и забронируйте отель/квартиру на первые недели на новом месте.",
      link: { href: "/blog/ipoteka-v-rossii-pri-pereezde-sdat-ili-pogasit-2026", label: "Ипотека при переезде: сдать или погасить" },
    },
    {
      id: "bank",
      group: "arrival",
      title: "Откройте местный счёт и карту",
      description:
        "Локальная карта нужна для аренды, связи и повседневных платежей. Уточните список документов заранее.",
      link: { href: "/blog/kak-otkryt-schet-v-zarubezhnom-banke-2026", label: "Как открыть счёт в зарубежном банке" },
    },
    {
      id: "sim",
      group: "arrival",
      title: "Подключите связь (eSIM или местная SIM)",
      description:
        "eSIM выручит в первые дни, затем оформите местный номер — он часто нужен для банка и госуслуг.",
    },
    {
      id: "insurance",
      group: "arrival",
      title: "Оформите медицинскую страховку",
      description:
        "До получения местной страховки держите действующий полис путешественника с адекватным покрытием.",
      link: { href: "/blog/meditsinskaya-strahovka-za-rubezhom", label: "Как выбрать медицинскую страховку" },
    },
    {
      id: "rent",
      group: "month",
      title: "Снимите долгосрочное жильё",
      description:
        "Заключите договор, при необходимости оформите регистрацию по адресу — она часто нужна для ВНЖ.",
    },
    {
      id: "residence",
      group: "month",
      title: "Подайте на ВНЖ или продлите статус",
      description:
        "Соберите пакет документов под выбранное основание и подайте в установленный срок после въезда.",
    },
    {
      id: "tax",
      group: "month",
      title: "Разберитесь с налогами и счетами",
      description:
        "Уведомите ФНС о зарубежном счёте, отслеживайте 183 дня для налогового резидентства РФ.",
      link: { href: "/blog/nalogovoe-rezidentstvo-183-dnya-2026", label: "Правило 183 дней для налогового резидентства" },
    },
  ],
  russia: [
    {
      id: "city",
      group: "before",
      title: "Выберите город и район",
      description:
        "Изучите рынок аренды, инфраструктуру и транспорт. Сравните бюджет на жизнь в калькуляторе на странице города.",
      link: { href: "/search", label: "Сравнить города в калькуляторе" },
    },
    {
      id: "work",
      group: "before",
      title: "Решите вопрос с работой",
      description:
        "Договоритесь об удалёнке или переводе, либо найдите вакансии на месте до переезда.",
    },
    {
      id: "money-ru",
      group: "before",
      title: "Накопите на переезд и депозит",
      description:
        "Заложите переезд, депозит и первый месяц аренды, плюс подушку на период обустройства.",
    },
    {
      id: "kids",
      group: "before",
      title: "Узнайте про сад и школу",
      description:
        "Если переезжаете с детьми — заранее уточните наличие мест и порядок записи по новому адресу.",
    },
    {
      id: "lease",
      group: "arrival",
      title: "Снимите жильё и оформите договор",
      description:
        "Заключите договор аренды — он понадобится для временной регистрации и оформления услуг.",
    },
    {
      id: "registration",
      group: "arrival",
      title: "Сделайте временную регистрацию",
      description:
        "Зарегистрируйтесь по новому адресу — это нужно для поликлиники, школы и ряда госуслуг.",
    },
    {
      id: "move-things",
      group: "arrival",
      title: "Перевезите вещи",
      description:
        "Выберите транспортную компанию или переезд «под ключ», заранее рассчитайте объём и сроки.",
    },
    {
      id: "clinic",
      group: "month",
      title: "Прикрепитесь к поликлинике",
      description:
        "Подайте заявление на прикрепление по полису ОМС к поликлинике рядом с новым домом.",
    },
    {
      id: "docs-ru",
      group: "month",
      title: "Обновите адрес в документах",
      description:
        "Госуслуги, банки, подписки, доставка — обновите адрес и реквизиты под новое место жительства.",
    },
    {
      id: "settle",
      group: "month",
      title: "Освойтесь на новом месте",
      description:
        "Найдите врача, школу или сад, разберитесь с транспортом и познакомьтесь с районом.",
    },
  ],
};
