import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { featuredServices, services } from "@/lib/data";

/** 04 — ne yapıyoruz (öne çıkan 6 hizmet). */
export function ServicesOverview() {
  return (
    <section id="hizmetler" className="section">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            no="02"
            eyebrow="hizmetler"
            lines={["Bir ürünün ihtiyacı", "olan her katman."]}
            description={`Fikirden yayına kadar tüm süreci tek ekipten alırsınız. Toplam ${services.length} hizmet başlığı.`}
          />
          <ButtonLink href="/hizmetler" variant="outline" className="reveal shrink-0">
            Tüm hizmetler
          </ButtonLink>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, i) => (
            <li
              key={service.slug}
              className="reveal aspect-square"
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <Link
                href={`/paketler?hizmet=${service.slug}`}
                className="card service-card hairline-top group flex size-full flex-col gap-4 p-6 sm:gap-5 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-ink-700/60 text-accent transition-colors duration-500 group-hover:border-accent/40">
                    <Icon name={service.icon} className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-fg-faint">
                    {service.no}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl">{service.title}</h3>
                  <p className="text-[0.95rem] text-fg-muted">
                    {service.summary}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-[0.7rem] tracking-[0.14em] text-fg-faint uppercase">
                    {service.tag}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-fg-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
