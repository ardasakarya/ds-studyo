import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ServiceScene } from "@/components/services/service-scene";
import { CraftNotes } from "@/components/services/craft-notes";
import { Capabilities } from "@/components/home/capabilities";
import { serviceGroups, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Web sitesi, web ve mobil uygulama, e-ticaret, özel yazılım, yapay zekâ, SEO ve reklamdan bakım desteğine kadar 15 hizmet başlığı.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        no="02"
        eyebrow="hizmetler"
        title="Bir ürünün ihtiyacı olan her katman."
        description={`Fikirden yayına, yayından büyümeye kadar ${services.length} başlıkta hizmet veriyoruz. Hepsini tek ekipten almanız gerekmez — ihtiyacınız olanı seçin.`}
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      {/* Üç katman: sahnedeki kartların hangi başlığa ait olduğu etiketinden okunur */}
      <section className="pb-[clamp(2.5rem,6vw,4.5rem)]">
        <div className="shell">
          <ul className="reveal grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
            {serviceGroups.map((group, i) => (
              <li
                key={group.id}
                className="flex flex-col gap-2 bg-ink-950 px-6 py-6"
              >
                <span className="font-mono text-[0.7rem] tracking-[0.18em] text-fg-faint uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl">{group.title}</h2>
                <p className="text-sm text-fg-muted">{group.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceScene services={services} />

      <CraftNotes />

      <Capabilities />
    </>
  );
}
