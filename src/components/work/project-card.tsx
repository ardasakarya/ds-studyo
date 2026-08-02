import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  priority,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/referanslar/${project.slug}`}
      className={cn("group flex flex-col gap-5", className)}
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-800">
        <Image
          src={project.image}
          alt={`${project.title} ekran görüntüsü`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"
          aria-hidden
        />
        <span className="absolute top-4 left-4 rounded-full border border-line bg-ink-950/70 px-3 py-1 font-mono text-[0.7rem] text-fg-muted backdrop-blur">
          {project.no}
        </span>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-2xl transition-colors duration-300 group-hover:text-accent-soft">
            {project.title}
          </h3>
          <p className="text-sm text-fg-faint">{project.category}</p>
        </div>
        <span className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
          {project.year}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
