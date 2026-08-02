"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/work/project-card";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Tümü", match: () => true },
  {
    id: "web",
    label: "Web sitesi",
    match: (p: Project) => p.services.includes("web-sitesi"),
  },
  {
    id: "uygulama",
    label: "Uygulama",
    match: (p: Project) =>
      p.services.includes("web-uygulamasi") ||
      p.services.includes("mobil-uygulama"),
  },
  {
    id: "eticaret",
    label: "E-ticaret",
    match: (p: Project) => p.services.includes("e-ticaret"),
  },
] as const;

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");
  const current = filters.find((f) => f.id === active)!;
  const visible = projects.filter(current.match);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActive(filter.id)}
            aria-pressed={active === filter.id}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all duration-300",
              active === filter.id
                ? "border-accent bg-accent/12 text-fg"
                : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-fg-muted">Bu kategoride henüz yayınlanmış iş yok.</p>
      ) : null}
    </div>
  );
}
