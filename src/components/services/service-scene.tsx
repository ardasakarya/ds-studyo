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
/** Sütunların birbirinden gecikmesi (zaman çizelgesi birimi).
    Belirgin bir şelale etkisi için sütunlar sırayla devreder. */
const COLUMN_LAG = 0.2;
/** Bir kartın silinme süresi (zaman çizelgesi birimi). */
const WIPE = 0.86;

/**
 * Yan yana üç kutu; kaydırdıkça üçü birden değişir.
 * Her sütun kendi hizmet yığınını taşır: üstteki kartın görseli aşağıdan
 * yukarı silinip altındakini açar.
 *
 * Değişimin fark edilmesi için üç işaret var:
 *  - silme çizgisi (`.svc-card-edge`) kesik boyunca yukarı süzülür,
 *  - açılan kart kısa bir "yeni geldi" vurgusu alır (`data-enter`),
 *  - sahnenin üstündeki sayaç hangi sayfada olunduğunu yazar.
 *
 * Kartların tamamı tıklanabilir. Üst üste bindikleri için yalnızca o an
 * görünen kart tıklamayı alır: hangi kartın "aktif" olduğu ScrollTrigger'ın
 * ilerlemesinden hesaplanıp `data-active` ile işaretlenir (bkz. CSS).
 *
 * Sütunlar eşit uzunlukta olmayabilir (11 hizmet → 4/4/3). Kısa sütunun son
 * kartı sahnenin sonunda TEK BAŞINA asılı kalmasın diye, o da sırası gelince
 * silinir; son sayfada yalnızca dolu sütunlar görünür.
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
      const edge = (c: number, p: number) =>
        root.querySelector<HTMLElement>(`[data-card="${c}-${p}"] .svc-card-edge`);

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
          const allEdges = gsap.utils.toArray<HTMLElement>(".svc-card-edge", root);
          const steps = gsap.utils.toArray<HTMLElement>(
            ".svc-scene-progress-step",
            root,
          );
          const counter = root.querySelector<HTMLElement>(
            ".svc-scene-progress-count",
          );

          gsap.set(allMedia, { clipPath: CLIP_OPEN });
          gsap.set(allEdges, { bottom: "0%", opacity: 0 });

          const tl = gsap.timeline();

          for (let p = 0; p < pages - 1; p++) {
            columns.forEach((column, c) => {
              /* Bu sütunda silinecek kart kalmadıysa geç. */
              if (!column[p]) return;

              /* Sütunlar gecikmeyle devreder: üçü aynı anda kesilmez, göz
                 değişimi tek tek yakalar. */
              const at = p + c * COLUMN_LAG;

              /* Üstteki kart aşağıdan yukarı silinir; kesiğin tam üstünde
                 kum rengi bir çizgi yürür — değişim böylece fark edilir. */
              tl.to(
                media(c, p),
                { clipPath: CLIP_WIPED, ease: "none", duration: WIPE },
                at,
              )
                .fromTo(
                  edge(c, p),
                  { bottom: "0%" },
                  { bottom: "100%", ease: "none", duration: WIPE },
                  at,
                )
                /* Çizgi yalnızca kesik yürürken yanar; kartın dinlenme
                   hâlinde altında parlak bir şerit kalmaz. */
                .fromTo(
                  edge(c, p),
                  { opacity: 0 },
                  { opacity: 1, ease: "none", duration: WIPE * 0.12 },
                  at,
                )
                .to(
                  edge(c, p),
                  { opacity: 0, ease: "none", duration: WIPE * 0.18 },
                  at + WIPE * 0.82,
                );

              /* Sütun bittiyse altında açılacak kart yok: kart tamamen
                 silinir ve o sütun son sayfada boş kalır. */
              if (!column[p + 1]) return;

              /* Alttaki kart belirgin bir ölçek farkıyla yerleşir. */
              tl.fromTo(
                image(c, p + 1),
                { scale: 1.14 },
                { scale: 1, ease: "power2.out", duration: WIPE },
                at,
              );
            });
          }

          /* Zaman çizelgesi sütun gecikmesi yüzünden (pages - 1)'den uzun;
             ilerlemeyi sayfa birimine çevirirken gerçek süre kullanılır. */
          const span = tl.duration() || 1;

          /* Hangi kart tıklanabilir? Zaman çizelgesindeki konumdan hesaplanır;
             geri kaydırıldığında da doğru sonucu verir. -1 = sütun tükendi. */
          const activeIndex: number[] = columns.map(() => 0);
          let activePage = -1;

          const syncActive = (progress: number) => {
            const time = progress * span;

            columns.forEach((column, c) => {
              const raw = Math.max(0, Math.floor(time - c * COLUMN_LAG + 0.5));
              const next = raw > column.length - 1 ? -1 : raw;
              if (next === activeIndex[c]) return;

              card(c, activeIndex[c])?.setAttribute("data-active", "false");
              activeIndex[c] = next;
              if (next < 0) return;

              const entering = card(c, next);
              entering?.setAttribute("data-active", "true");
              /* Kısa "yeni geldi" vurgusu: animasyon yeniden tetiklensin
                 diye önce sıfırlanır. */
              if (entering) {
                entering.removeAttribute("data-enter");
                void entering.offsetWidth;
                entering.setAttribute("data-enter", "true");
              }
            });

            /* Sahne sayacı: kaçıncı üçlüde olduğumuzu yazar. */
            const page = gsap.utils.clamp(
              0,
              pages - 1,
              Math.floor(time + 0.5),
            );
            if (page === activePage) return;
            activePage = page;
            if (counter) counter.textContent = String(page + 1).padStart(2, "0");
            steps.forEach((step, i) =>
              step.setAttribute("data-on", String(i <= page)),
            );
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
            gsap.set([...allMedia, ...allImages, ...allEdges], {
              clearProps: "all",
            });
            columns.forEach((column, c) =>
              column.forEach((_, p) => {
                card(c, p)?.setAttribute("data-active", String(p === 0));
                card(c, p)?.removeAttribute("data-enter");
              }),
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
        {/* Sahne sayacı — kaydırdıkça kartların değiştiğini görünür kılar.
            Yalnızca sabitlenen sahne düzeninde görünür (bkz. CSS). */}
        <div className="svc-scene-progress" aria-hidden>
          <span className="svc-scene-progress-label">sahne</span>
          <span className="svc-scene-progress-count">01</span>
          <span className="svc-scene-progress-track">
            {Array.from({ length: pages }, (_, i) => (
              <span
                key={i}
                className="svc-scene-progress-step"
                data-on={i === 0}
              />
            ))}
          </span>
          <span className="svc-scene-progress-total">
            {String(pages).padStart(2, "0")}
          </span>
        </div>

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

                      {/* Silme kesiğinin üstünde yürüyen kum rengi çizgi */}
                      <span className="svc-card-edge" aria-hidden />

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
