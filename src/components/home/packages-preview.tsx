import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/pricing/package-card";
import { pricingNote } from "@/lib/data";
import { getServicePricing } from "@/lib/pricing";

/** 11 — paketler önizlemesi (web sitesi kademeleri). */
export function PackagesPreview() {
  const pricing = getServicePricing("web-sitesi")!;

  return (
    <section id="paketler" className="section">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            no="05"
            eyebrow="paketler"
            lines={["Fiyatı baştan", "biliyorsunuz."]}
            description="Web sitesi paketleri aşağıda. Mobil, e-ticaret, özel yazılım, SEO, reklam ve diğer 10 hizmetin paketleri paketler sayfasında."
          />
          <ButtonLink href="/paketler" variant="outline" className="reveal shrink-0">
            Tüm paketler
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {pricing.tiers.map((tier, i) => (
            <div
              key={tier.slug}
              className="reveal"
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <PackageCard
                tier={tier}
                unit={pricing.unit}
                href={`/paketler?hizmet=${pricing.service}&paket=${tier.slug}`}
                cta="Bu paketle başla"
              />
            </div>
          ))}
        </div>

        <p className="reveal mt-8 max-w-2xl text-sm text-fg-faint">
          {pricingNote}
        </p>
      </div>
    </section>
  );
}
