"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { menuScenes, type MenuImage } from "@/lib/menu-scenes";
import { site } from "@/lib/site";
import "./menu-grid.css";

/** Görselin açılış yönüne karşılık gelen clip-path değeri. */
const clipFrom: Record<MenuImage["dir"], string> = {
  right: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  left: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  top: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  bottom: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
};

const CLIP_TO = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

/**
 * Menüdeki satırın üstüne gelince açılan görsel sahne.
 * `active` prop'u hangi rotanın sahnesinin görüneceğini söyler.
 */
export function MenuGrid({ active }: { active: string | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (previous.current === active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const parts = (href: string) => {
      const scene = root.querySelector<HTMLElement>(
        `[data-scene="${CSS.escape(href)}"]`,
      );
      if (!scene) return undefined;
      return {
        scene,
        title: scene.querySelector<HTMLElement>(".menu-scene-title"),
        images: gsap.utils.toArray<HTMLElement>(".menu-scene-img", scene),
        inners: gsap.utils.toArray<HTMLElement>(".menu-scene-img > span", scene),
      };
    };

    const hide = (href: string) => {
      const target = parts(href);
      if (!target) return;
      const { scene, title, images, inners } = target;

      gsap.killTweensOf([scene, title, ...images, ...inners]);

      if (reduced) {
        gsap.set(title, { opacity: 0 });
        gsap.set(images, {
          clipPath: (_i: number, el: HTMLElement) =>
            clipFrom[el.dataset.dir as MenuImage["dir"]],
        });
        return;
      }

      gsap
        .timeline({ defaults: { duration: 0.95, ease: "power4" } })
        .to(title, { opacity: 0 }, 0)
        .to(
          images,
          { clipPath: (_i: number, el: HTMLElement) => clipFrom[el.dataset.dir as MenuImage["dir"]] },
          0,
        )
        .to(inners, { scale: 1.5 }, 0);
    };

    const show = (href: string) => {
      const target = parts(href);
      if (!target) return;
      const { scene, title, images, inners } = target;

      gsap.killTweensOf([scene, title, ...images, ...inners]);

      if (reduced) {
        gsap.set(title, { opacity: 1 });
        gsap.set(images, { clipPath: CLIP_TO, xPercent: 0, yPercent: 0 });
        gsap.set(inners, { scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { duration: 0.95, ease: "power4" } })
        .fromTo(title, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1 }, 0)
        .fromTo(
          images,
          {
            xPercent: () => gsap.utils.random(-10, 10),
            yPercent: () => gsap.utils.random(-10, 10),
            filter: "brightness(280%)",
            clipPath: (_i: number, el: HTMLElement) =>
              clipFrom[el.dataset.dir as MenuImage["dir"]],
          },
          {
            xPercent: 0,
            yPercent: 0,
            filter: "brightness(100%)",
            clipPath: CLIP_TO,
          },
          0,
        )
        .fromTo(inners, { scale: 1.5 }, { scale: 1 }, 0);
    };

    const idle = root.querySelector<HTMLElement>(".menu-stage-idle");
    if (idle) {
      gsap.killTweensOf(idle);
      gsap.to(idle, {
        opacity: active ? 0 : 1,
        duration: reduced ? 0 : 0.6,
        ease: active ? "power4" : "sine.in",
      });
    }

    if (previous.current) hide(previous.current);
    if (active) show(active);
    previous.current = active;
  }, [active]);

  return (
    <div ref={rootRef} className="menu-stage" aria-hidden>
      <div className="menu-stage-idle">
        <h2 className="font-display">
          {site.name}
          <br />
          <span className="text-fg-faint">stüdyo</span>
        </h2>
        <p>{site.tagline}</p>
      </div>

      {menuScenes.map((scene) => (
        <div
          key={scene.href}
          data-scene={scene.href}
          data-current={active === scene.href}
          className="menu-scene"
        >
          <h3 className="menu-scene-title font-display">{scene.tagline}</h3>
          {scene.images.map((image) => (
            <div
              key={`${scene.href}-${image.src}-${image.area}`}
              className="menu-scene-img"
              data-dir={image.dir}
              style={{ gridArea: image.area }}
            >
              <span style={{ backgroundImage: `url(${image.src})` }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
