"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data";
import "./service-scene.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLUMNS = 3;
const CLIP_OPEN = "inset(0px 0px 0px)";
const CLIP_WIPED = "inset(0px 0px 100%)";
/** Sütunların birbirinden gecikmesi (zaman çizelgesi birimi). */
const COLUMN_LAG = 0.08;

/**
 * Yan yana üç kutu; kaydırdıkça üçü birden değişir.
 * Her sütun kendi hizmet yığınını taşır: üstteki kartın görseli aşağıdan
 * yukarı silinip altındakini açar.
 *
 * Kartların tamamı tıklanabilir. Üst üste bindikleri için yalnızca o an
 * görünen kart tıklamayı alır: hangi kartın "aktif" olduğu ScrollTrigger'ın
 * ilerlemesinden hesaplanıp `data-active` ile işaretlenir (bkz. CSS).
 */
export function ServiceScene({ services }: { services: Service[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Sütun c → 0., 3., 6. ... hizmetler. Böylece her "sayfa" ardışık üçlü. */
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    services.filter((_, index) => index % COLUMNS === c),
  );
  const pages = Math.max(...columns.map((column) => column.length));

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || pages < 2) return;

      const card = (c: number, p: number) =>
        root.querySelector<HTMLElement>(`[data-card="${c}-${p}"]`);
      const media = (c: number, p: number) =>
        root.querySelector<HTMLElement>(`[data-card="${c}-${p}"] .svc-card-media`);
      const image = (c: number, p: number) =>
        root.querySelector<HTMLElement>(`[data-card="${c}-${p}"] .svc-card-media img`);

      const mm = gsap.matchMedia();

      /* Animasyon yalnızca sahne düzeninin açıldığı ekranlarda — sorgu
         service-scene.css'teki medya sorgusuyla birebir aynı olmalı. */
      mm.add(
        "(min-width: 64em) and (prefers-reduced-motion: no-preference)",
        () => {
          const allMedia = gsap.utils.toArray<HTMLElement>(".svc-card-media", root);
          const allImages = gsap.utils.toArray<HTMLElement>(
            ".svc-card-media img",
            root,
          );

          gsap.set(allMedia, { clipPath: CLIP_OPEN });

          const tl = gsap.timeline();

          for (let p = 0; p < pages - 1; p++) {
            columns.forEach((column, c) => {
              if (!column[p + 1]) return;
              /* Sütunlar hafif gecikmeyle devreder: üçü aynı anda kesilmesin. */
              const at = p + c * COLUMN_LAG;

              /* Üstteki kart aşağıdan yukarı silinir, alttaki hafif ölçek
                 farkıyla yerleşir (görsel kırpılmadığı için kaydırma yok). */
              tl.to(
                media(c, p),
                { clipPath: CLIP_WIPED, ease: "none", duration: 0.92 },
                at,
              ).fromTo(
                image(c, p + 1),
                { scale: 1.06 },
                { scale: 1, ease: "none", duration: 0.92 },
                at,
              );
            });
          }

          /* Hangi kart tıklanabilir? Zaman çizelgesindeki konumdan hesaplanır;
             geri kaydırıldığında da doğru sonucu verir. */
          const activeIndex: number[] = columns.map(() => 0);

          const syncActive = (progress: number) => {
            const time = progress * (pages - 1);

            columns.forEach((column, c) => {
              const raw = Math.floor(time - c * COLUMN_LAG + 0.5);
              const next = Math.min(column.length - 1, Math.max(0, raw));
              if (next === activeIndex[c]) return;

              card(c, activeIndex[c])?.setAttribute("data-active", "false");
              card(c, next)?.setAttribute("data-active", "true");
              activeIndex[c] = next;
            });
          };

          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            animation: tl,
            invalidateOnRefresh: true,
            onUpdate: (self) => syncActive(self.progress),
            onRefresh: (self) => syncActive(self.progress),
          });

          return () => {
            trigger.kill();
            tl.kill();
            gsap.set([...allMedia, ...allImages], { clearProps: "all" });
            columns.forEach((column, c) =>
              column.forEach((_, p) =>
                card(c, p)?.setAttribute("data-active", String(p === 0)),
              ),
            );
          };
        },
      );
    },
    { scope: rootRef, dependencies: [pages] },
  );

  return (
    <div
      ref={rootRef}
      className="svc-scene"
      style={{ "--pages": pages } as React.CSSProperties}
    >
      <div className="svc-scene-sticky">
        <div className="svc-scene-row">
          {columns.map((column, c) => (
            <div key={c} className="svc-col">
              {column.map((service, p) => (
                <article
                  key={service.slug}
                  className="svc-card"
                  data-card={`${c}-${p}`}
                  data-active={p === 0}
                  style={{ zIndex: column.length - p, order: p * COLUMNS + c }}
                >
                  <Link
                    href={`/paketler?hizmet=${service.slug}`}
                    className="svc-card-link"
                    aria-label={`${service.title} — ${service.priceFrom}'den başlayan paketleri incele`}
                  >
                    {/* Kapak temayı takip eder: koyu temada siyah zeminli,
                        aydınlık temada kâğıt zeminli sürüm. Perde ve metin de
                        tema token'larıyla boyanır. */}
                    <div className="svc-card-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="scene-image-for-dark-theme"
                        src={service.image}
                        alt={`${service.title} hizmetini temsil eden görsel`}
                        loading={p === 0 ? "eager" : "lazy"}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="scene-image-for-light-theme"
                        src={service.imageLight}
                        alt=""
                        loading={p === 0 ? "eager" : "lazy"}
                      />

                      <span className="svc-card-veil" aria-hidden />

                      <span className="svc-card-no">
                        {service.no} · {service.tag}
                      </span>

                      {/* Bilginin tamamı görselin üstünde: başlık her zaman,
                          gerisi imleç kartın üstüne gelince açılır. */}
                      <div className="svc-card-panel">
                        <h3 className="svc-card-title">{service.title}</h3>

                        <div className="svc-card-reveal">
                          <div>
                            <p className="svc-card-summary">{service.summary}</p>

                            <dl className="svc-card-meta">
                              <div>
                                <dt>Başlangıç</dt>
                                <dd>{service.priceFrom}</dd>
                              </div>
                              <div>
                                <dt>Süre</dt>
                                <dd>{service.timeline}</dd>
                              </div>
                            </dl>

                            <span className="svc-card-action">
                              Paketleri incele
                              <ArrowUpRight
                                className="size-4"
                                strokeWidth={1.5}
                                aria-hidden
                              />
                            </span>
                          </div>
                        </div>

                        {/* Dinlenme hâlindeki tek satırlık fiyat bilgisi */}
                        <span className="svc-card-rest">
                          <span>
                            {service.priceFrom}&apos;den · {service.timeline}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
