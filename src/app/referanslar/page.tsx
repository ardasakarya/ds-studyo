import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ReferenceScroll } from "@/components/work/reference-scroll";
import { TrustStrip } from "@/components/home/trust-strip";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "Gayrimenkul, turizm, medikal, kuyumculuk ve endüstri sektörlerinde yayında olan web siteleri, uygulamalar ve platformlar.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        no="03"
        eyebrow="referanslar"
        title="Yayında olan gerçek işler."
        description="Hepsi canlı, hepsi ölçülüyor. Her projede ne yaptığımızı, hangi teknolojiyi kullandığımızı yazdık; siteye tek tıkla gidebilirsiniz."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Referanslar" }]}
      >
        <p className="edge-note mt-2">
          kaydırdıkça açılır — {projects.length} proje
        </p>
      </PageHero>

      <section className="section pt-0">
        <ReferenceScroll projects={projects} />
      </section>

      <TrustStrip />
    </>
  );
}
