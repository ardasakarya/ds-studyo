import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/data";

/** 15 — sık sorulanlar. */
export function FaqSection() {
  return (
    <section className="section">
      <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="sık sorulanlar"
            lines={["Merak edilenler."]}
            description="Cevabını bulamadığınız bir soru varsa yazın, aynı gün dönüyoruz."
          />
        </div>

        <div className="reveal">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
