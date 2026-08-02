/**
 * Hero gezgini — kaydırdıkça değişen sayfa kartları.
 * Görseli değiştirmek için `image` alanını değiştirmek yeterli
 * (public/hero/ veya public/references/ altındaki herhangi bir dosya).
 */
export type HeroChapter = {
  no: string;
  label: string;
  title: string;
  href: string;
  image: string;
  tilt: number;
  left: [string, string];
  right: [string, string];
  description: string;
};

export const heroChapters: HeroChapter[] = [
  {
    no: "01",
    label: "anasayfa",
    title: "Anasayfa",
    href: "#icerik",
    image: "/hero/01-anasayfa.jpg",
    tilt: -4,
    left: ["ajans değil", "stüdyo"],
    right: ["kodu yazan", "ekiple konuşun"],
    description:
      "Web sitesi, mobil uygulama ve kurumsal yazılım geliştiren iki kişilik çekirdek ekip.",
  },
  {
    no: "02",
    label: "hizmetler",
    title: "Hizmetler",
    href: "/hizmetler",
    image: "/hero/02-hizmetler.jpg",
    tilt: 3,
    left: ["15 başlık", "tek ekip"],
    right: ["fikirden", "yayına"],
    description:
      "Site, uygulama, e-ticaret, otomasyon, yapay zekâ, büyüme ve bakım — ihtiyacınız olanı seçin.",
  },
  {
    no: "03",
    label: "referanslar",
    title: "Referanslar",
    href: "/referanslar",
    image: "/references/merada-yonetim.jpg",
    tilt: -3,
    left: ["6 ürün", "yayında"],
    right: ["hepsi canlı", "hepsi ölçülü"],
    description:
      "Gayrimenkulden turizme, medikalden kuyumculuğa kadar teslim ettiğimiz işler.",
  },
  {
    no: "04",
    label: "paketler",
    title: "Paketler",
    href: "/paketler",
    image: "/hero/04-paketler.jpg",
    tilt: 4,
    left: ["şeffaf fiyat", "sabit kapsam"],
    right: ["₺14.900", "'dan başlayan"],
    description:
      "Web, mobil ve özel yazılım paketleri; aylık bakım abonelikleri ve ek modüller.",
  },
  {
    no: "05",
    label: "hakkımızda",
    title: "Hakkımızda",
    href: "/hakkimizda",
    image: "/hero/05-hakkimizda.jpg",
    tilt: -2.5,
    left: ["iki kişilik", "çekirdek"],
    right: ["kurumsal", "disiplin"],
    description:
      "Toplantıda gördüğünüz kişiyle kodu yazan kişi aynı. Hikâyemiz ve çalışma şeklimiz.",
  },
  {
    no: "06",
    label: "iletişim",
    title: "İletişim",
    href: "/iletisim",
    image: "/references/by-kurtulus.jpg",
    tilt: 3.5,
    left: ["keşif görüşmesi", "ücretsiz"],
    right: ["48 saatte", "dönüş"],
    description:
      "Projenizi anlatın; kapsamı netleştirip sabit fiyatlı teklifle dönelim.",
  },
];
