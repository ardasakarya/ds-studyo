/**
 * Hamburger menüsündeki hover sahneleri.
 * Bir menü satırının üstüne gelince sağdaki 10x10 ızgarada o sayfanın
 * içeriğine ait üç görsel açılır (referans: Codrops "HoverGrid").
 *
 * `area`  → CSS grid-area (satır-başı / sütun-başı / satır-sonu / sütun-sonu)
 * `dir`   → görselin hangi yönden açılacağı (clip-path)
 */
export type MenuImage = {
  src: string;
  area: string;
  dir: "left" | "right" | "top" | "bottom";
};

export type MenuScene = {
  href: string;
  /** Sahnenin ortasında beliren kısa cümle. */
  tagline: string;
  /** Arkada düşük parlaklıkta duran görsel. */
  bg: string;
  images: MenuImage[];
};

export const menuScenes: MenuScene[] = [
  {
    href: "/",
    tagline: "Tek ekip, tek muhatap",
    bg: "/scenes/referanslar-light-v2.webp",
    images: [
      { src: "/scenes/hizmetler-software-2x.webp", area: "1 / 1 / 5 / 5", dir: "right" },
      { src: "/scenes/referanslar-light-v2.webp", area: "5 / 8 / 10 / 11", dir: "left" },
      { src: "/scenes/hakkimizda-software-2x.webp", area: "8 / 3 / 11 / 5", dir: "top" },
    ],
  },
  {
    href: "/hizmetler",
    tagline: "Fikirden yayına, 15 hizmet",
    bg: "/scenes/hizmetler-software-2x.webp",
    images: [
      { src: "/scenes/hizmetler-light-v2.webp", area: "3 / 5 / 8 / 10", dir: "bottom" },
      { src: "/scenes/hizmetler-software-2x.webp", area: "7 / 3 / 10 / 6", dir: "right" },
      { src: "/scenes/paketler-software-2x.webp", area: "2 / 2 / 4 / 4", dir: "right" },
    ],
  },
  {
    href: "/referanslar",
    tagline: "Yayında olan gerçek işler",
    bg: "/scenes/referanslar-software-2x.webp",
    images: [
      { src: "/references/merada-yonetim.jpg", area: "8 / 2 / 11 / 5", dir: "right" },
      { src: "/references/diamond-tourism.jpg", area: "2 / 7 / 8 / 11", dir: "bottom" },
      { src: "/references/elit-profil.jpg", area: "3 / 3 / 6 / 6", dir: "left" },
    ],
  },
  {
    href: "/paketler",
    tagline: "Şeffaf fiyat, sabit kapsam",
    bg: "/scenes/paketler-software-2x.webp",
    images: [
      { src: "/scenes/paketler-light-v2.webp", area: "7 / 6 / 10 / 9", dir: "left" },
      { src: "/scenes/paketler-software-2x.webp", area: "4 / 1 / 10 / 4", dir: "right" },
      { src: "/references/by-kurtulus.jpg", area: "2 / 5 / 6 / 10", dir: "right" },
    ],
  },
  {
    href: "/hakkimizda",
    tagline: "İki kişilik çekirdek ekip",
    bg: "/scenes/hakkimizda-software-2x.webp",
    images: [
      { src: "/scenes/hakkimizda-light-v2.webp", area: "3 / 7 / 8 / 11", dir: "right" },
      { src: "/scenes/hakkimizda-software-2x.webp", area: "1 / 4 / 5 / 7", dir: "bottom" },
      { src: "/scenes/referanslar-software-2x.webp", area: "6 / 2 / 11 / 5", dir: "right" },
    ],
  },
  {
    href: "/iletisim",
    tagline: "Keşif görüşmesi ücretsiz",
    bg: "/scenes/iletisim-software-2x.webp",
    images: [
      { src: "/scenes/iletisim-light-v2.webp", area: "2 / 2 / 6 / 6", dir: "right" },
      { src: "/scenes/iletisim-software-2x.webp", area: "5 / 6 / 10 / 11", dir: "left" },
      { src: "/references/denizhan-medikal.jpg", area: "7 / 2 / 11 / 5", dir: "top" },
    ],
  },
];

export function getMenuScene(href: string) {
  return menuScenes.find((scene) => scene.href === href);
}
