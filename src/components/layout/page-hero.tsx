"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowDown, ChevronRight } from "lucide-react";
import { scenes } from "@/lib/scenes";

type Breadcrumb = { label: string; href?: string };

type PageHeroProps = {
  no?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  showIntro?: boolean;
  children?: React.ReactNode;
};

function Breadcrumbs({ items }: { items?: Breadcrumb[] }) {
  if (!items?.length) return null;

  return (
    <nav
      aria-label="Sayfa yolu"
      className="reveal edge-note flex flex-wrap items-center gap-1.5"
    >
      {items.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1.5">
          {i > 0 ? (
            <ChevronRight className="size-3" strokeWidth={1.5} aria-hidden />
          ) : null}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-fg">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-fg-muted">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Ana yönlendirmeler tam ekran, görselli bir açılış kullanır. Diğer sayfalarda
 * daha kompakt metin hero'su korunur. Böylece anasayfadaki kart büyümesi ile
 * hedef sayfanın ilk karesi aynı sahnenin devamı gibi görünür.
 */
export function PageHero({
  no,
  eyebrow,
  title,
  description,
  breadcrumbs,
  showIntro = true,
  children,
}: PageHeroProps) {
  const pathname = usePathname();
  const scene = scenes.find((item) => item.href === pathname);
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      const hero = heroRef.current;
      const media = mediaRef.current;
      const heroTitle = titleRef.current;
      if (!hero || !media || !heroTitle) return;

      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      media.style.transform = `translate3d(0, ${progress * 9}vh, 0) scale(${1 + progress * 0.04})`;
      heroTitle.style.transform = `translate3d(0, ${progress * -7}vh, 0)`;
      heroTitle.style.opacity = String(1 - progress * 0.72);
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [scene]);

  if (!scene) {
    return (
      <section className="relative pt-44 pb-16">
        <div className="shell relative flex flex-col gap-7">
          <Breadcrumbs items={breadcrumbs} />

          <div className="reveal flex flex-col gap-6">
            {eyebrow ? (
              <span className="chapter">
                {no ? <b>{no}</b> : null}
                {eyebrow}
              </span>
            ) : null}

            <h1 className="display max-w-[16ch] text-[clamp(2.6rem,7.5vw,7rem)]">
              <span className="line-mask">
                <span>{title}</span>
              </span>
            </h1>

            {description ? (
              <p className="max-w-2xl text-lg text-fg-muted">{description}</p>
            ) : null}

            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Fotoğraf temayı takip ediyor (koyu temada koyu, aydınlık temada
          aydınlık kare), bu yüzden perde ve metin de tema token'larından
          gelir — media-layer ile koyuya sabitlenmez. */}
      <section
        ref={heroRef}
        className="relative isolate h-[100dvh] overflow-hidden bg-ink-950"
        aria-label={`${scene.title} giriş görseli`}
        data-testid="cinematic-page-hero"
        data-hero-media
      >
        <div
          ref={mediaRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: "translate3d(0, 0, 0) scale(1)" }}
        >
          <Image
            src={scene.imageDarkTheme}
            alt={scene.alt}
            fill
            priority
            sizes="100vw"
            className="scene-image-for-dark-theme object-cover"
          />
          <Image
            src={scene.imageLightTheme}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scene-image-for-light-theme object-cover"
          />
        </div>

        <div className="scrim-hero absolute inset-0" aria-hidden />
        <div className="scrim-hero-veil absolute inset-0" aria-hidden />

        <div
          ref={titleRef}
          className="absolute inset-0 z-10 grid place-items-center px-3 will-change-transform"
        >
          <h1 className="scene-title scene-title-media-color text-center text-[clamp(48px,10.5vw,154px)]">
            {scene.title}
          </h1>
        </div>

        <p className="claim absolute bottom-[8vh] left-5 z-10 max-w-[11rem] text-left sm:left-[14vw]">
          {scene.left[0]}
          <br />
          {scene.left[1]}
        </p>
        <p className="claim absolute right-5 bottom-[8vh] z-10 max-w-[11rem] text-right sm:right-[14vw]">
          {scene.right[0]}
          <br />
          {scene.right[1]}
        </p>

        <span className="edge-note absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-fg sm:bottom-7">
          keşfet
          <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden />
        </span>
      </section>

      {showIntro ? (
        <section className="section pt-[clamp(6rem,10vw,10rem)]">
          <div className="shell relative flex flex-col gap-7">
            <Breadcrumbs items={breadcrumbs} />

            <div className="reveal flex flex-col gap-6">
              {eyebrow ? (
                <span className="chapter">
                  {no ? <b>{no}</b> : null}
                  {eyebrow}
                </span>
              ) : null}

              <h2 className="display max-w-[15ch] text-[clamp(2.6rem,7.5vw,7rem)]">
                <span className="line-mask">
                  <span>{title}</span>
                </span>
              </h2>

              {description ? (
                <p className="max-w-2xl text-lg text-fg-muted">{description}</p>
              ) : null}

              {children}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
