"use client";

// Клиентский компонент для картинки карточки города.
// Обрабатывает ошибку загрузки (onError) — когда изображение не доступно
// (например, файл ещё не загружен в R2 или Supabase Storage недоступен),
// показывает градиентный фоллбэк с флагом/буквой вместо битой картинки.

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  gradient: string;
  /** Флаг страны (emoji) для градиентной заглушки */
  emoji?: string;
  /** Первая буква названия города для заглушки */
  letter?: string;
}

export function CityCardImage({ src, alt, gradient, emoji, letter }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-1`}
        aria-hidden
      >
        {emoji && (
          <span className="text-4xl leading-none opacity-70 select-none">
            {emoji}
          </span>
        )}
        {letter && !emoji && (
          <span className="font-serif text-5xl text-cream/40 select-none">
            {letter}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 50vw, 33vw"
      className="object-cover transition duration-700 group-hover:scale-110"
      onError={() => setErrored(true)}
    />
  );
}
