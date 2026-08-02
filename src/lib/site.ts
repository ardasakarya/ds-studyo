/**
 * Marka ve iletişim bilgisi TEK yerde.
 * Marka adı kesinleşince sadece burayı değiştir — site geneli günceller.
 */
export const site = {
  name: "D&S", // ŞİMDİLİK — marka adı kesinleşince değiştir
  legalName: "D&S Yazılım",
  domain: "monolit.com.tr", // TODO
  url: "https://monolit.com.tr", // TODO
  tagline: "Fikirden canlıya, tek ekip.",
  description:
    "Web sitesi, mobil uygulama, e-ticaret ve kurumsal yazılım geliştiriyoruz. Kurucularla direkt çalışırsınız, kod tamamen sizin olur.",
  founded: 2024,
  contact: {
    email: "merhaba@monolit.com.tr", // TODO
    phone: "+90 000 000 00 00", // TODO
    phoneHref: "tel:+900000000000", // TODO
    whatsapp: "https://wa.me/900000000000", // TODO
    location: "Mersin, Türkiye",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com/" }, // TODO
    { label: "LinkedIn", href: "https://linkedin.com/" }, // TODO
    { label: "GitHub", href: "https://github.com/" }, // TODO
    { label: "Dribbble", href: "https://dribbble.com/" }, // TODO
  ],
} as const;

/** Menü sırası: anasayfa → hizmetler → referanslar → paketler → hakkımızda → iletişim */
export const mainNav = [
  { label: "Anasayfa", href: "/" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Referanslar", href: "/referanslar" },
  { label: "Paketler", href: "/paketler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
] as const;

export const footerNav = [
  {
    title: "Hizmetler",
    links: [
      { label: "Web sitesi", href: "/hizmetler/web-sitesi" },
      { label: "Web uygulaması", href: "/hizmetler/web-uygulamasi" },
      { label: "Mobil uygulama", href: "/hizmetler/mobil-uygulama" },
      { label: "E-ticaret", href: "/hizmetler/e-ticaret" },
      { label: "Özel yazılım", href: "/hizmetler/ozel-yazilim" },
      { label: "Tüm hizmetler", href: "/hizmetler" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Referanslar", href: "/referanslar" },
      { label: "Paketler", href: "/paketler" },
      { label: "Blog", href: "/blog" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "Gizlilik politikası", href: "/gizlilik" },
      { label: "KVKK aydınlatma metni", href: "/kvkk" },
      { label: "Çerez politikası", href: "/cerez" },
    ],
  },
] as const;
