import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProjectCard } from "@/components/work/project-card";
import { featuredProjects } from "@/lib/data";

/** 05 — seçili işler. */
export function SelectedWork() {
  return (
    <section id="referanslar" className="section">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            no="03"
            eyebrow="referanslar"
            lines={["Yayında olan", "gerçek işler."]}
            description="Hepsi canlı, hepsi ölçülüyor. Kartlara girip nasıl kurulduklarını okuyabilirsiniz."
          />
          <ButtonLink href="/referanslar" variant="outline" className="reveal shrink-0">
            Tüm referanslar
          </ButtonLink>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <div
              key={project.slug}
              className="reveal"
              style={
                {
                  "--reveal-delay": `${(i % 2) * 110}ms`,
                } as React.CSSProperties
              }
            >
              <ProjectCard
                project={project}
                priority={i === 0}
                className={i % 2 === 1 ? "md:mt-20" : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
