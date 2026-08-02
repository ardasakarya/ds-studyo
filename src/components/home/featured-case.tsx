import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProject } from "@/lib/data";

const CASE_SLUG = "merada-yonetim";

/** 06 — öne çıkan vaka çalışması. */
export function FeaturedCase() {
  const project = getProject(CASE_SLUG);
  if (!project) return null;

  return (
    <section className="section">
      <div className="shell grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
        <div className="tilt reveal relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-800">
          <Image
            src={project.image}
            alt={`${project.title} arayüzü`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-top"
          />
        </div>

        <div className="reveal flex flex-col gap-8">
          <span className="chapter">vaka çalışması</span>

          <div className="flex flex-col gap-3">
            <h2 className="text-[clamp(1.9rem,3.4vw,2.9rem)]">
              {project.title}
            </h2>
            <p className="text-fg-muted">{project.summary}</p>
          </div>

          <dl className="flex flex-col gap-5 border-l border-line pl-6">
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                sorun
              </dt>
              <dd className="mt-1 text-fg-muted">{project.challenge}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-faint uppercase">
                çözüm
              </dt>
              <dd className="mt-1 text-fg-muted">{project.solution}</dd>
            </div>
          </dl>

          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {project.results.map((result) => (
              <li
                key={result.label}
                className="flex flex-col gap-1 bg-ink-950 px-5 py-5"
              >
                <span className="font-display text-2xl text-mint">
                  {result.value}
                </span>
                <span className="text-xs text-fg-faint">{result.label}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/referanslar/${project.slug}`}
            className="group inline-flex w-fit items-center gap-2 text-sm text-accent"
          >
            Vakayı incele
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
