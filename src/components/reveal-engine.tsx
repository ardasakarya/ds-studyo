"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sayfadaki tüm `.reveal` elemanlarını görünür alana girince açar.
 *
 * Neden tek merkezden: sunucu bileşenleri sadece `className="reveal"` yazar,
 * her bölüm için client wrapper gerekmez.
 *
 * IntersectionObserver'a ek olarak scroll dinleyicisi de var — bazı gömülü
 * tarayıcılarda (önizleme sekmeleri) IO tetiklenmiyor, o durumda içerik
 * görünmez kalmasın diye.
 */
export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"),
    );
    if (els.length === 0) return;

    const show = (el: Element) => el.classList.add("is-in");

    /**
     * Görünür alana giren VEYA yukarıda kalan her şey açılır.
     * Yalnızca "içeri girenler" açılırsa; sayfaya ortadan girildiğinde
     * (scroll geri yükleme, çapa linki, geri tuşu) ya da bir bölüm sonradan
     * uzayıp içerik yukarı kaydığında üstteki bloklar sonsuza kadar
     * görünmez kalıyordu.
     */
    const check = () => {
      const vh = window.innerHeight || 800;
      for (const el of els) {
        if (el.classList.contains("is-in")) continue;
        if (el.getBoundingClientRect().top < vh * 0.9) show(el);
      }
    };

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
      );
      els.forEach((el) => io?.observe(el));
    }

    check();
    /* Bölümler hidrasyondan sonra boy değiştirebiliyor (ör. hizmetlerdeki
       sabitlenen sahne); birkaç kez daha bakılır. */
    const timers = [120, 600, 1600].map((delay) =>
      window.setTimeout(check, delay),
    );
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      io?.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  return null;
}
