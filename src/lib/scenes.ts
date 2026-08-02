/**
 * Index sahneleri — açılış ekranındaki tam ekran sayfa yönlendirmeleri.
 * Sahne eklemek/çıkarmak, görsel veya metin değiştirmek için tek yer burası.
 */
export type Scene = {
  no: string;
  title: string;
  href: string;
  /** Koyu temada gösterilen KOYU ışıklı fotoğraf. */
  imageDarkTheme: string;
  /** Aydınlık temada gösterilen AYDINLIK fotoğraf. */
  imageLightTheme: string;
  alt: string;
  left: [string, string];
  right: [string, string];
};

export const scenes: Scene[] = [
  {
    no: "01",
    title: "Hizmetler",
    href: "/hizmetler",
    imageDarkTheme: "/scenes/hizmetler-koyu.webp",
    imageLightTheme: "/scenes/hizmetler-aydinlik.webp",
    alt: "Web, mobil ve sistem geliştirme çalışmalarının yapıldığı stüdyo masası",
    left: ["fikirden", "yayına"],
    right: ["tek ekip,", "tek muhatap"],
  },
  {
    no: "02",
    title: "Referanslar",
    href: "/referanslar",
    imageDarkTheme: "/scenes/referanslar-koyu.webp",
    imageLightTheme: "/scenes/referanslar-aydinlik.webp",
    alt: "Dijital ürün referanslarının ekipçe incelendiği yazılım stüdyosu",
    left: ["yayında olan", "gerçek işler"],
    right: ["hepsi canlı,", "hepsi ölçülü"],
  },
  {
    no: "03",
    title: "Paketler",
    href: "/paketler",
    imageDarkTheme: "/scenes/paketler-koyu.webp",
    imageLightTheme: "/scenes/paketler-aydinlik.webp",
    alt: "Üç farklı yazılım paketini temsil eden ekranların bulunduğu çalışma masası",
    left: ["şeffaf fiyat,", "sabit kapsam"],
    right: ["sürpriz", "kalem yok"],
  },
  {
    no: "04",
    title: "Hakkımızda",
    href: "/hakkimizda",
    imageDarkTheme: "/scenes/hakkimizda-koyu.webp",
    imageLightTheme: "/scenes/hakkimizda-aydinlik.webp",
    alt: "Yazılım mimarisi üzerinde çalışan iki geliştirici",
    left: ["iki kişilik", "çekirdek"],
    right: ["kurumsal", "disiplin"],
  },
  {
    no: "05",
    title: "İletişim",
    href: "/iletisim",
    imageDarkTheme: "/scenes/iletisim-koyu.webp",
    imageLightTheme: "/scenes/iletisim-aydinlik.webp",
    alt: "Yazılım projesi için çevrim içi keşif görüşmesi yapılan çalışma masası",
    left: ["keşif görüşmesi", "ücretsiz"],
    right: ["48 saatte", "dönüş"],
  },
];
