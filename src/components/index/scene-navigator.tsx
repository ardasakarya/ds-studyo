"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { scenes } from "@/lib/scenes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./scene-intro.css";

gsap.registerPlugin(useGSAP);

/**
 * Açılış ekranı: tam ekran sahne gezgini.
 *
 * Index sayfasında BAŞKA İÇERİK YOKTUR — sadece sayfa yönlendirmeleri.
 *
 * - Tek `index` state'i görseli, başlığı, iki claim'i ve sayacı senkron sürer.
 * - Kaydırınca ÇERÇEVE SABİT kalır; görsel, kaydırma yönüne göre değişir.
 * - Fare hareketiyle sabit görselin üzerinde çerçeve hafifçe yer değiştirir.
 * - Tıklanınca çerçeve düzelir (rotate 0) ve alttaki dev başlık görselin
 *   üzerine biner, ardından sayfaya geçilir.
 */

const DURATION = 900;
const COPY_EXIT_DURATION = 220;
const FRAME_PARALLAX_X = 12;
const FRAME_PARALLAX_Y = 8;

/* Açılış animasyonu — her yüklemede. Marka adı iki parça hâlinde yükselir,
   çapraz çerçeve kelimenin tam ortasındaki bir noktadan açılıp yerine büyür.
   Yalnızca transform / opacity / clip-path animasyonu var: düzen (layout)
   her karede yeniden hesaplanmaz. */
const CLIP_POINT = "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)";
const CLIP_FULL = "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)";

/* Çerçeve sola yatarken fotoğraf ters açıyla dengelenir; böylece fotoğraf
   ekrana göre düz ve sabit kalır, yalnızca çerçeve hareket eder. */
const FRAME_TILT = -13;
/**
 * Marka adı açılışta ikiye ayrılır: sol yarım sola, sağ yarım sağa gider.
 * İçinde "&" varsa ayırma noktası odur ve "&" ortada kalır ("D" ← & → "S");
 * ortadaki harf yerinden kıpırdamaz, açılan fotoğrafın altında kalır.
 */
const INTRO_LETTERS = [...site.name];
const INTRO_AMP = INTRO_LETTERS.indexOf("&");
const INTRO_SPLIT =
  INTRO_AMP > 0 ? INTRO_AMP : Math.ceil(INTRO_LETTERS.length / 2);
const INTRO_HALVES = [
  INTRO_LETTERS.slice(0, INTRO_SPLIT),
  INTRO_LETTERS.slice(INTRO_AMP > 0 ? INTRO_AMP + 1 : INTRO_SPLIT),
];
const INTRO_CENTER = INTRO_AMP > 0 ? INTRO_LETTERS[INTRO_AMP] : null;

