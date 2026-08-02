"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { mainNav, site } from "@/lib/site";
import "./site-footer.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ---- ASCII ayarları (kaynak demodan, site paletine çevrildi) ---- */
const ASCII_CHARS = "........:::=+xX#0369";
const FONT_SIZE = 18;
const CELL_SIZE = 20;
const ASCII_COLUMNS = 80;
const DPR = 2;

/* Renkler tema token'larından okunur — aydınlık/koyu temada canvas da döner.
   (Yedek değerler koyu temanın değerleridir.) */
const FALLBACK = {
  char: "#6f6949", // fg-faint
  hover: "#e6ddaa", // accent (kum)
  hoverChar: "#000000", // ink-950
};

function themeColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10;
const HIGHLIGHT_LIFETIME = 300;

const PARALLAX_STRENGTH = 20;
const PARALLAX_EASE = 0.05;

const backgroundCharIndex = ASCII_CHARS.lastIndexOf(".");

type Cell = { col: number; row: number; char: string; highlightEndTime: number };

type Hand = {
  canvas: HTMLCanvasElement;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
  /** Bir sonraki karede yeniden çizilmesi gerekiyor mu (vurgu sönene kadar). */
  dirty: boolean;
  draw: () => void;
};

/** Görselin parlaklığını ASCII karakter ızgarasına çevirir. */
function buildCells(image: HTMLImageElement) {
  const rows = Math.round(
    ASCII_COLUMNS / (image.naturalWidth / image.naturalHeight),
  );

  const sampler = document.createElement("canvas");
  sampler.width = ASCII_COLUMNS;
  sampler.height = rows;
  const samplerCtx = sampler.getContext("2d");
  if (!samplerCtx) return { rows, cells: new Map<string, Cell>() };

  samplerCtx.drawImage(image, 0, 0, ASCII_COLUMNS, rows);
  const pixels = samplerCtx.getImageData(0, 0, ASCII_COLUMNS, rows).data;
  const cells = new Map<string, Cell>();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < ASCII_COLUMNS; col++) {
      const offset = (row * ASCII_COLUMNS + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        ASCII_CHARS.length - 1,
        Math.floor((1 - brightness) * ASCII_CHARS.length),
      );
      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: ASCII_CHARS[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

function setupHand(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
): Hand | undefined {
  const { rows, cells } = buildCells(image);
  if (cells.size === 0) return undefined;

  const cellList = [...cells.values()];
  canvas.width = ASCII_COLUMNS * CELL_SIZE * DPR;
  canvas.height = rows * CELL_SIZE * DPR;

  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText("X");
  const glyphHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const baselineOffset =
    CELL_SIZE / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

  const width = ASCII_COLUMNS * CELL_SIZE;
  const height = rows * CELL_SIZE;

  const hand: Hand = {
    canvas,
    cells,
    cellList,
    rows,
    dirty: true,
    draw: () => {
      const now = Date.now();
      let active = false;
      ctx.clearRect(0, 0, width, height);

      const charColor = themeColor("--color-fg-faint", FALLBACK.char);
      const hoverColor = themeColor("--color-accent", FALLBACK.hover);
      const hoverCharColor = themeColor("--color-ink-950", FALLBACK.hoverChar);

      for (const cell of cellList) {
        const x = cell.col * CELL_SIZE;
        const y = cell.row * CELL_SIZE;
        const highlighted = cell.highlightEndTime > now;
        if (highlighted) {
          active = true;
          ctx.fillStyle = hoverColor;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }

        ctx.fillStyle = highlighted ? hoverCharColor : charColor;
        ctx.fillText(cell.char, x + CELL_SIZE / 2, y + baselineOffset);
      }

      /* Vurgu sönene kadar çizmeye devam et; sonrasında kare atlanır. */
      hand.dirty = active;
    },
  };

  hand.draw();
  return hand;
}

/** İmlecin yakınındaki hücreden başlayarak rastgele bir küme aydınlatır. */
function highlightCluster(cells: Map<string, Cell>, start: Cell) {
  const now = Date.now();
  start.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const lit = [start];
  let current = start;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !lit.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    lit.push(next);
    current = next;
  }
}

const footerLinks = mainNav.filter((item) => item.href !== "/");

/**
 * Sayfa sonunda açığa çıkan tam ekran footer.
 * Sabit (fixed) durur; üstündeki opak sayfa katmanı kayıp gidince görünür.
 */
export function SiteFooter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const revealer = root.querySelector<HTMLElement>(".footer-revealer");
      const footer = root.querySelector<HTMLElement>(".site-footer");
      if (!revealer || !footer) return;

      const chars = gsap.utils.toArray<HTMLElement>(".footer-char", root);
      const lines = gsap.utils.toArray<HTMLElement>(".footer-line > *", root);
      const wrappers = gsap.utils.toArray<HTMLElement>(".footer-hand", root);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* --- ASCII eller --- */
      const hands: Hand[] = [];
      const images = gsap.utils.toArray<HTMLImageElement>(
        ".footer-hand img",
        root,
      );

      images.forEach((image) => {
        const canvas = image.parentElement?.querySelector("canvas");
        if (!canvas) return;
        const start = () => {
          const hand = setupHand(image, canvas);
          if (hand) hands.push(hand);
        };
        if (image.complete && image.naturalWidth) start();
        else image.addEventListener("load", start, { once: true });
      });

      /* --- Parallax + canvas döngüsü (yalnızca footer açıkken çalışır) --- */
      const pointer = { x: 0, y: 0 };
      const drift = { x: 0, y: 0 };
      const reveal = { left: -125, right: 125 };
      const parallaxScale = 1 + (PARALLAX_STRENGTH * 2) / 200;
      let frame = 0;
      let running = false;

      /* Ellerin konumunu yazan tek yer — kurulum anında da çağrılır ki
         eller açılış başlamadan önce doğru (ekran dışı) yerde dursun. */
      const writeTransforms = () => {
        wrappers.forEach((wrapper, i) => {
          const direction = i === 0 ? 1 : -1;
          const revealX = i === 0 ? reveal.left : reveal.right;
          wrapper.style.transform = `translate(calc(${drift.x * direction}px + ${revealX}%), ${-drift.y}px) scale(${parallaxScale})`;
        });
      };

      const render = () => {
        drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
        drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
        writeTransforms();

        for (const hand of hands) if (hand.dirty) hand.draw();
        frame = requestAnimationFrame(render);
      };

      const startLoop = () => {
        if (running) return;
        running = true;
        frame = requestAnimationFrame(render);
      };

      const stopLoop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };

      const onMove = (event: PointerEvent) => {
        if (!running) return;
        const rect = footer.getBoundingClientRect();
        pointer.x =
          ((event.clientX - rect.left) / rect.width - 0.5) *
          PARALLAX_STRENGTH *
          2;
        pointer.y =
          ((event.clientY - rect.top) / rect.height - 0.5) *
          PARALLAX_STRENGTH *
          2;

        hands.forEach((hand) => {
          const bounds = hand.canvas.getBoundingClientRect();
          const col =
            ((event.clientX - bounds.left) / bounds.width) * ASCII_COLUMNS;
          const row = ((event.clientY - bounds.top) / bounds.height) * hand.rows;

          let closest: Cell | null = null;
          let closestDist = Infinity;
          for (const cell of hand.cellList) {
            const dx = col - cell.col;
            const dy = row - cell.row;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist) {
              closestDist = dist;
              closest = cell;
            }
          }
          if (closest && closestDist <= HOVER_RADIUS) {
            highlightCluster(hand.cells, closest);
            hand.dirty = true;
          }
        });
      };

      /* --- Açılış / kapanış --- */
      gsap.set(chars, { yPercent: reduced ? 0 : 125 });
      gsap.set(lines, { yPercent: reduced ? 0 : 100 });
      if (reduced) {
        reveal.left = 0;
        reveal.right = 0;
      }
      writeTransforms();

      const animateIn = () => {
        startLoop();
        if (reduced) return;
        gsap.to(reveal, {
          left: 0,
          right: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
          onUpdate: writeTransforms,
        });
        gsap.to(chars, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.04, from: "center" },
          overwrite: true,
        });
        gsap.to(lines, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        });
      };

      const animateOut = () => {
        if (reduced) return;
        gsap.to(reveal, {
          left: -125,
          right: 125,
          duration: 0.4,
          ease: "power2.in",
          overwrite: true,
          onComplete: stopLoop,
        });
        gsap.to(chars, {
          yPercent: 125,
          duration: 0.4,
          ease: "power2.in",
          stagger: { each: 0.01, from: "center" },
          overwrite: true,
        });
        gsap.to(lines, {
          yPercent: 100,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.02,
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: revealer,
        start: "top 50%",
        onEnter: animateIn,
      });

      ScrollTrigger.create({
        trigger: revealer,
        start: "top 85%",
        onLeaveBack: animateOut,
      });

      window.addEventListener("pointermove", onMove);

      /* Tema değişince ASCII eller yeni token renkleriyle yeniden çizilir. */
      const themeWatcher = new MutationObserver(() => {
        hands.forEach((hand) => hand.draw());
      });
      themeWatcher.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      return () => {
        window.removeEventListener("pointermove", onMove);
        themeWatcher.disconnect();
        stopLoop();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div className="footer-revealer" aria-hidden />

      <footer className="site-footer">
        <div className="footer-images" aria-hidden>
          <div className="footer-hand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/hand-left.jpg" alt="" />
            <canvas />
          </div>
          <div className="footer-hand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/hand-right.jpg" alt="" />
            <canvas />
          </div>
        </div>

        <div className="footer-inner">
          <div className="footer-top">
            <nav className="footer-links" aria-label="Footer menüsü">
              {footerLinks.map((item) => (
                <span key={item.href} className="footer-line">
                  <Link href={item.href}>{item.label}</Link>
                </span>
              ))}
            </nav>

            <div className="footer-blurb">
              <span className="footer-line">
                <p>{site.description}</p>
              </span>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-meta">
              <span>
                © {new Date().getFullYear()} {site.legalName} ·{" "}
                {site.contact.location}
              </span>
              <ul>
                <li>
                  <a href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                </li>
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-name">
              <h2 className="footer-word">
                {[...site.name].map((char, index) => (
                  <span key={`${char}-${index}`} className="footer-char">
                    {char}
                  </span>
                ))}
              </h2>
              <h2 className="footer-word">
                {[..."Yazılım"].map((char, index) => (
                  <span key={`${char}-${index}`} className="footer-char">
                    {char}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
