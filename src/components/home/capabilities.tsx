import { SectionHeading } from "@/components/ui/section-heading";

const groups = [
  {
    title: "Arayüz",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Motion"],
  },
  {
    title: "Sunucu & veri",
    items: ["Node.js", "Python", "PostgreSQL", "MySQL", "Supabase", "Redis"],
  },
  {
    title: "Mobil",
    items: ["React Native", "Expo", "Swift", "Firebase", "App Store", "Play"],
  },
  {
    title: "Altyapı",
    items: ["Vercel", "Docker", "Cloudflare", "Hetzner", "Sentry", "GitHub"],
  },
];

/** 08 — teknoloji yığını. */
export function Capabilities() {
  return (
    <section id="teknoloji" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="teknoloji"
          lines={["Modaya göre değil,", "işe göre seçiyoruz."]}
          description="Her projede aynı araçları kullanmıyoruz. Kapsam, bütçe ve ekibinizin devralabilirliği neyi gerektiriyorsa onu kuruyoruz."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, i) => (
            <div
              key={group.title}
              className="reveal flex flex-col gap-4 bg-ink-950 p-7"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <h3 className="font-mono text-xs tracking-[0.18em] text-fg-faint uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-ink-800/70 px-3 py-1 text-sm text-fg-muted transition-colors duration-300 hover:border-accent/40 hover:text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
