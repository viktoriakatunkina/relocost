"use client";

import { MobileCarousel } from "@/components/MobileCarousel";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog";

export function BlogCarouselMobile({ posts }: { posts: BlogPost[] }) {
  return (
    <MobileCarousel className="px-6">
      {posts.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </MobileCarousel>
  );
}
