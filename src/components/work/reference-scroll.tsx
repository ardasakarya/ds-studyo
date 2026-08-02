"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import "./reference-scroll.css";

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger);

/**
 * Codrops "On-Scroll Filter Effect" mekaniği:
 * başlık ekranın ortasında durur, scroll ile düzendeki yerine uçar (Flip);
 * aynı anda fotoğrafın SVG maskesi (turbulence + displacement) açılır.
 */

type Mask =
  | {
      kind: "circle";
      /** Maskenin açıldığı son yarıçap (viewBox birimi). */
      final: number;
      baseFrequency: number;
      octaves: number;
      scale: number;
      blur?: number;
      dilate?: number;
    }
  | {
      kind: "path";
      from: string;
      final: string;
      baseFrequency: number;
      octaves: number;
      scale: number;
    };

/** Görseller 16:9 — viewBox köşegeninin yarısı ≈ 734, maske onu az geçer. */
const masks: Mask[] = [
  { kind: "circle", final: 760, baseFrequency: 0.03, octaves: 3, scale: 50 },
  {
    kind: "circle",
    final: 800,
    baseFrequency: 0.1,
    octaves: 1,
    scale: 100,
    dilate: 2,
  },
  {
    kind: "path",
    from: "M 0 360 Q 640 360 1280 360 Q 640 360 0 360",
    final: "M 0 360 Q 640 1180 1280 360 Q 640 -460 0 360",
    baseFrequency: 0.02,
    octaves: 3,
    scale: 80,
  },
  { kind: "circle", final: 745, baseFrequency: 0.5, octaves: 1, scale: 50 },
  { kind: "circle", final: 790, baseFrequency: 0.1, octaves: 3, scale: 150 },
  {
    kind: "circle",
    final: 755,
    baseFrequency: 0.01,
    octaves: 3,
    scale: 150,
    blur: 10,
  },
];

/** Metin bloğunun düzene göre hizası. */
const textAlign = ["right", "left", "center", "center", "right", "right"];

/** "Merada Gayrimenkul" → üst satır "Merada", alt satır "Gayrimenkul". */
function splitTitle(title: string): [string, string] {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return [title, ""];
  return [parts[0], parts.slice(1).join(" ")];
}

function ReferenceItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const mask = masks[index % masks.length];
  const align = textAlign[index % textAlign.length];
  const [up, down] = splitTitle(project.title);
  const filterId = `ref-filter-${project.slug}`;
  const maskId = `ref-mask-${project.slug}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const wrap = root.querySelector<HTMLElement>(".ref-titlewrap");
      const layout = root.querySelector<HTMLElement>(".ref-layout");
      const titleUp = root.querySelector<HTMLElement>(".ref-title--up");
      const titleDown = root.querySelector<HTMLElement>(".ref-title--down");
      const maskEl = root.querySelector<SVGElement>(".ref-maskshape");
      const image = root.querySelector<SVGImageElement>(".ref-image");
      if (!wrap || !layout || !titleUp || !titleDown || !maskEl || !image)
        return;

      const isCircle = mask.kind === "circle";
      const from = mask.kind === "circle" ? 0 : mask.from;
      const to = mask.final;

      let trigger: ScrollTrigger | undefined;
      let disposed = false;

      /* Ölçüm ekran genişliğine bağlı (tipografi vw ile ölçekleniyor), bu
         yüzden kurulum yeniden çalıştırılabilir olmalı: yazı tipi yüklenince
         ve pencere boyutu değişince baştan ölçülür. */
      const build = () => {
        if (disposed) return;
        trigger?.kill();
        trigger = undefined;
        gsap.killTweensOf([titleUp, titleDown, maskEl, image]);
        gsap.set([titleUp, titleDown, image], { clearProps: "all" });

        /* Başlıkları geçici olarak sahnenin ortasına alıp başlangıç karesini
           ölçüyoruz. Ölçüm sırasında satır yüksekliği kaymasın diye düzenin
           yüksekliği kilitleniyor; ardından her şey JSX'teki hâline dönüyor. */
        layout.style.height = `${layout.offsetHeight}px`;
        wrap.append(titleUp, titleDown);
        const state = Flip.getState([titleUp, titleDown]);
        layout.prepend(titleUp, titleDown);
        layout.style.height = "";

        const flip = Flip.from(state, { ease: "none", simple: true })
          .fromTo(
            maskEl,
            { attr: isCircle ? { r: from } : { d: from } },
            { ease: "none", attr: isCircle ? { r: to } : { d: to } },
            0,
          )
          .fromTo(
            image,
            { transformOrigin: "50% 50%", filter: "brightness(62%)" },
            {
              ease: "none",
              scale: isCircle ? 1.12 : 1.04,
              filter: "brightness(104%)",
            },
            0,
          );

        trigger = ScrollTrigger.create({
          trigger: wrap,
          /* Kaynak demo: start bottom-=10%, end +=40%. Açılış daha sakin
             olsun diye mesafe %60 uzatıldı; başlangıç öne çekilerek bitiş
             noktası korundu (öğe yerine oturduğunda hâlâ ekranda). */
          start: "clamp(top bottom+=12%)",
          end: "+=64%",
          scrub: true,
          animation: flip,
        });
      };

      build();

      let timer = 0;
      const rebuild = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(build, 160);
      };

      /* Genişlik değişimini pencere olayına değil elemanın kendisine bakarak
         yakalıyoruz: gömülü/gizli çerçevelerde ilk ölçüm 0 genişlikte
         yapılabiliyor ve resize olayı hiç gelmeyebiliyor. */
      let lastWidth = root.offsetWidth;
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        rebuild();
      });
      observer.observe(root);
      window.addEventListener("resize", rebuild);
      document.fonts.ready.then(build);

      return () => {
        disposed = true;
        window.clearTimeout(timer);
        observer.disconnect();
        window.removeEventListener("resize", rebuild);
        trigger?.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <article ref={rootRef} className="ref-item">
      <div className="ref-stage" aria-hidden>
        <div className="ref-titlewrap" />
      </div>

      <div className={`ref-layout ref-layout--${(index % 6) + 1}`}>
        <span className="ref-title ref-title--up">{up}</span>
        <span className="ref-title ref-title--down">{down}</span>

        <svg
          className="ref-img"
          viewBox="0 0 1280 720"
          width={1280}
          height={720}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`${project.title} arayüzünden ekran görüntüsü`}
        >
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={mask.baseFrequency}
                numOctaves={mask.octaves}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                result="displacement"
                scale={mask.scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
              {mask.kind === "circle" && mask.dilate ? (
                <feMorphology
                  operator="dilate"
                  radius={mask.dilate}
                  in="displacement"
                  result="morph"
                />
              ) : null}
              {mask.kind === "circle" && mask.blur ? (
                <feGaussianBlur in="displacement" stdDeviation={mask.blur} />
              ) : null}
            </filter>

            <mask id={maskId}>
              {mask.kind === "circle" ? (
                <circle
                  className="ref-maskshape"
                  cx="50%"
                  cy="50%"
                  r={mask.final}
                  fill="white"
                  style={{ filter: `url(#${filterId})` }}
                />
              ) : (
                <path
                  className="ref-maskshape"
                  d={mask.final}
                  fill="white"
                  style={{ filter: `url(#${filterId})` }}
                />
              )}
            </mask>
          </defs>

          <image
            className="ref-image"
            href={project.image}
            width={1280}
            height={720}
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${maskId})`}
          />
        </svg>

        <div className="ref-text" data-align={align}>
          <span className="ref-meta">
            {project.no} — {project.year} · {project.category}
          </span>

          <p className="ref-summary">{project.solution}</p>

          <ul className="ref-highlights">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {/* lang="en": Türkçe dil kuralında CSS uppercase "Tailwind"i
              "TAİLWİND" yapıyor; teknoloji adları İngilizce kuralla yazılır. */}
          <ul className="ref-stack" lang="en" aria-label="Kullanılan teknolojiler">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>

          <div className="ref-actions">
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-medium whitespace-nowrap text-ink-950 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-accent-soft"
            >
              Siteyi ziyaret et
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                aria-hidden
              />
            </a>

            <Link
              href={`/referanslar/${project.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-6 text-[0.95rem] whitespace-nowrap text-fg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-accent/60 hover:bg-ink-800"
            >
              Projeyi incele
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ReferenceScroll({ projects }: { projects: Project[] }) {
  return (
    <div className="ref-shell">
      {projects.map((project, index) => (
        <ReferenceItem key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
