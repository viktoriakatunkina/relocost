"use client";

import { useEffect, useState } from "react";

// Языки сайта. Пока активен только русский — остальные подключены как задел
// (переключатель работает, переводы добавим отдельной фазой).
export type LangCode = "ru" | "kk" | "uz" | "hy" | "az";

export type Lang = {
  code: LangCode;
  /** Самоназвание языка (как принято показывать в переключателях). */
  native: string;
  /** Короткий код для кнопки в шапке. */
  short: string;
  flag: string;
  /** Русское название (для подписей в нашем интерфейсе/плашках). */
  ru: string;
};

export const LANGUAGES: Lang[] = [
  { code: "ru", native: "Русский", short: "RU", flag: "🇷🇺", ru: "русский" },
  { code: "kk", native: "Қазақша", short: "KK", flag: "🇰🇿", ru: "казахский" },
  { code: "uz", native: "Oʻzbekcha", short: "UZ", flag: "🇺🇿", ru: "узбекский" },
  { code: "hy", native: "Հայերեն", short: "HY", flag: "🇦🇲", ru: "армянский" },
  { code: "az", native: "Azərbaycanca", short: "AZ", flag: "🇦🇿", ru: "азербайджанский" },
];

export const DEFAULT_LANG: LangCode = "ru";

const STORAGE_KEY = "relocost_lang";
const EVENT = "relocost:lang-changed";
const VALID = LANGUAGES.map((l) => l.code);

export function getLangMeta(code: LangCode): Lang {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function readLang(): LangCode {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && VALID.includes(raw as LangCode)) return raw as LangCode;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANG;
}

export function writeLang(code: LangCode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, code);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { code } }));
}

export function useLang(): LangCode {
  const [code, setCode] = useState<LangCode>(DEFAULT_LANG);
  useEffect(() => {
    setCode(readLang());
    function onChange() {
      setCode(readLang());
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return code;
}
