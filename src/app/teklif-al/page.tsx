import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teklif al",
  description:
    "Dört soruda kapsamı netleştirin, 48 saat içinde net fiyatlı teklifle dönelim.",
};

const promises = [
  "Keşif görüşmesi ücretsiz",
  "48 saat içinde dönüş",
  "Sabit fiyat, sürpriz kalem yok",
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="teklif"
        title="Projeni anlat, kapsamı birlikte netleştirelim."
        description="Dört kısa soru, sonra iletişim bilgin. Cevaplarına göre kapsam önerisi ve net fiyat hazırlıyoruz."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Teklif al" }]}
      >
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          {promises.map((promise) => (
            <li key={promise} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-mint" aria-hidden />
              {promise}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section">
        <div className="shell reveal max-w-4xl">
          <Suspense
            fallback={
              <div className="card h-96 animate-pulse-soft p-8" aria-hidden />
            }
          >
            <QuoteWizard />
          </Suspense>

          <p className="mt-6 text-center text-sm text-fg-faint">
            Formu doldurmak istemiyor musunuz?{" "}
            <a
              href={site.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-accent transition-colors hover:text-accent-soft"
            >
              WhatsApp&apos;tan yazın
            </a>{" "}
            veya{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-accent transition-colors hover:text-accent-soft"
            >
              {site.contact.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
