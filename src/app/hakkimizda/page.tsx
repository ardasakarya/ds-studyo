import type { Metadata } from "next";
import { AboutMotionSections } from "@/components/about/about-motion-sections";
import { TeamLanyards } from "@/components/about/team-lanyards";
import { Testimonials } from "@/components/home/testimonials";
import { WhyUs } from "@/components/home/why-us";
import { PageHero } from "@/components/layout/page-hero";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kim olduğumuzu, nasıl başladığımızı ve ürünleri nasıl geliştirdiğimizi anlatıyoruz.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        no="05"
        eyebrow="hakkımızda"
        title="Biz kimiz?"
        description={`${site.name}, ${site.founded} yılında kurulan; strateji, tasarım ve yazılımı aynı masada buluşturan küçük bir çekirdek ekip.`}
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Hakkımızda" }]}
        showIntro={false}
      />

      <TextGradientScroll
        eyebrow="kimlik / 01"
        heading="Biz kimiz?"
        side="right"
        type="word"
        textOpacity="soft"
        text="Strateji, tasarım ve yazılımı aynı masada buluşturan küçük bir çekirdek ekibiz. Fikri birlikte netleştirir, tasarlar ve çalışan ürüne dönüştürürüz."
      />

      <TextGradientScroll
        eyebrow="hikâye / 02"
        heading="Nasıl başladı?"
        type="word"
        textOpacity="soft"
        text="İyi yazılım arayan markaların iki uç arasında kaldığını gördük. Ajans disiplinini doğrudan iletişim, net kapsam ve devredilebilir kodla birleştirmek için bu stüdyoyu kurduk."
      />

      <AboutMotionSections />

      <TeamLanyards />

      <WhyUs />

      <Testimonials />
    </>
  );
}
