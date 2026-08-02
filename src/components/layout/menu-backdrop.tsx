"use client";

import { menuScenes } from "@/lib/menu-scenes";
import { asset } from "@/lib/asset";

/** Hiçbir satırın üstünde değilken duran varsayılan arkaplan. */
const IDLE_BG = asset("/scenes/hakkimizda-light-v2.webp");

/**
 * Menünün tamamını kaplayan soluk arkaplan görseli.
 * Üstüne gelinen satırın sahnesine yumuşakça geçer.
 */
export function MenuBackdrop({ active }: { active: string | null }) {
  return (
    <div className="menu-backdrop" aria-hidden>
      <div
        className="menu-backdrop-img"
        data-on={active === null}
        style={{ backgroundImage: `url(${IDLE_BG})` }}
      />
      {menuScenes.map((scene) => (
        <div
          key={scene.href}
          className="menu-backdrop-img"
          data-on={active === scene.href}
          style={{ backgroundImage: `url(${scene.bg})` }}
        />
      ))}
    </div>
  );
}
