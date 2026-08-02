import { PageHero } from "@/components/layout/page-hero";

/**
 * Yasal sayfa iskeleti.
 * TODO: metinler hukuk danışmanı onayından sonra kesinleşecek.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <>
      <PageHero
        eyebrow="yasal"
        title={title}
        description={intro}
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: title }]}
      >
        <span className="mt-2 font-mono text-xs text-fg-faint">
          Son güncelleme: {updated}
        </span>
      </PageHero>

      <section className="section">
        <div className="shell max-w-3xl">
          <div className="flex flex-col gap-10">
            {sections.map((section, i) => (
              <div
                key={section.heading}
                className="reveal flex flex-col gap-3"
                style={
                  { "--reveal-delay": `${i * 60}ms` } as React.CSSProperties
                }
              >
                <h2 className="text-[clamp(1.4rem,2.6vw,1.8rem)]">
                  {section.heading}
                </h2>
                <p className="text-fg-muted">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
