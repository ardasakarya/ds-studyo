"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Counter } from "@/components/ui/counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps, stats } from "@/lib/data";

const principles = [
  {
    title: "Aracı yok",
    body: "Müşteri temsilcisiyle değil, kodu yazan ekiple konuşursunuz. Karar bir toplantıda alınır.",
  },
  {
    title: "Şeffaf fiyat",
    body: "Kapsam netleşir, fiyat sabitlenir. Süreç içinde sürpriz kalem çıkmaz.",
  },
  {
    title: "Kod sizin",
    body: "Kaynak kod, tasarım dosyaları ve tüm hesaplar teslimde size devredilir.",
  },
] as const;

const values = [
  {
    title: "Az ama doğru iş",
    body: "Aynı anda üç projeden fazlasını almıyoruz. Aldığımız işe tam odaklanıyoruz.",
  },
  {
    title: "Ölçmeden konuşmayız",
    body: "Daha hızlı oldu demiyoruz; kaç milisaniye olduğunu gösteriyoruz.",
  },
  {
    title: "Devredilebilir kod",
    body: "Yarın başka bir ekip devralsa anlayabilsin diye yazıyor ve belgeliyoruz.",
  },
  {
    title: "Sürdürülebilir tempo",
    body: "Gerçekçi tarih veriyoruz. Verdiğimiz tarihi de tutuyoruz.",
  },
] as const;

function AnimatedTitle({
  children,
  unit,
}: {
  children: string;
  unit: "value" | "process";
}) {
  const attribute = unit === "value" ? "data-value-char" : "data-process-char";

  return (
    <span aria-label={children}>
      {Array.from(children).map((character, index) => (
        <span
          key={`${character}-${index}`}
          {...{ [attribute]: "" }}
          aria-hidden="true"
          className={character === " " ? "inline" : "inline-block"}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}

export function AboutMotionSections() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-stat]").forEach((stat) => {
        const number = stat.querySelector<HTMLElement>("[data-stat-number]");
        if (!number) return;

        gsap.fromTo(
          number,
          {
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: "50% 0%",
          },
          {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            ease: "back.inOut(2)",
            scrollTrigger: {
              trigger: stat,
              start: "top bottom-=6%",
              end: "center center+=18%",
              scrub: 0.55,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-value]").forEach((value) => {
        const chars = value.querySelectorAll<HTMLElement>("[data-value-char]");
        gsap.set(value, { perspective: 1200 });
        gsap.fromTo(
          chars,
          { opacity: 0, rotationX: -90, yPercent: 50 },
          {
            opacity: 1,
            rotationX: 0,
            yPercent: 0,
            stagger: { amount: 0.3 },
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: value,
              start: "top bottom-=5%",
              end: "center center+=22%",
              scrub: 0.65,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-process]").forEach((step) => {
        const chars = step.querySelectorAll<HTMLElement>("[data-process-char]");
        gsap.fromTo(
          chars,
          { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" },
          {
            opacity: 1,
            scaleY: 1,
            stagger: { amount: 0.24, from: "center" },
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: step,
              start: "top bottom-=5%",
              end: "center center+=24%",
              scrub: 0.6,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section className="section overflow-hidden">
        <div className="shell grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <SectionHeading
            no="02"
            eyebrow="manifesto"
            lines={["Doğrudan ekip,", "net sorumluluk."]}
            description="Küçük bir ekibiz ve bunu avantaja çeviriyoruz: işi kim yapıyorsa onunla konuşuyorsunuz. Aracı az, karar hızlı, sorumluluk net."
          />

          <ul className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line shadow-[0_30px_90px_rgb(var(--shadow-rgb)/calc(0.28*var(--shadow-strength)))]">
            {principles.map((principle, index) => (
              <li
                key={principle.title}
                data-value
                className="group relative flex min-h-40 flex-col justify-center gap-3 bg-ink-950 px-7 py-8 transition-colors duration-500 hover:bg-ink-800/70"
              >
                <span className="edge-note absolute top-7 right-7 text-fg-faint">0{index + 1}</span>
                <h3 className="pr-12 text-[clamp(1.45rem,2.6vw,2.3rem)]">
                  <AnimatedTitle unit="value">{principle.title}</AnimatedTitle>
                </h3>
                <p className="max-w-lg text-fg-muted">{principle.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section overflow-hidden">
        <div className="shell">
          <SectionHeading
            eyebrow="sayılarla"
            lines={["Söz değil,", "çalışan ürün."]}
            description="Ürettiğimiz işin sonucunu teslim edilen proje, canlı ürün ve ölçülebilir performansla takip ediyoruz."
          />

          <dl className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-stat
                className="flex min-h-52 flex-col items-center justify-center bg-ink-950 p-7 text-center lg:p-8"
              >
                <dt
                  data-stat-number
                  className="font-display text-[clamp(3.1rem,5.4vw,5.8rem)] leading-[0.82] tracking-[-0.055em] text-fg"
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="mt-7 font-mono text-xs tracking-[0.1em] text-fg-muted uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section overflow-hidden">
        <div className="shell">
          <SectionHeading
            eyebrow="değerler"
            lines={["Neye inanıyoruz?"]}
            description="Karar verirken ve kod yazarken aynı dört ilkeye dönüyoruz."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            {values.map((value, index) => (
              <li
                key={value.title}
                data-value
                className="relative min-h-64 bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-800/60"
              >
                <span className="edge-note text-fg-faint">0{index + 1}</span>
                <h3 className="mt-14 max-w-[13ch] text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[0.94]">
                  <AnimatedTitle unit="value">{value.title}</AnimatedTitle>
                </h3>
                <p className="mt-5 max-w-sm text-fg-muted">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section overflow-hidden">
        <div className="shell">
          <SectionHeading
            eyebrow="çalışma şeklimiz"
            lines={["Dört adım,", "sürprizsiz süreç."]}
            description="Her aşamanın çıktısı, süresi ve sorumlusu en baştan belli."
          />

          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.no} data-process className="card flex min-h-80 flex-col gap-3 p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent">{step.no}</span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-fg-faint uppercase">{step.duration}</span>
                </div>
                <h3 className="mt-9 overflow-hidden text-[clamp(1.7rem,2.8vw,2.7rem)] leading-none">
                  <AnimatedTitle unit="process">{step.title}</AnimatedTitle>
                </h3>
                <p className="mt-3 text-sm text-fg-muted">{step.description}</p>
                <p className="mt-auto border-t border-line pt-4 font-mono text-[10px] tracking-[0.08em] text-fg-faint uppercase">
                  {step.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
