"use client";

import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

const PAGE_SIZE = 12;

export function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) if (p.tag) set.add(p.tag);
    return Array.from(set).sort();
  }, [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = activeTag
    ? posts.filter((p) => p.tag === activeTag)
    : posts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleTagChange(tag: string | null) {
    setActiveTag(tag);
    setPage(1);
  }

  return (
    <>
      {/* Фильтры по тегам */}
      <div className="flex flex-wrap gap-2 mb-10">
        <TagButton
          label="Все"
          active={activeTag === null}
          onClick={() => handleTagChange(null)}
        />
        {tags.map((t) => (
          <TagButton
            key={t}
            label={t}
            active={activeTag === t}
            onClick={() => handleTagChange(t)}
          />
        ))}
      </div>

      {/* Счётчик */}
      {filtered.length > 0 && (
        <p className="text-brandy/50 text-sm mb-6">
          {filtered.length} {pluralPosts(filtered.length)}
          {totalPages > 1 && ` — страница ${safePage} из ${totalPages}`}
        </p>
      )}

      {/* Список статей */}
      {paginated.length === 0 ? (
        <p className="text-brandy/70 text-center py-12">
          В этой категории пока нет статей.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <Pagination
          current={safePage}
          total={totalPages}
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}

// Склонение
function pluralPosts(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "статья";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "статьи";
  return "статей";
}

function TagButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-pill border text-sm transition ${
        active
          ? "bg-copper text-pine-tree border-copper"
          : "border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30"
      }`}
    >
      {label}
    </button>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  // Строим массив страниц с «...»
  function getPages(): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    const addPage = (n: number) => pages.push(n);
    const addDots = () => {
      if (pages[pages.length - 1] !== "...") pages.push("...");
    };

    addPage(1);
    if (current > 3) addDots();
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      addPage(i);
    }
    if (current < total - 2) addDots();
    addPage(total);
    return pages;
  }

  const pages = getPages();

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-12 flex-wrap"
      aria-label="Навигация по страницам блога"
    >
      {/* Предыдущая */}
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="h-10 px-4 rounded-xl border text-sm transition disabled:opacity-30 disabled:cursor-not-allowed border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30 disabled:hover:border-cream/10 disabled:hover:text-brandy/80"
        aria-label="Предыдущая страница"
      >
        &larr; Предыдущая
      </button>

      {/* Номера страниц */}
      <div className="flex items-center gap-1 mx-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="w-10 h-10 flex items-center justify-center text-brandy/40 text-sm select-none"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === current ? "page" : undefined}
              className={`w-10 h-10 rounded-xl border text-sm font-medium transition ${
                p === current
                  ? "bg-copper border-copper text-pine-tree"
                  : "border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Следующая */}
      <button
        type="button"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="h-10 px-4 rounded-xl border text-sm transition disabled:opacity-30 disabled:cursor-not-allowed border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30 disabled:hover:border-cream/10 disabled:hover:text-brandy/80"
        aria-label="Следующая страница"
      >
        Следующая &rarr;
      </button>
    </nav>
  );
}
