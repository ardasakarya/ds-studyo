"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import "./quote-spotlight.css";
import { asset } from "@/lib/asset";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chips = [
  "Web sitesi",
  "E-ticaret",
  "Mobil uygulama",
  "UI/UX tasarım",
  "Özel yazılım",
  "SEO",
  "Bakım & destek",
];

/** Etiketlerin dağınık başlangıç konumları (bölümün %'si). */
const startDesktop = [
  { top: 25, left: 15 },
  { top: 12.5, left: 50 },
  { top: 22.5, left: 75 },
  { top: 30, left: 82.5 },
  { top: 50, left: 20 },
  { top: 80, left: 20 },
  { top: 75, left: 75 },
];

/** Dar ekranda etiketler taşmasın diye merkeze daha yakın dağılım. */
const startMobile = [
  { top: 20, left: 30 },
  { top: 13, left: 66 },
  { top: 31, left: 74 },
  { top: 42, left: 26 },
  { top: 58, left: 68 },
  { top: 74, left: 32 },
  { top: 85, left: 62 },
];

/**
 * Kapanış CTA'sı: dağınık hizmet etiketleri scroll ile merkeze toplanır,
 * tek bir noktaya dönüşür ve o nokta "Teklif al" butonu olarak açılır.
 */
export function QuoteSpotlight() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const stage = root.querySelector<HTMLElement>(".qs-stage");
      const headerContent = root.querySelector<HTMLElement>(".qs-header-content");
      const featuresWrap = root.querySelector<HTMLElement>(".qs-features");
      const bar = root.querySelector<HTMLElement>(".qs-bar");
      const barText = root.querySelectorAll<HTMLElement>(".qs-bar > *");
      const features = gsap.utils.toArray<HTMLElement>(".qs-feature", root);
      const bgs = gsap.utils.toArray<HTMLElement>(".qs-feature-bg", root);
      const contents = gsap.utils.toArray<HTMLElement>(
        ".qs-feature-content",
        root,
      );
      if (!stage || !headerContent || !featuresWrap || !bar) return;

      root.dataset.mode = "scroll";

      /* Buton CSS'te translate(-50%,-50%) ile ortalanıyor; GSAP'in bu değeri
         piksele çevirip ikinci kez uygulamaması için yüzdeyi biz veriyoruz. */
      gsap.set(bar, { x: 0, y: 0, xPercent: -50, yPercent: -50 });

      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const target = 3 * rem;

      let sizes: { width: number; height: number }[] = [];
      let barFinalWidth = 25;

      /** Etiketleri dağınık hâline döndürüp ölçüyü tazeler. */
      const measure = () => {
        const narrow = window.innerWidth < 1000;
        const positions = narrow ? startMobile : startDesktop;
        barFinalWidth = narrow ? 16 : 25;

        features.forEach((feature, i) => {
          gsap.set(feature, {
            top: `${positions[i].top}%`,
            left: `${positions[i].left}%`,
          });
        });

        gsap.set(bgs, { clearProps: "width,height,borderRadius,borderWidth" });
        sizes = bgs.map((bg) => {
          const rect = bg.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
      };

      measure();

      let ready = false;
      const setReady = (value: boolean) => {
        if (value === ready) return;
        ready = value;
        bar.dataset.ready = String(value);
        bar.tabIndex = value ? 0 : -1;
        if (value) bar.removeAttribute("aria-hidden");
        else bar.setAttribute("aria-hidden", "true");
      };
      setReady(false);

      /* Sahnenin verilen ilerlemedeki hâli. `onUpdate` YALNIZCA scroll
         değişince çalıştığı için ayrı bir işlev: bölüm zaten ekrandayken
         açılan sayfada (yenileme / geri dönüş) bir kez elle çağrılır,
         yoksa açılış cümlesi ekranda takılı kalıp buton hiç görünmüyordu. */
      const render = (progress: number) => {
        /* 1 — açılış cümlesi yukarı süzülür */
        gsap.set(stage, {
          yPercent: progress <= 1 / 3 ? -100 * (progress / (1 / 3)) : -100,
        });

        /* 2 — etiketler merkeze toplanıp tek noktaya küçülür */
        if (progress <= 0.5) {
          const p = progress / 0.5;
          const positions =
            window.innerWidth < 1000 ? startMobile : startDesktop;

          features.forEach((feature, i) => {
            const from = positions[i];
            gsap.set(feature, {
              top: `${from.top + (50 - from.top) * p}%`,
              left: `${from.left + (50 - from.left) * p}%`,
            });
          });

          bgs.forEach((bg, i) => {
            const size = sizes[i];
            if (!size) return;
            gsap.set(bg, {
              width: `${size.width + (target - size.width) * p}px`,
              height: `${size.height + (target - size.height) * p}px`,
              borderRadius: `${0.5 + (25 - 0.5) * p}rem`,
              borderWidth: `${0.125 + (0.35 - 0.125) * p}rem`,
            });
          });

          gsap.set(contents, {
            opacity: progress <= 0.1 ? 1 - progress / 0.1 : 0,
          });
        }

        gsap.set(featuresWrap, { opacity: progress >= 0.5 ? 0 : 1 });
        gsap.set(bar, { opacity: progress >= 0.5 ? 1 : 0 });

        /* 3 — nokta butona açılır ve aşağı iner */
        if (progress >= 0.5 && progress <= 0.75) {
          const p = (progress - 0.5) / 0.25;
          gsap.set(bar, {
            width: `${3 + (barFinalWidth - 3) * p}rem`,
            height: `${3 + (5 - 3) * p}rem`,
            yPercent: -50 + 250 * p,
          });
        } else if (progress > 0.75) {
          gsap.set(bar, {
            width: `${barFinalWidth}rem`,
            height: "5rem",
            yPercent: 200,
          });
        }

        /* 4 — buton yazısı ve kapanış metni belirir */
        if (progress >= 0.75) {
          const p = (progress - 0.75) / 0.25;
          gsap.set(barText, { opacity: p });
          gsap.set(headerContent, { y: -50 + 50 * p, opacity: p });
          setReady(p > 0.6);
        } else {
          gsap.set(barText, { opacity: 0 });
          gsap.set(headerContent, { y: -50, opacity: 0 });
          setReady(false);
        }
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onRefreshInit: measure,
        onUpdate: (self) => render(self.progress),
        /* Ölçü tazelendikten sonra sahneyi mevcut konuma göre yeniden
           kur — sayfa bu bölümün ortasında açıldığında da doğru görünür. */
        onRefresh: (self) => render(self.progress),
      });

      /* Bölüm statikten 400svh'ye büyüdüğü için sayfadaki diğer
         ScrollTrigger'ların ölçüleri tazelenir. */
      ScrollTrigger.refresh();

      /* Etiket ölçüleri genişliğe bağlı; gömülü çerçevelerde ilk ölçüm 0
         genişlikte yapılabildiği için elemanı doğrudan izliyoruz. */
      let timer = 0;
      let lastWidth = root.offsetWidth;
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
      });
      observer.observe(root);

      return () => {
        window.clearTimeout(timer);
        observer.disconnect();
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="qs" data-mode="static">
      <div className="qs-sticky">
        <div className="qs-stage" aria-hidden>
          <div className="qs-mesh">
            <Image
              src={asset("/spotlight/mesh.png")}
              alt=""
              width={1400}
              height={1400}
              sizes="(max-width: 768px) 92vw, 78vh"
            />
          </div>
          <h2 className="qs-title">
            Bu işlerin hepsi bir keşif görüşmesiyle başladı.
          </h2>
        </div>

        <div className="qs-header">
          <div className="qs-header-content">
            <span className="qs-eyebrow">teklif al</span>
            <h2 className="qs-title">Sıradaki referans seninki olsun.</h2>
            <p>
              Projenizi anlatın; kapsamı netleştirip 48 saat içinde net fiyatlı
              bir teklif hazırlayalım.
            </p>
          </div>
        </div>

        <div className="qs-features" aria-hidden>
          {chips.map((chip) => (
            <div key={chip} className="qs-feature">
              <div className="qs-feature-bg" />
              <div className="qs-feature-content">
                <p>{chip}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/teklif-al" className="qs-bar">
          <p>Teklif al</p>
          <ArrowRight className="size-5" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
