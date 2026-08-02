import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { posts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${post.category} · ${post.readingTime}`}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      >
        <span className="mt-2 font-mono text-xs text-fg-faint">
          {formatDate(post.date)}
        </span>
      </PageHero>

      <article className="section">
        <div className="shell reveal max-w-3xl">
          {/* TODO: yazı içeriği. İçerik çoğalınca MDX'e (content/blog/*.mdx) taşınacak. */}
          <div className="flex flex-col gap-6 text-lg text-fg-muted">
            <p>
              Bu yazının içeriği henüz yazılmadı. Taslak yapıda yazı gövdesi,
              ara başlıklar, alıntı ve kod bloğu stilleri hazır bekliyor.
            </p>
            <h2 className="mt-6 text-[clamp(1.5rem,3vw,2rem)] text-fg">
              Ara başlık
            </h2>
            <p>
              Paragraf metni bu genişlikte akar. Satır yüksekliği ve ölçü
              (max-width) uzun okumada göz yormayacak şekilde ayarlandı.
            </p>
            <blockquote className="border-l-2 border-accent pl-6 text-fg">
              Öne çıkarmak istediğiniz cümle bu şekilde görünür.
            </blockquote>
            <p>
              Yazılar çoğaldığında bu sayfa MDX içeriğinden beslenecek; şimdilik
              yapı ve tipografi taslağı duruyor.
            </p>
          </div>

          <Link
            href="/blog"
            className="group mt-12 inline-flex items-center gap-2 text-sm text-accent"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
            Tüm yazılar
          </Link>
        </div>
      </article>
    </>
  );
}
