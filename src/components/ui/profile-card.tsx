"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import "./profile-card.css";

/**
 * React Bits "ProfileCard" — holografik parlama, imleci izleyen ışık ve
 * 3B tilt. Kaynak bileşenin TypeScript portu; ek olarak kartın üstünde
 * tıklanabilir sosyal ikon satırı ve marka etiketi var.
 */

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg, rgba(27,34,67,.96) 0%, rgba(7,11,25,.99) 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const;

const socialIcons = {
  GitHub: FaGithub,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
} as const;

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) =>
  parseFloat(value.toFixed(precision));
const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
) => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

type ProfileCardProps = {
  avatarUrl: string;
  miniAvatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  kicker?: string;
  name: string;
  title: string;
  handle: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  socialLinks?: ReadonlyArray<{ label: string; href: string }>;
  onContactClick?: () => void;
};

function ProfileCardComponent({
  avatarUrl,
  miniAvatarUrl,
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  kicker,
  name,
  title,
  handle,
  status = "Projede aktif",
  contactText = "İletişim",
  showUserInfo = true,
  socialLinks = [],
  onContactClick,
}: ProfileCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  /* İmleci yumuşatarak takip eden tilt motoru */
  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1,
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 4.15))}deg`,
        "--rotate-y": `${round(centerY / 3.5)}deg`,
      };

      for (const [key, value] of Object.entries(properties)) {
        wrap.style.setProperty(key, value);
      }
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-delta / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      setVarsFromXY(currentX, currentY);

      const stillFar =
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05;

      if (stillFar) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (event: PointerEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add("active");
      shell.classList.add("entering");
      wrapRef.current?.classList.add("active");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        shell.classList.remove("active");
        wrapRef.current?.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };

    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      tiltEngine.setTarget(
        clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth),
        clamp(
          centerY +
            (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) *
              mobileTiltSensitivity,
          0,
          shell.clientHeight,
        ),
      );
    },
    [mobileTiltSensitivity, tiltEngine],
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    const shell = shellRef.current;
    if (!shell) return;

    shell.addEventListener("pointerenter", handlePointerEnter);
    shell.addEventListener("pointermove", handlePointerMove);
    shell.addEventListener("pointerleave", handlePointerLeave);
    /* Dokunmatikte kaydırma başlayınca `pointerleave` gelmez, `pointercancel`
       gelir. Bunu dinlemezsek kart "active" hâlde takılı kalıyor. */
    shell.addEventListener("pointercancel", handlePointerLeave);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      const motion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<PermissionState>;
      };
      if (motion && typeof motion.requestPermission === "function") {
        motion
          .requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation,
              );
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleDeviceOrientation);
      }
    };
    shell.addEventListener("click", handleClick);

    tiltEngine.setImmediate(
      (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET,
      ANIMATION_CONFIG.INITIAL_Y_OFFSET,
    );
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", handlePointerEnter);
      shell.removeEventListener("pointermove", handlePointerMove);
      shell.removeEventListener("pointerleave", handlePointerLeave);
      shell.removeEventListener("pointercancel", handlePointerLeave);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove("entering");
    };
  }, [
    enableMobileTilt,
    enableTilt,
    handleDeviceOrientation,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerMove,
    tiltEngine,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color":
          behindGlowColor ?? "rgba(230, 221, 170, 0.68)",
        "--behind-glow-size": behindGlowSize ?? "45%",
      }) as React.CSSProperties,
    [behindGlowColor, behindGlowSize, grainUrl, iconUrl, innerGradient],
  );

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {behindGlowEnabled ? <div className="pc-behind" aria-hidden /> : null}

      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" aria-hidden />
            <div className="pc-glare" aria-hidden />
            <div className="pc-code-field" aria-hidden>
              {Array.from({ length: 6 }, (_, index) => (
                <span key={index} className="pc-code-token">
                  {"</>"}
                </span>
              ))}
            </div>

            <div className="pc-content pc-avatar-content">
              {/* next/image değil: kart 3B katmanda ve dokuya da render ediliyor */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="avatar"
                src={avatarUrl}
                alt=""
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              {kicker ? <span className="pc-kicker">{kicker}</span> : null}

              {socialLinks.length ? (
                <nav
                  className="pc-socials"
                  aria-label={`${name} sosyal medya bağlantıları`}
                >
                  {socialLinks.map((social) => {
                    const Icon =
                      socialIcons[social.label as keyof typeof socialIcons];
                    if (!Icon) return null;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        title={social.label}
                      >
                        <Icon aria-hidden />
                      </a>
                    );
                  })}
                </nav>
              ) : null}

              {showUserInfo ? (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={miniAvatarUrl || avatarUrl} alt="" loading="lazy" />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn"
                    onClick={onContactClick}
                    type="button"
                    aria-label={`${name} ile iletişime geç`}
                  >
                    {contactText}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);
export default ProfileCard;
