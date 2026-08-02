import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik politikası",
  description: `${site.name} gizlilik politikası.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik politikası"
      updated="—"
      intro={`${site.name} olarak kişisel verilerinizi nasıl işlediğimizi açıklıyoruz.`}
      sections={[
        {
          heading: "Hangi verileri topluyoruz",
          body: "İletişim formu ve teklif sihirbazı üzerinden paylaştığınız ad, e-posta, telefon ve proje bilgileri. Ayrıca site kullanımına dair anonim analitik verileri.",
        },
        {
          heading: "Verileri ne için kullanıyoruz",
          body: "Yalnızca talebinize dönüş yapmak, teklif hazırlamak ve hizmet sunmak için. Üçüncü taraflarla pazarlama amacıyla paylaşmıyoruz.",
        },
        {
          heading: "Saklama süresi",
          body: "Verileriniz, ilgili talebin sonuçlanmasından sonra yasal saklama süreleri boyunca tutulur, ardından silinir.",
        },
        {
          heading: "Haklarınız",
          body: "Verilerinize erişme, düzeltme ve silinmesini talep etme hakkınız vardır. Talepleriniz için iletişim sayfasındaki e-posta adresine yazabilirsiniz.",
        },
      ]}
    />
  );
}
