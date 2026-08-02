"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis + GSAP ScrollTrigger entegrasyonu (kanonik kurulum).
 * Lenis kendi rAF'ını değil GSAP ticker'ını kullanır; böylece scroll'a bağlı
 * animasyonlar tek zaman çizelgesinde kalır ve ScrollTrigger senkron çalışır.
 *
 * Not: framer-motion `useScroll` Lenis altında donuyor — scroll'a bağlı
 * ölçümlerde ScrollTrigger veya kendi rAF'ınızı kullanın.
 */
/** Aktif Lenis örneği — programatik kaydırma için (bkz. `smoothScrollTo`). */
let instance: Lenis | null = null;

/**
 * Bir bölüme kaydırır. Lenis aktifken native `scrollIntoView` çalışmaz
 * (Lenis her karede kendi hedefine geri döner), o yüzden önce Lenis denenir.
 */
export function smoothScrollTo(target: HTMLElement, offset = -96) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    instance = lenis;

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
