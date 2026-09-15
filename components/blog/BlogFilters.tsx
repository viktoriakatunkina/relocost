"use client";

import { useState, useMemo } from "react";
import type { BlogPostCard } from "@/lib/blog";
import { BlogCard } from "./BlogCard";
import { TagFilterBar } from "./TagFilterBar";

const PAGE_SIZE = 12;

export function BlogFilters({ posts }: { posts: BlogPostCard[] }) {
  // Теги, отсортированные по частоте (популярные — заметнее и в топе выпадающего списка).
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) if (p.tag) counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
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
      <TagFilterBar
        tagCounts={tagCounts}
        activeTag={activeTag}
        onChange={handleTagChange}
      />

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
