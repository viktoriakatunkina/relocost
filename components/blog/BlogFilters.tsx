"use client";

import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

export function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) if (p.tag) set.add(p.tag);
    return Array.from(set).sort();
  }, [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag
    ? posts.filter((p) => p.tag === activeTag)
    : posts;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <TagButton
          label="Все"
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {tags.map((t) => (
          <TagButton
            key={t}
            label={t}
            active={activeTag === t}
            onClick={() => setActiveTag(t)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-brandy/70 text-center py-12">
          В этой категории пока нет статей.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </>
  );
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
          ? "bg-pale-copper text-pine-tree border-pale-copper"
          : "border-dingley/40 text-brandy/80 hover:text-cream hover:border-dingley/70"
      }`}
    >
      {label}
    </button>
  );
}
