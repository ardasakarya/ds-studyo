"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { heroChapters } from "@/lib/hero-chapters";
import { cn } from "@/lib/utils";

/**
 * Hero gezgini (referans: imperialebolgheri.com).
 *
 * - Ortada çapraz duran görsel kartı; kaydırdıkça görsel + yazılar sayfa sayfa
 *   değişir (anasayfa → hizmetler → referanslar → paketler → hakkımızda → iletişim).
 * - Karta tıklayınca görsel düzelip (rotate 0) tam ekrana büyür, ardından o
 *   sayfaya geçilir.
 *
 * Bölümler `src/lib/hero-chapters.ts` içinden gelir; görsel/metin oradan değişir.
 * JS çalışmazsa ilk bölüm normal bir link kartı olarak durur.
 */
export function Hero() {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const active = heroChapters[index];

  /* Scroll → aktif bölüm */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const next = Math.min(
          heroChapters.length - 1,
          Math.floor(self.progress * heroChapters.length),
        );
        setIndex((prev) => (prev === next ? prev : next));
      },
    });

    return () => trigger.kill();
  }, []);

  /* Mini gezgin: doğrudan o bölüme atla */
  const goTo = (i: number) => {
    setIndex(i);
    const el = root.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (range * i) / heroChapters.length + 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  /* Kart tıklaması: düzel + büyü, sonra sayfaya geç */
  const open = (event: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card || leaving) return;

    // Hareket azaltma tercihinde animasyon yok: link normal çalışsın
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    setLeaving(true);

    const rect = card.getBoundingClientRect();
    const scale = Math.max(
      window.innerWidth / rect.width,
      window.innerHeight / rect.height,
    );

    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      router.push(active.href);
    };
    // Güvenlik ağı: animasyon herhangi bir sebeple bitmezse yine de geçilsin
    if (!active.href.startsWith("#")) window.setTimeout(go, 1200);

    const tl = gsap.timeline({
      onComplete: () => {
        if (active.href.startsWith("#")) {
          document
            .querySelector(active.href)
            ?.scrollIntoView({ behavior: "smooth" });
          gsap.to(card, {
            rotate: active.tilt,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => setLeaving(false),
          });
          gsap.to(chromeRef.current, { opacity: 1, duration: 0.6 });
          return;
        }
        go();
      },
    });

    tl.to(chromeRef.current, { opacity: 0, duration: 0.35, ease: "none" }, 0).to(
      card,
      {
        rotate: 0,
        scale,
        borderRadius: 0,
        duration: 0.9,
        ease: "power3.inOut",
      },
      0,
    );
  };

  return (
    <section ref={root} className="relative h-[540vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Dev başlık — kartın arkasında durur */}
        <h1
          key={active.no}
          className="animate-fade-up display pointer-events-none absolute inset-x-0 bottom-[13vh] z-0 px-[clamp(1.25rem,4vw,3.5rem)] text-center text-[clamp(2.2rem,9vw,9rem)] leading-[0.85] text-fg sm:bottom-[6vh]"
        >
          {active.title}
        </h1>

        {/* Çapraz görsel kartı */}
        <a
          ref={cardRef}
          href={active.href}
          onClick={open}
          aria-label={`${active.label} sayfasına git`}
          className="group absolute top-1/2 left-1/2 z-10 h-[46vh] w-[76vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-line bg-ink-800 will-change-transform sm:h-[62vh] sm:w-[min(46vw,520px)]"
          style={{ rotate: `${active.tilt}deg` }}
        >
          {heroChapters.map((chapter, i) => (
            <Image
              key={chapter.no}
              src={chapter.image}
              alt={chapter.label}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 90vw, 46vw"
              className={cn(
                "object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <span
            className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-ink-950/20 transition-opacity duration-500 group-hover:opacity-60"
            aria-hidden
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-fg/90 px-4 py-1.5 font-mono text-[0.68rem] tracking-[0.2em] text-ink-950 uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {active.href.startsWith("#") ? "keşfet" : "aç"}
          </span>
        </a>

        {/* Sabit bilgi katmanı */}
        <div
          ref={chromeRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between pt-28 pb-14"
        >
          <div className="shell flex items-start justify-between gap-8">
            <div className="flex max-w-sm flex-col gap-3">
              <span className="chapter">
                <b>{active.no}</b> {active.label}
              </span>
              <p key={active.no} className="animate-fade-up text-sm text-fg-muted">
                {active.description}
              </p>
            </div>
            <span className="edge-note hidden text-right sm:block">
              {active.right[0]}
              <br />
              {active.right[1]}
            </span>
          </div>

          <div className="flex items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)]">
            {/* Bölüm göstergesi — dikey mini gezgin */}
            <ul className="pointer-events-auto hidden flex-col gap-1.5 lg:flex">
              {heroChapters.map((chapter, i) => (
                <li key={chapter.no}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === index}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={cn(
                        "h-px transition-all duration-500",
                        i === index ? "w-6 bg-accent" : "w-2.5 bg-line-strong",
                      )}
                    />
                    <span
                      className={cn(
                        "edge-note transition-colors duration-500",
                        i === index
                          ? "text-fg"
                          : "text-fg-faint/50 hover:text-fg-muted",
                      )}
                    >
                      {chapter.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <span className="edge-note hidden text-right sm:block">
              {active.left[0]}
              <br />
              {active.left[1]}
            </span>
          </div>

          <div className="shell flex items-end justify-between gap-6">
            <span className="edge-note flex items-center gap-4">
              <span className="text-fg">{active.no}</span>
              <span className="h-px w-10 bg-line-strong" />
              <span>{heroChapters[heroChapters.length - 1].no}</span>
            </span>

            <span className="edge-note flex shrink-0 items-center gap-2">
              kaydır
              <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
