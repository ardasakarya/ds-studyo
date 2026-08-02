import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ProjectCard } from "@/components/work/project-card";
import {
  faqs,
  getProject,
  getService,
  processSteps,
  services,
} from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedProjects
    .map((projectSlug) => getProject(projectSlug))
    .filter((project) => project !== undefined);

  return (
    <>
      <PageHero
        no={service.no}
        eyebrow={service.tag}
        title={service.title}
        description={service.intro}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hizmetler", href: "/hizmetler" },
          { label: service.title },
        ]}
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ButtonLink href={`/teklif-al?tip=${service.slug}`}>
            Bu hizmet için teklif al
          </ButtonLink>
          <ButtonLink href={`/paketler?hizmet=${service.slug}`} variant="outline">
            Paketlere ve fiyatlara bak
          </ButtonLink>
        </div>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
          <div className="flex flex-col gap-1 bg-ink-950 px-6 py-5">
            <dt className="text-sm text-fg-faint">Başlangıç fiyatı</dt>
            <dd className="font-display text-xl">{service.priceFrom}</dd>
          </div>
          <div className="flex flex-col gap-1 bg-ink-950 px-6 py-5">
            <dt className="text-sm text-fg-faint">Tipik süre</dt>
            <dd className="font-display text-xl">{service.timeline}</dd>
          </div>
          <div className="flex flex-col gap-1 bg-ink-950 px-6 py-5">
            <dt className="text-sm text-fg-faint">Teknolojiler</dt>
            <dd className="text-sm text-fg-muted">
              {service.tech.slice(0, 3).join(" · ")}
            </dd>
          </div>
        </dl>
      </PageHero>

      {/* Kimin için */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="kimin için"
            lines={["Bu hizmet", "kime uygun?"]}
          />
          <ul className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {service.forWho.map((item, i) => (
              <li
                key={item}
                className="reveal flex items-start gap-4 bg-ink-950 px-7 py-6"
                style={
                  { "--reveal-delay": `${i * 90}ms` } as React.CSSProperties
                }
              >
                <Check className="mt-1 size-4 shrink-0 text-mint" strokeWidth={2} aria-hidden />
                <span className="text-fg-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kapsam + teslimatlar */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="kapsam" lines={["Neler yapıyoruz?"]} />
            <ol className="flex flex-col">
              {service.scope.map((item, i) => (
                <li
                  key={item}
                  className="reveal flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                  style={
                    { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties
                  }
                >
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-fg-muted">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="teslimat" lines={["Elinize ne geçiyor?"]} />
            <ul className="flex flex-col gap-3">
              {service.deliverables.map((item, i) => (
                <li
                  key={item}
                  className="reveal card flex items-center gap-4 px-6 py-5"
                  style={
                    { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties
                  }
                >
                  <Check className="size-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
                  <span className="text-fg-muted">{item}</span>
                </li>
              ))}
            </ul>

            <div className="reveal flex flex-wrap gap-2">
              {service.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-ink-800/70 px-3 py-1 text-sm text-fg-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Süreç */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="süreç"
            lines={["Nasıl ilerliyoruz?"]}
            description="Her hizmette aynı dört adım: kapsamı netleştir, tasarla, geliştir, yayına al."
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li
                key={step.no}
                className="reveal card flex flex-col gap-3 p-7"
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="font-mono text-xs text-accent">{step.no}</span>
                <h3 className="text-lg">{step.title}</h3>
                <p className="text-sm text-fg-muted">{step.description}</p>
                <span className="mt-auto pt-3 text-xs text-fg-faint">
                  {step.duration}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* İlgili işler */}
      {related.length > 0 ? (
        <section className="section">
          <div className="shell">
            <SectionHeading
              eyebrow="ilgili işler"
              lines={["Bu alanda", "yaptıklarımız."]}
            />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((project, i) => (
                <div
                  key={project.slug}
                  className="reveal"
                  style={
                    { "--reveal-delay": `${i * 90}ms` } as React.CSSProperties
                  }
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* SSS */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="sık sorulanlar" lines={["Merak edilenler."]} />
            <Link
              href="/hizmetler"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-accent"
            >
              Diğer hizmetler
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </div>
          <div className="reveal">
            <Accordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>
    </>
  );
}
