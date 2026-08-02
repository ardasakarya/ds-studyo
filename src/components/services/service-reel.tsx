"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data";
import "./service-reel.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CLIP_OPEN = "inset(0px 0px 0px)";
const CLIP_WIPED = "inset(0px 0px 100%)";

/**
 * Üçlü hizmet grubu: sahne ekrana sabitlenir, üstteki görsel aşağıdan yukarı
 * silinip altındakini açar, görselin altındaki metin de onunla birlikte değişir.
 */
export function ServiceReel({ services }: { services: Service[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (services.length < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const medias = gsap.utils.toArray<HTMLElement>(".svc-slide-media", root);
      const images = gsap.utils.toArray<HTMLElement>(".svc-slide-media img", root);
      const copies = gsap.utils.toArray<HTMLElement>(".svc-slide-copy", root);
      if (medias.length !== services.length) return;

      root.dataset.mode = "scroll";

      gsap.set(medias, { clipPath: CLIP_OPEN });
      gsap.set(images, { objectPosition: "0px 50%" });
      gsap.set(copies, { autoAlpha: 0, y: 26 });
      gsap.set(copies[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline();

      medias.forEach((media, i) => {
        if (i === services.length - 1) return;

        /* Üstteki görsel yukarı doğru silinir, alttaki hafifçe kayar. */
        tl.to(media, { clipPath: CLIP_WIPED, ease: "none", duration: 1 }, i)
          .to(images[i], { objectPosition: "0px 68%", ease: "none", duration: 1 }, i)
          .fromTo(
            images[i + 1],
            { objectPosition: "0px 34%" },
            { objectPosition: "0px 50%", ease: "none", duration: 1 },
            i,
          )
          /* Metin, görsel yarılandıktan sonra devreder. */
          .to(
            copies[i],
            { autoAlpha: 0, y: -26, ease: "power2.in", duration: 0.3 },
            i + 0.42,
          )
          .to(
            copies[i + 1],
            { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.34 },
            i + 0.66,
          );
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        animation: tl,
        invalidateOnRefresh: true,
      });
    },
    { scope: rootRef, dependencies: [services.length] },
  );

  return (
    <div
      ref={rootRef}
      className="svc-reel"
      data-mode="static"
      style={{ "--steps": services.length } as React.CSSProperties}
    >
      <div className="svc-reel-sticky">
        {services.map((service, i) => (
          <article
            key={service.slug}
            className="svc-slide"
            style={{ zIndex: services.length - i }}
          >
            <div className="svc-slide-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={`${service.title} hizmetini temsil eden görsel`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>

            <div className="svc-slide-copy">
              <div className="svc-slide-head">
                <span className="svc-slide-no">
                  {service.no} — {service.tag}
                </span>
              </div>

              <h3 className="svc-slide-title">{service.title}</h3>
              <p className="svc-slide-summary">{service.summary}</p>

              <div className="svc-slide-foot">
                <span className="svc-slide-price">
                  {service.priceFrom}&apos;den · {service.timeline}
                </span>
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="group inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-soft"
                >
                  Hizmeti incele
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
