"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

type TextOpacity = "none" | "soft" | "medium";
type ViewType = "word" | "letter";

type TextGradientScrollProps = {
  text: string;
  heading: string;
  eyebrow?: string;
  type?: ViewType;
  textOpacity?: TextOpacity;
  side?: "left" | "right";
  className?: string;
};

const restingOpacity: Record<TextOpacity, number> = {
  none: 0,
  soft: 0.1,
  medium: 0.3,
};

/**
 * OnScrollTypographyAnimations'daki effect16'nın React/GSAP uyarlaması.
 * Metin alttan merkeze taşınırken kelime veya harfler scroll ilerlemesine
 * bağlı biçimde düşük opaklıktan tam görünürlüğe ulaşır.
 */
export function TextGradientScroll({
  text,
  heading,
  eyebrow,
  type = "word",
  textOpacity = "soft",
  side = "left",
  className,
}: TextGradientScrollProps) {
  const titleId = useId();
  const trackRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.trim().split(/\s+/), [text]);
  const initialOpacity = restingOpacity[textOpacity];

  useEffect(() => {
    const track = trackRef.current;
    const paragraph = textRef.current;
    if (!track || !paragraph) return;

    gsap.registerPlugin(ScrollTrigger);
    const units = paragraph.querySelectorAll<HTMLElement>("[data-scroll-unit]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(paragraph, { x: 0, y: 0, yPercent: -50, rotate: 0 });
      gsap.set(units, { opacity: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(paragraph, {
        x: side === "right" ? "38vw" : 0,
        y: "42vh",
        yPercent: -50,
        rotate: side === "right" ? -3 : 3,
        transformOrigin: side === "right" ? "100% 50%" : "0% 50%",
      });
      gsap.set(units, { opacity: initialOpacity });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        })
        .to(
          paragraph,
          {
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: "none",
          },
          0,
        )
        .to(
          units,
          {
            opacity: 1,
            duration: 0.18,
            stagger: { amount: 0.5, from: "start" },
            ease: "none",
          },
          0.32,
        );
    }, track);

    return () => context.revert();
  }, [initialOpacity, side, type, words]);

  return (
    /* Parkur boyu = animasyonun hızı. 175svh biraz ağır kalıyordu;
       150svh ile aynı animasyon daha az kaydırmada tamamlanıyor. */
    <section
      ref={trackRef}
      className="relative min-h-[150svh]"
      aria-labelledby={titleId}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="shell relative h-full">
          <header
            className={cn(
              "absolute top-[10vh] right-5 left-5 z-10 border-t border-line-strong pt-5 sm:right-14 sm:left-14",
              side === "right" && "text-right",
            )}
          >
            {eyebrow ? <span className="chapter mb-4">{eyebrow}</span> : null}
            <h2
              id={titleId}
              className={cn(
                "display max-w-[18ch] text-[clamp(2.7rem,4.8vw,5.4rem)] leading-[0.9] text-fg",
                side === "right" && "ml-auto",
              )}
            >
              {heading}
            </h2>
          </header>

          <p
            ref={textRef}
            aria-label={text}
            className={cn(
              "absolute top-[56%] m-0 max-w-[21ch] font-display text-[clamp(1.8rem,4.1vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.035em] text-fg",
              side === "right"
                ? "right-5 text-right sm:right-14"
                : "left-5 sm:left-14",
              className,
            )}
            style={{
              transform:
                side === "right"
                  ? "translate3d(38vw, 42vh, 0) translateY(-50%) rotate(-3deg)"
                  : "translate3d(0, 42vh, 0) translateY(-50%) rotate(3deg)",
            }}
          >
            <span aria-hidden="true">
              {words.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                  {type === "letter"
                    ? Array.from(word).map((letter, letterIndex) => (
                        <span
                          key={`${letter}-${letterIndex}`}
                          data-scroll-unit
                          className="inline-block"
                          style={{ opacity: initialOpacity }}
                        >
                          {letter}
                        </span>
                      ))
                    : (
                      <span
                        data-scroll-unit
                        className="inline-block"
                        style={{ opacity: initialOpacity }}
                      >
                        {word}
                      </span>
                    )}
                  {wordIndex < words.length - 1 ? "\u00a0" : null}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
