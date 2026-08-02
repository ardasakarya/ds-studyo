import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Çerez politikası",
  description: "Sitede kullanılan çerezler ve amaçları.",
};

export default function CookiePage() {
  return (
    <LegalPage
      title="Çerez politikası"
      updated="—"
      intro="Bu sitede hangi çerezleri neden kullandığımızı açıklıyoruz."
      sections={[
        {
          heading: "Zorunlu çerezler",
          body: "Sitenin çalışması için gereken temel çerezler. Devre dışı bırakılamaz, kişisel veri içermez.",
        },
        {
          heading: "Analitik çerezler",
          body: "Sayfaların nasıl kullanıldığını anlamak için anonim ölçüm yapar. Ziyaretçileri kişisel olarak tanımlamaz.",
        },
        {
          heading: "Tercih yönetimi",
          body: "Tarayıcı ayarlarınızdan çerezleri istediğiniz zaman silebilir veya engelleyebilirsiniz.",
        },
      ]}
    />
  );
}
