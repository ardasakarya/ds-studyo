import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK aydınlatma metni",
  description: `${site.legalName} KVKK aydınlatma metni.`,
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK aydınlatma metni"
      updated="—"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla bilgilendirme."
      sections={[
        {
          heading: "Veri sorumlusu",
          body: `${site.legalName}, ${site.contact.location}. İletişim: ${site.contact.email}`,
        },
        {
          heading: "İşlenen veriler ve amaç",
          body: "Kimlik ve iletişim verileriniz; teklif hazırlama, sözleşme kurma, hizmet sunma ve iletişim faaliyetlerinin yürütülmesi amacıyla işlenir.",
        },
        {
          heading: "Hukuki sebep",
          body: "Sözleşmenin kurulması ve ifası ile veri sorumlusunun meşru menfaati; açık rızanızın gerektiği hâllerde ise açık rızanız.",
        },
        {
          heading: "Aktarım",
          body: "Verileriniz yalnızca hizmetin sunulması için gerekli olan barındırma ve altyapı sağlayıcılarıyla, gerekli güvenlik önlemleri alınarak paylaşılabilir.",
        },
        {
          heading: "İlgili kişi hakları",
          body: "KVKK m. 11 kapsamındaki haklarınızı kullanmak için iletişim adresimize başvurabilirsiniz.",
        },
      ]}
    />
  );
}
