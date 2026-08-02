import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProject, getService, projects } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const usedServices = project.services
    .map((serviceSlug) => getService(serviceSlug))
    .filter((service) => service !== undefined);

  return (
    <>
      <PageHero
        no={project.no}
        eyebrow={project.year}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Referanslar", href: "/referanslar" },
          { label: project.title },
        ]}
      >
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="group mt-2 inline-flex w-fit items-center gap-2 text-sm text-accent"
        >
          {project.domain}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </a>
      </PageHero>

      <section className="section">
        <div className="shell flex flex-col gap-16">
          <div className="reveal relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-800">
            <Image
              src={project.image}
              alt={`${project.title} ekran görüntüsü`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <dl className="reveal flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <div className="flex flex-col gap-1 border-t border-line pt-4">
                <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                  kategori
                </dt>
                <dd className="text-fg">{project.category}</dd>
              </div>
              <div className="flex flex-col gap-1 border-t border-line pt-4">
                <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                  yıl
                </dt>
                <dd className="text-fg">{project.year}</dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                  hizmetler
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {usedServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/hizmetler/${service.slug}`}
                      className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
                    >
                      {service.title}
                    </Link>
                  ))}
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                  teknoloji
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line bg-ink-800/70 px-3 py-1 text-sm text-fg-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-12">
              <div className="reveal flex flex-col gap-3">
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Sorun</h2>
                <p className="text-lg text-fg-muted">{project.challenge}</p>
              </div>
              <div className="reveal flex flex-col gap-3">
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Çözüm</h2>
                <p className="text-lg text-fg-muted">{project.solution}</p>
              </div>

              <ul className="reveal grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
                {project.results.map((result) => (
                  <li
                    key={result.label}
                    className="flex flex-col gap-1 bg-ink-950 px-6 py-6"
                  >
                    <span className="font-display text-2xl text-mint">
                      {result.value}
                    </span>
                    <span className="text-sm text-fg-faint">
                      {result.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="sıradaki iş" lines={[next.title]} />
          <Link
            href={`/referanslar/${next.slug}`}
            className="group reveal mt-8 inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
          >
            {next.category}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>
      </section>
    </>
  );
}
