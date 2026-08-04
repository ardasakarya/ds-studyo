"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Rota değişince ScrollTrigger ölçülerini tazeler.
 *
 * Footer ve teklif CTA'sı LAYOUT'ta durur; rota değişse de yeniden
 * bağlanmazlar. ScrollTrigger başlangıç/bitiş noktalarını kurulum anında
 * piksele çevirdiği için bu iki bölüm ESKİ sayfanın boyuna göre kalıyordu:
 * yeni sayfa daha kısa ya da uzunsa footer erken açılıyor, geç açılıyor ya
 * da hiç açılmıyordu ("bazen buglanıyor" durumu).
 *
 * Ölçüm birkaç kez yapılır: yeni sayfanın görselleri ve sonradan boy
 * değiştiren bölümleri (sabitlenen hizmet sahnesi gibi) yerleşene kadar
 * tek bir tazeleme yetmiyor.
 */
export function ScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const timers = [0, 250, 900].map((delay) =>
      window.setTimeout(() => ScrollTrigger.refresh(), delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname]);

  return null;
}