export function SceneNavigator() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mediaTitleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introCenterRef = useRef<HTMLDivElement>(null);
  const opening = useRef(false);

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [copyLeaving, setCopyLeaving] = useState(false);
  const indexRef = useRef(0);
  const lock = useRef(false);
  const lockTimer = useRef<number | null>(null);
  const copyTimer = useRef<number | null>(null);
  const loadedScenes = useRef(new Set<number>());
  const pendingTransition = useRef<{
    next: number;
    direction: 1 | -1;
  } | null>(null);
  const leaving = useRef(false);
  const touchY = useRef<number | null>(null);

  const active = scenes[index];
  const copyExitClass = copyLeaving
    ? direction === -1
      ? "scene-copy-exit-down"
      : "scene-copy-exit"
    : undefined;

  /* Eski sürümden kalmış geçiş verileri yenilemede animasyonu etkilemesin. */
  useEffect(() => {
    window.sessionStorage.removeItem("scene-entry-offset");
    window.sessionStorage.removeItem("scene-return-pending");
  }, []);

  /* ------------------------------------------------------------------
     Açılış: marka harfleri yükselir, aralanır ve büyürken çapraz çerçeve
     tek bir noktadan açılıp sahnedeki yerine oturur. Boyama öncesinde
     (layout effect) kurulur, böylece son kare bir an görünmez.
  ------------------------------------------------------------------ */
  useGSAP(
    () => {
      const intro = introRef.current;
      const center = introCenterRef.current;
      const root = rootRef.current;
      const frameWrap = frameWrapRef.current;
      const frame = frameRef.current;
      const title = titleRef.current;
      const mediaTitle = mediaTitleRef.current;
      const chrome = chromeRef.current;
      if (
        !intro ||
        !root ||
        !frameWrap ||
        !frame ||
        !title ||
        !mediaTitle ||
        !chrome
      )
        return;

      const halves = gsap.utils.toArray<HTMLElement>(".scene-intro-half", intro);
      const letters = gsap.utils.toArray<HTMLElement>(
        ".scene-intro-letter > span",
        intro,
      );
      /* Sahne başlığı, sayaç ve claim'ler: maskeli satırlar. Açılış boyunca
         kendi CSS animasyonları kapatılır, sonunda GSAP ile yerden çıkarlar.
         (Bu elemanlar sahne değişiminde `key` ile yenilendiği için inline
         stiller temizlenmek zorunda değil.) */
      const rollItems = gsap.utils.toArray<HTMLElement>(".roll > *", root);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      if (reduced) {
        gsap.set(intro, { display: "none" });
        return;
      }

      opening.current = true;
      lock.current = true;

      /* Yüzde birimleri piksele çevrilir: her karede birim dönüşümü yapılmaz. */
      const vw = window.innerWidth / 100;

      /* Açıldığında yazılar görselin ÜSTÜNE değil YANINA geçer:
         çerçevenin eğik hâldeki genişliği ölçülür, harfler onun dışında
         kalacak konuma ve oraya sığacak ölçeğe ayarlanır. */
      const wrapBox = frameWrap.getBoundingClientRect();
      const rad = (Math.abs(FRAME_TILT) * Math.PI) / 180;
      const frameHalf =
        (wrapBox.width * Math.cos(rad) + wrapBox.height * Math.sin(rad)) / 2;
      const sideRoom = window.innerWidth / 2 - frameHalf - 22;
      const wordWidth = gsap.utils
        .toArray<HTMLElement>(".scene-intro-letter", halves[0])
        .reduce((total, el) => total + el.getBoundingClientRect().width, 0);

      /* Dar ekranda çerçeve zaten kenarlara taşıyor; orada yan boşluk yok. */
      const beside = sideRoom > 110 && wordWidth > 0;
      const openScale = beside
        ? Math.min(0.62, (sideRoom * 0.92) / wordWidth)
        : 1;
      const openX = beside ? frameHalf + 22 : 4 * vw;

      /* Ortadaki "&" kendi merkezinden, yarımlar ise iç kenarlarından
         ölçekleniyor. Küçükken aralarında boşluk kalmasın diye yarımlar
         "&"in küçülen genişliği kadar içeri çekilir. */
      const centerWidth = center ? center.getBoundingClientRect().width : 0;
      const inset = (scale: number) => (centerWidth * (1 - scale)) / 2;

      gsap.set(intro, { opacity: 1, yPercent: -50 });
      gsap.set(letters, { yPercent: 130 });
      /* Bitişik ve küçük başlar; aralık sonra açılır. */
      gsap.set(halves[0], { x: inset(openScale * 0.3), scale: openScale * 0.3 });
      gsap.set(halves[1], { x: -inset(openScale * 0.3), scale: openScale * 0.3 });
      if (center) gsap.set(center, { scale: openScale * 0.3, opacity: 1 });
      gsap.set(frameWrap, { scale: 0.44 });
      gsap.set(frame, { clipPath: CLIP_POINT });
      gsap.set([title, mediaTitle, chrome], { opacity: 0 });
      gsap.set(rollItems, { animation: "none", yPercent: 110 });

      /* Satırların yerden çıkışı, sahne değişimiyle AYNI mekanizmayla yapılır:
         `roll-in` CSS animasyonu. (GSAP tween'i yerine bunu kullanmanın sebebi:
         animasyon zamanlayıcıdan bağımsız çalışır, kare atlansa bile yazı
         "birden" yerine oturmaz.) Süre sahne geçişindekinin ~1,5 katı. */
      let rollRevealed = false;
      const revealRoll = () => {
        if (rollRevealed) return;
        rollRevealed = true;
        gsap.set(rollItems, { clearProps: "transform" });
        gsap.set(rollItems, {
          animation: "roll-in 1.45s cubic-bezier(0.76, 0, 0.24, 1) both",
        });
      };

      let safety = 0;
      const done = () => {
        window.clearTimeout(safety);
        opening.current = false;
        lock.current = false;
        gsap.set(intro, { display: "none" });
        /* DİKKAT: çerçevenin eğimi JSX'te inline transform ile veriliyor.
           `clearProps:"transform"` onu da siler ve çerçeve dümdüz kalır —
           bu yüzden yalnızca clip-path temizlenir. */
        gsap.set(frame, { clearProps: "clipPath" });
        gsap.set(frameWrap, { clearProps: "transform" });
        gsap.set([title, mediaTitle, chrome], { clearProps: "opacity" });
        /* Zaman çizelgesi atlanmış olsa bile satırlar açılışını yapsın. */
        revealRoll();
      };

      /* Harflerin ekrandan çıkacağı mesafe (kendi yarısını da aşacak kadar). */
      const exit = window.innerWidth * 0.8;

      const tl = gsap
        .timeline({
          delay: 0.15,
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: done,
        })
        .to(letters, { yPercent: 0, stagger: 0.055 })
        /* Kelime büyürken ortadan ikiye ayrılmaya başlar. */
        .to(
          halves[0],
          {
            x: -openX * 0.32 + inset(openScale * 0.6),
            scale: openScale * 0.6,
          },
          ">-0.1",
        )
        .to(
          halves[1],
          {
            x: openX * 0.32 - inset(openScale * 0.6),
            scale: openScale * 0.6,
          },
          "<",
        )
        .to(frame, { clipPath: CLIP_FULL }, "<")
        /* Ortadaki "&" yerinden kıpırdamaz: açılan fotoğrafın altında kalıp
           sönerken D ve S iki yana açılmaya devam eder. */
        .to(center ?? {}, { scale: openScale * 0.6 }, "<")
        .to(
          center ?? {},
          { opacity: 0, duration: 0.55, ease: "power1.in" },
          "<+=0.12",
        )
        /* Harfler görselin iki yanına yerleşir. */
        .to(halves[0], { x: -openX, scale: openScale, duration: 0.85 }, ">-0.1")
        .to(halves[1], { x: openX, scale: openScale, duration: 0.85 }, "<")
        .to(frameWrap, { scale: 1, duration: 0.85 }, "<")
        /* Marka adı ikiye ayrılıp ekranın dışına süzülür; çıkarken de
           yumuşakça saydamlaşır (sertçe kesilip gitmesin). */
        .to(halves[0], { x: -exit, duration: 1.05, ease: "power2.in" }, ">-0.05")
        .to(halves[1], { x: exit, duration: 1.05, ease: "power2.in" }, "<")
        .to(intro, { opacity: 0, duration: 0.65, ease: "power1.in" }, "<+=0.4")
        /* Marka adı gittikten sonra sahne yazıları yerden ağır ağır çıkar. */
        .to([title, mediaTitle, chrome], { opacity: 1, duration: 0.35 }, ">-0.05")
        .add(revealRoll, "<+=0.1");

      /* Emniyet: sekme arka planda açılıp rAF hiç tetiklenmezse sahne
         açılışta takılı kalmasın. */
      safety = window.setTimeout(() => {
        if (!opening.current) return;
        tl.progress(1);
        done();
      }, 7000);

      return () => window.clearTimeout(safety);
    },
    { scope: rootRef },
  );

  const beginTransition = useCallback((next: number, nextDirection: 1 | -1) => {
    if (lock.current || leaving.current) return;
    lock.current = true;
    const current = indexRef.current;
    setDirection(nextDirection);
    setCopyLeaving(true);
    copyTimer.current = window.setTimeout(() => {
      setPrev(current);
      indexRef.current = next;
      setIndex(next);
      setCopyLeaving(false);
      lockTimer.current = window.setTimeout(() => {
        setPrev(null);
        lock.current = false;
      }, DURATION);
    }, COPY_EXIT_DURATION);
  }, []);

  const requestTransition = useCallback(
    (next: number, nextDirection: 1 | -1) => {
      if (lock.current || leaving.current || pendingTransition.current) return;
      if (!loadedScenes.current.has(next)) {
        pendingTransition.current = { next, direction: nextDirection };
        return;
      }
      beginTransition(next, nextDirection);
    },
    [beginTransition],
  );

  const markSceneReady = useCallback(
    (sceneIndex: number) => {
      loadedScenes.current.add(sceneIndex);
      const pending = pendingTransition.current;
      if (!pending || pending.next !== sceneIndex) return;
      pendingTransition.current = null;
      beginTransition(pending.next, pending.direction);
    },
    [beginTransition],
  );

  const go = useCallback(
    (delta: number) => {
      const current = indexRef.current;
      const next = (current + delta + scenes.length) % scenes.length;
      requestTransition(next, delta > 0 ? 1 : -1);
    },
    [requestTransition],
  );

  const goTo = (next: number) => {
    if (next === indexRef.current || lock.current || leaving.current) return;
    const current = indexRef.current;
    const forward = (next - current + scenes.length) % scenes.length;
    const backward = (current - next + scenes.length) % scenes.length;
    requestTransition(next, forward <= backward ? 1 : -1);
  };

  useEffect(
    () => () => {
      if (lockTimer.current !== null) window.clearTimeout(lockTimer.current);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  /* Sayfa akışı yok: gövde kilitli */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* Wheel + klavye + dokunma */
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;
      event.preventDefault();
      go(event.deltaY > 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        go(1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY.current = event.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (touchY.current === null) return;
      const delta = touchY.current - (event.changedTouches[0]?.clientY ?? 0);
      if (Math.abs(delta) > 50) go(delta > 0 ? 1 : -1);
      touchY.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  /* Fare parallax'ı — değerler CSS değişkeni olarak yazılır */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || frame || leaving.current) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        const frameRotate = FRAME_TILT + x * 0.95;
        root.style.setProperty(
          "--frame-x",
          `${(x * FRAME_PARALLAX_X).toFixed(2)}px`,
        );
        root.style.setProperty(
          "--frame-y",
          `${(y * FRAME_PARALLAX_Y).toFixed(2)}px`,
        );
        root.style.setProperty("--frame-rotate", `${frameRotate.toFixed(2)}deg`);
        root.style.setProperty("--media-rotate", `${(-frameRotate).toFixed(2)}deg`);
        /* Kadrajın üzerindeyken imleci izleyen "aç" işareti (bkz. .scene-cue) */
        root.style.setProperty("--cue-x", `${event.clientX}px`);
        root.style.setProperty("--cue-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Tıklama: çerçeve düzelir, başlık görselin üzerine biner, sonra sayfaya geç */
  const enter = (event: React.MouseEvent) => {
    if (leaving.current || lock.current) {
      event.preventDefault();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      event.preventDefault();
      router.push(active.href);
      return;
    }

    event.preventDefault();
    leaving.current = true;

    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      router.push(active.href);
    };
    window.setTimeout(go, 1050); // animasyon bitmezse de geç

    const titleBox = titleTextRef.current?.getBoundingClientRect();
    const targetY =
      titleBox
        ? window.innerHeight / 2 - (titleBox.top + titleBox.height / 2)
        : -window.innerHeight * 0.24;
    if (
      !rootRef.current ||
      !frameWrapRef.current ||
      !frameRef.current ||
      !titleRef.current ||
      !mediaTitleRef.current
    ) {
      go();
      return;
    }

    gsap
      .timeline({ onComplete: go })
      .to(
        frameWrapRef.current,
        {
          width: window.innerWidth,
          height: window.innerHeight,
          duration: 0.92,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        rootRef.current,
        {
          "--frame-rotate": "0deg",
          "--frame-x": "0px",
          "--frame-y": "0px",
          "--media-rotate": "0deg",
          duration: 0.92,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        frameRef.current,
        {
          borderRadius: 0,
          duration: 0.92,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        [titleRef.current, mediaTitleRef.current],
        {
          y: targetY,
          scale: 1,
          duration: 0.92,
          ease: "power3.inOut",
        },
        0,
      )
      .to(chromeRef.current, { opacity: 0, duration: 0.26, ease: "none" }, 0)
      .to(washRef.current, { opacity: 0.16, duration: 0.4, ease: "none" }, 0.02);
  };

  /* Eski görsel sabit kalır; yalnızca yeni görselin köşe maskesi açılır. */
  const layerClip = (i: number) => {
    if (i === index || i === prev) return "inset(0)";
    return "inset(100%)";
  };

  return (
    <section
      ref={rootRef}
      className="scene-navigator relative h-[100dvh] w-full overflow-hidden"
      aria-label="Sayfa gezgini"
    >
      <button
        type="button"
        onClick={enter}
        aria-label={`${active.title} sayfasına gir`}
        className="absolute inset-0 z-[1] cursor-pointer"
      />

      {/* Konumu ayrı, dönüşü ayrı katmanda tutulan sabit fotoğraf çerçevesi. */}
      <div
        ref={frameWrapRef}
        className="absolute top-1/2 left-1/2 z-10 h-[64vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 sm:h-[74vh] sm:w-[min(39vw,580px)]"
      >
        <Link
          ref={frameRef}
          href={active.href}
          onClick={enter}
          aria-label={`${active.title} sayfasına git`}
          data-testid="scene-frame"
          className="group relative block size-full overflow-hidden rounded-[2px] will-change-transform"
          style={{
            transform:
              "translate3d(var(--frame-x, 0px), var(--frame-y, 0px), 0) rotate(var(--frame-rotate, -13deg))",
            transformOrigin: "50% 50%",
          }}
        >
          <span className="relative block size-full overflow-hidden bg-ink-950">
            {scenes.map((scene, i) => {
              const isEntering = prev !== null && i === index;

              return (
                <span
                  key={scene.no}
                  className={cn(
                    "absolute inset-0 block",
                    isEntering &&
                      (direction === 1
                        ? "scene-reveal-bottom-left"
                        : "scene-reveal-top-right"),
                  )}
                  style={{
                    zIndex: i === index ? 2 : i === prev ? 1 : 0,
                    clipPath: layerClip(i),
                  }}
                  aria-hidden={i !== index}
                >
                  <span
                    className="absolute inset-0 block"
                  >
                    <span
                      data-scene-media={i === index ? "active" : undefined}
                      className="absolute top-1/2 left-1/2 block h-[100dvh] w-screen will-change-transform"
                      style={{
                        transform:
                          "translate3d(calc(-50% - var(--frame-x, 0px)), calc(-50% - var(--frame-y, 0px)), 0) rotate(var(--media-rotate, 13deg))",
                        transformOrigin: "50% 50%",
                      }}
                    >
                      <Image
                        src={scene.imageDarkTheme}
                        alt={i === index ? scene.alt : ""}
                        fill
                        loading="eager"
                        decoding="sync"
                        fetchPriority={i === 0 ? "high" : "auto"}
                        onLoad={() => markSceneReady(i)}
                        onError={() => markSceneReady(i)}
                        sizes="100vw"
                        className="scene-image-for-dark-theme object-cover"
                      />
                      <Image
                        src={scene.imageLightTheme}
                        alt=""
                        fill
                        loading="eager"
                        decoding="sync"
                        fetchPriority="auto"
                        onLoad={() => markSceneReady(i)}
                        onError={() => markSceneReady(i)}
                        sizes="100vw"
                        className="scene-image-for-light-theme object-cover"
                      />
                    </span>
                  </span>
                </span>
              );
            })}

            <span
              ref={washRef}
              className="pointer-events-none absolute inset-0 z-10 bg-black opacity-0"
              aria-hidden
            />
            <span
              className="scrim-top pointer-events-none absolute inset-x-0 top-0 z-10 h-[18%]"
              aria-hidden
            />
            <span
              className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[24%]"
              aria-hidden
            />

            {/* Başlığın yalnızca çerçevenin içinde kalan, zıt marka renkli
                kopyası. Ters transform sayesinde sayfadaki başlıkla çakışır. */}
            <span
              className="pointer-events-none absolute top-1/2 left-1/2 z-20 block h-[100dvh] w-screen will-change-transform"
              style={{
                transform:
                  "translate3d(calc(-50% - var(--frame-x, 0px)), calc(-50% - var(--frame-y, 0px)), 0) rotate(var(--media-rotate, 13deg))",
                transformOrigin: "50% 50%",
              }}
              aria-hidden
            >
              <div
                ref={mediaTitleRef}
                className="absolute inset-x-0 top-[77%] px-3 will-change-transform sm:top-[78%] sm:px-0"
              >
                <h1
                  className={cn(
                    "roll scene-title scene-title-media-color text-center text-[clamp(48px,10.5vw,154px)]",
                    copyExitClass,
                  )}
                  data-dir={direction === -1 ? "up" : undefined}
                >
                  <span key={active.no}>{active.title}</span>
                </h1>
              </div>
            </span>
          </span>
        </Link>
      </div>

      {/* Dev başlık — tıklanınca yükselip görselin üzerine biner.
          Dar ekranda biraz daha aşağıda durur: claim'ler yukarı alındığı
          için başlıkla üst üste binmiyorlar. */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-x-0 top-[77%] z-[5] px-3 will-change-transform sm:top-[78%] sm:px-0"
      >
        <h1
          className={cn(
            "roll scene-title scene-title-page-color text-center text-[clamp(48px,10.5vw,154px)]",
            copyExitClass,
          )}
          data-dir={direction === -1 ? "up" : undefined}
        >
          <span ref={titleTextRef} key={active.no} data-testid="scene-title">
            {active.title}
          </span>
        </h1>
      </div>

      {/* Sabit bilgi katmanı */}
      <div ref={chromeRef} className="pointer-events-none absolute inset-0 z-30">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center sm:left-[23px]">
          <span
            className={cn(
              "roll edge-note text-fg",
              copyExitClass,
            )}
            data-dir={direction === -1 ? "up" : undefined}
          >
            <span key={active.no}>{active.no}</span>
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center sm:right-[23px]">
          <span className="edge-note text-fg-faint">
            {scenes[scenes.length - 1].no}
          </span>
        </div>

        {/* Dar ekranda iki claim AYNI satırda (biri solda, biri sağda) ve
            başlığın epey üstünde durur; masaüstünde eskisi gibi görselin
            iki yanına, dikey ortaya yerleşirler. */}
        <div className="pointer-events-none absolute bottom-[30vh] left-4 sm:top-1/2 sm:bottom-auto sm:left-[15%] sm:-translate-y-1/2">
          <p
            className={cn(
              "roll claim max-w-[10rem] text-left sm:text-center",
              copyExitClass,
            )}
            data-dir={direction === -1 ? "up" : undefined}
          >
            <span key={active.no}>
              {active.left[0]}
              <br />
              {active.left[1]}
            </span>
          </p>
        </div>
        <div className="pointer-events-none absolute right-4 bottom-[30vh] sm:top-1/2 sm:right-[13%] sm:bottom-auto sm:-translate-y-1/2">
          <p
            className={cn(
              "roll claim max-w-[10rem] text-right sm:text-center",
              copyExitClass,
            )}
            data-dir={direction === -1 ? "up" : undefined}
          >
            <span key={active.no}>
              {active.right[0]}
              <br />
              {active.right[1]}
            </span>
          </p>
        </div>

        {/* Sayfa listesi — hangi sayfalar olduğu ve hangisinde olunduğu
            buradan okunur. Aktif satır kum rengi ve uzun çizgili, diğerleri
            soluk. */}
        <nav
          aria-label="Sahneler"
          className="scene-pager pointer-events-auto absolute right-4 bottom-[5vh] sm:right-[23px] sm:bottom-[6vh]"
        >
          {scenes.map((scene, i) => (
            <button
              key={scene.no}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(i);
              }}
              aria-current={i === index}
              data-on={i === index}
              className="scene-pager-item"
            >
              <span className="scene-pager-label">{scene.title}</span>
              <span className="scene-pager-bar" aria-hidden />
            </button>
          ))}
        </nav>

        {/* Sahnelerin birer sayfa olduğunu söyleyen tek satır. Emir kipi yok:
            kuralı söylüyor, "gir" da yanında duruyor. */}
        <div className="absolute bottom-[5vh] left-4 flex flex-col items-start gap-1.5 sm:bottom-[6vh] sm:left-[23px] sm:flex-row sm:items-center sm:gap-4">
          <p className="scene-hint">her sahne bir sayfa</p>

          <Link
            href={active.href}
            onClick={enter}
            /* DİKKAT: kapsayıcı `pointer-events-none`; bu link kendi
               olaylarını geri açmazsa imleç bile değişmiyor — bağlantı
               olduğu hiç belli olmuyordu. */
            className="edge-note group pointer-events-auto inline-flex items-center gap-2 text-fg transition-colors hover:text-accent-soft"
          >
            gir
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>

        {/* Sözsüz kısmı: kadrajın üzerine gelince imleci izleyen "aç" rozeti.
            Dokunmatikte imleç yok — fotoğrafın ortasında sabit durur. */}
        <span className="scene-cue" aria-hidden>
          aç
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
        </span>
      </div>

      {/* Açılış — marka adının iki parçası, ortada sabit duran "&" */}
      <div ref={introRef} className="scene-intro" aria-hidden>
        <div className="scene-intro-half">
          {INTRO_HALVES[0].map((char, i) => (
            <span key={`${char}-${i}`} className="scene-intro-letter">
              <span>{char}</span>
            </span>
          ))}
        </div>

        {INTRO_CENTER ? (
          <div ref={introCenterRef} className="scene-intro-center">
            <span className="scene-intro-letter">
              <span>{INTRO_CENTER}</span>
            </span>
          </div>
        ) : null}

        <div className="scene-intro-half">
          {INTRO_HALVES[1].map((char, i) => (
            <span key={`${char}-${i}`} className="scene-intro-letter">
              <span>{char}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Ekran okuyucu duyurusu */}
      <p className="sr-only" aria-live="polite">
        {`Sahne ${index + 1} / ${scenes.length}: ${active.title}`}
      </p>
    </section>
  );
}
