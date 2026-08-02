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

import { asset } from "@/lib/asset";

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
    bg: asset("/scenes/referanslar-light-v2.webp"),
    images: [
      { src: asset("/scenes/hizmetler-software-2x.webp"), area: "1 / 1 / 5 / 5", dir: "right" },
      { src: asset("/scenes/referanslar-light-v2.webp"), area: "5 / 8 / 10 / 11", dir: "left" },
      { src: asset("/scenes/hakkimizda-software-2x.webp"), area: "8 / 3 / 11 / 5", dir: "top" },
    ],
  },
  {
    href: "/hizmetler",
    tagline: "Fikirden yayına, 15 hizmet",
    bg: asset("/scenes/hizmetler-software-2x.webp"),
    images: [
      { src: asset("/scenes/hizmetler-light-v2.webp"), area: "3 / 5 / 8 / 10", dir: "bottom" },
      { src: asset("/scenes/hizmetler-software-2x.webp"), area: "7 / 3 / 10 / 6", dir: "right" },
      { src: asset("/scenes/paketler-software-2x.webp"), area: "2 / 2 / 4 / 4", dir: "right" },
    ],
  },
  {
    href: "/referanslar",
    tagline: "Yayında olan gerçek işler",
    bg: asset("/scenes/referanslar-software-2x.webp"),
    images: [
      { src: asset("/references/merada-yonetim.jpg"), area: "8 / 2 / 11 / 5", dir: "right" },
      { src: asset("/references/diamond-tourism.jpg"), area: "2 / 7 / 8 / 11", dir: "bottom" },
      { src: asset("/references/elit-profil.jpg"), area: "3 / 3 / 6 / 6", dir: "left" },
    ],
  },
  {
    href: "/paketler",
    tagline: "Şeffaf fiyat, sabit kapsam",
    bg: asset("/scenes/paketler-software-2x.webp"),
    images: [
      { src: asset("/scenes/paketler-light-v2.webp"), area: "7 / 6 / 10 / 9", dir: "left" },
      { src: asset("/scenes/paketler-software-2x.webp"), area: "4 / 1 / 10 / 4", dir: "right" },
      { src: asset("/references/by-kurtulus.jpg"), area: "2 / 5 / 6 / 10", dir: "right" },
    ],
  },
  {
    href: "/hakkimizda",
    tagline: "İki kişilik çekirdek ekip",
    bg: asset("/scenes/hakkimizda-software-2x.webp"),
    images: [
      { src: asset("/scenes/hakkimizda-light-v2.webp"), area: "3 / 7 / 8 / 11", dir: "right" },
      { src: asset("/scenes/hakkimizda-software-2x.webp"), area: "1 / 4 / 5 / 7", dir: "bottom" },
      { src: asset("/scenes/referanslar-software-2x.webp"), area: "6 / 2 / 11 / 5", dir: "right" },
    ],
  },
  {
    href: "/iletisim",
    tagline: "Keşif görüşmesi ücretsiz",
    bg: asset("/scenes/iletisim-software-2x.webp"),
    images: [
      { src: asset("/scenes/iletisim-light-v2.webp"), area: "2 / 2 / 6 / 6", dir: "right" },
      { src: asset("/scenes/iletisim-software-2x.webp"), area: "5 / 6 / 10 / 11", dir: "left" },
      { src: asset("/references/denizhan-medikal.jpg"), area: "7 / 2 / 11 / 5", dir: "top" },
    ],
  },
];

export function getMenuScene(href: string) {
  return menuScenes.find((scene) => scene.href === href);
}
