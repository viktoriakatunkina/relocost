"use client";

// Клиентский компонент для картинки карточки города.
// Обрабатывает ошибку загрузки (onError) — когда изображение не доступно
// (например, файл ещё не загружен в R2 или Supabase Storage недоступен),
// показывает градиентный фоллбэк вместо битой картинки.

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  gradient: string;
}

export function CityCardImage({ src, alt, gradient }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        aria-hidden
      />
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
