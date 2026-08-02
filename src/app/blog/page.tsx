import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { posts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Fiyatlandırma, teknoloji seçimi, performans ve süreç üzerine yazdıklarımız.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="blog"
        title="Karar vermeden önce okuyun."
        description="Müşterilerimizin en çok sorduğu konuları yazıya döküyoruz: fiyat neye göre değişir, hangi teknoloji ne zaman doğrudur, hız satışı nasıl etkiler."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Blog" }]}
      />

      <section className="section">
        <div className="shell">
          <ul className="flex flex-col">
            {posts.map((post, i) => (
              <li
                key={post.slug}
                className="reveal"
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-4 border-t border-line py-10 transition-colors duration-500 last:border-b hover:bg-ink-800/40 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
                >
                  <div className="flex flex-col gap-1 md:w-40">
                    <span className="font-mono text-xs text-fg-faint">
                      {formatDate(post.date)}
                    </span>
                    <span className="text-xs text-accent">{post.category}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl transition-colors duration-300 group-hover:text-accent-soft">
                      {post.title}
                    </h2>
                    <p className="max-w-2xl text-fg-muted">{post.excerpt}</p>
                  </div>
                  <span className="flex items-center gap-3 text-sm text-fg-faint">
                    {post.readingTime}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
