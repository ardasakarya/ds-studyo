import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { posts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

/** 14 — blogdan son yazılar. */
export function Journal() {
  return (
    <section className="section">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="blog"
            lines={["Karar vermeden", "önce okuyun."]}
            description="Fiyat, teknoloji ve süreç hakkında sık sorulan konuları yazıyoruz."
          />
          <ButtonLink href="/blog" variant="outline" className="reveal shrink-0">
            Tüm yazılar
          </ButtonLink>
        </div>

        <ul className="mt-14 flex flex-col">
          {posts.map((post, i) => (
            <li
              key={post.slug}
              className="reveal"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-4 border-t border-line py-8 transition-colors duration-500 last:border-b hover:bg-ink-800/40 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
              >
                <span className="font-mono text-xs text-fg-faint md:w-32">
                  {formatDate(post.date)}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl transition-colors duration-300 group-hover:text-accent-soft">
                    {post.title}
                  </h3>
                  <p className="max-w-xl text-sm text-fg-muted">
                    {post.excerpt}
                  </p>
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
  );
}
