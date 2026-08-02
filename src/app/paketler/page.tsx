import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { PricingExplorer } from "@/components/pricing/pricing-explorer";
import { faqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paketler ve fiyatlar",
  description:
    "15 hizmetin tamamı için üç kademeli paketler, özellik karşılaştırması ve adım adım fiyat hesaplayıcı. Şeffaf başlangıç fiyatları.",
};

/** Paket kartlarından ve hizmet sayfalarından gelen derin bağlantılar:
 *  /paketler?hizmet=web-sitesi&paket=web-sitesi-kurumsal */
type Params = {
  searchParams: Promise<{ hizmet?: string; paket?: string }>;
};

export default async function PricingPage({ searchParams }: Params) {
  const { hizmet, paket } = await searchParams;

  return (
    <>
      <PageHero
        no="04"
        eyebrow="paketler"
        title="Fiyatı baştan biliyorsunuz."
        description="Her hizmetin üç kademesi, neyin neye dahil olduğu ve başlayan fiyatı aşağıda. Kapsamınızı seçin, tahmini aralığı anında görün; net teklif ücretsiz keşif görüşmesinden sonra sabitlenir."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Paketler" }]}
      />

      <PricingExplorer hizmet={hizmet} paket={paket} />

      {/* Fiyat SSS */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              no="04"
              eyebrow="fiyat hakkında"
              lines={["Fiyatı ne", "belirliyor?"]}
              description="Sayfa/ekran sayısı, özel geliştirme, entegrasyonlar ve teslim süresi."
            />
          </div>
          <div className="reveal">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
