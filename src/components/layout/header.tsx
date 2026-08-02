"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { MenuBackdrop } from "@/components/layout/menu-backdrop";
import { MenuGrid } from "@/components/layout/menu-grid";
import { ThemeToggle } from "@/components/ui/be-ui-theme-toggle";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Header: solda iki satırlı kelime işareti, sağda MENÜ butonu.
 * Navigasyonun tamamı tam ekran panelde (referans: imperialebolgheri.com).
 *
 * Erişilebilirlik: aria-expanded / aria-controls / aria-modal, Escape ile
 * kapanma, panel içinde focus tuzağı ve kapanınca odağın butona dönmesi.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* Hover sahnesi ilk açılışa kadar DOM'a girmez — görselleri boşuna indirmesin. */
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setMenu = (next: boolean) => {
    setOpen(next);
    if (next) setMounted(true);
    else setActive(null);
  };

  /* Hero fotoğrafı artık temayla aynı tonda (koyu temada koyu, aydınlık
     temada aydınlık kare) olduğu için header'ı fotoğrafın üstünde kum
     paletine çevirmeye gerek yok; tema token'ları zaten okunuyor. */

  /* Gövde kilidi + odak yönetimi */
  useEffect(() => {
    if (!open) return;

    const trigger = buttonRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    /* Odak panelin kendisine gider: ilk bağlantıya odaklanmak onFocus ile
       sahneyi açıp idle bloğunu daha fare gelmeden kapatıyordu. */
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setActive(null);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      {/* Menü açıkken ya da fotoğraflı hero'nun üstündeyken koyu palet */}
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-60",
          open && "media-layer",
        )}
      >
        <div className="flex items-start justify-between p-4 sm:p-[23px]">
          <Link
            href="/"
            onClick={() => setMenu(false)}
            className="pointer-events-auto font-display text-[1.35rem] leading-[0.95] tracking-[-0.02em] uppercase sm:text-[1.7rem]"
            aria-label={`${site.name} anasayfa`}
          >
            {site.name}
            <br />
            <span className="text-fg-muted">stüdyo</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tema düğmesi — site geneli aydınlık/koyu arasında döner */}
            <ThemeToggle
              variant="circle-blur"
              start="top-right"
              label={<span className="hidden sm:inline">tema</span>}
              iconClassName="size-4 sm:size-[1.05rem]"
              className="pointer-events-auto h-9 gap-2 rounded-[10px] border border-accent bg-transparent px-3 font-sans text-xs tracking-[0.12em] text-accent uppercase transition-colors duration-300 hover:bg-accent hover:text-ink-950 sm:h-[45px] sm:px-4 sm:text-sm"
            />

            <button
              ref={buttonRef}
              type="button"
              onClick={() => setMenu(!open)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="pointer-events-auto h-9 w-[86px] rounded-[10px] border border-accent bg-accent font-sans text-xs tracking-[0.12em] text-ink-950 uppercase transition-colors duration-300 hover:bg-transparent hover:text-accent sm:h-[45px] sm:w-[109px] sm:text-sm"
            >
              {open ? "kapat" : "menü"}
            </button>
          </div>
        </div>
      </header>

      {/* Tam ekran menü */}
      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Site menüsü"
        tabIndex={-1}
        className={cn(
          /* Menü iki temada da sinematik koyu kalır (media-layer): görseller
             filtrelenmez, metin kum rengidir. */
          "media-layer fixed inset-0 z-50 overflow-y-auto bg-ink-800 transition-opacity duration-500 ease-[var(--ease-scene)]",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {mounted ? <MenuBackdrop active={active} /> : null}

        <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1700px] flex-col justify-center gap-10 px-4 pt-24 pb-10 sm:px-[23px] sm:pt-28 lg:grid lg:h-full lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:items-stretch lg:gap-12 lg:pb-12">
          {/* Sol sütun — menü içerikleri */}
          <div className="flex flex-col justify-center">
            <nav
              aria-label="Ana menü"
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              <ul className="flex flex-col gap-2">
                {mainNav.map((item, i) => {
                  const current =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenu(false)}
                        onMouseEnter={() => setActive(item.href)}
                        onFocus={() => setActive(item.href)}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "display block w-fit text-[clamp(1.45rem,2.4vw,2rem)] transition-all duration-500 ease-[var(--ease-scene)]",
                          open
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0",
                          current || active === item.href
                            ? "text-fg"
                            : "text-fg-muted hover:text-fg",
                        )}
                        style={{
                          transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Link
              href="/teklif-al"
              onClick={() => setMenu(false)}
              className="edge-note group mt-10 inline-flex w-fit items-center gap-3 rounded-[10px] border border-accent px-6 py-3 text-fg transition-colors duration-300 hover:bg-accent hover:text-ink-950"
            >
              teklif al
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>

            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start lg:gap-4">
              <div className="edge-note flex flex-col gap-1 text-fg-faint">
                <span>{site.contact.location}</span>
                <a
                  href={site.contact.phoneHref}
                  className="transition-colors hover:text-fg"
                >
                  {site.contact.phone}
                </a>
              </div>

              <div className="edge-note flex flex-col gap-1 text-fg-faint sm:items-end sm:text-right lg:items-start lg:text-left">
                <span>stüdyo / iletişim</span>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors hover:text-fg"
                >
                  {site.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Sağ sütun — üstüne gelinen sayfanın görselleri */}
          {mounted ? <MenuGrid active={active} /> : null}
        </div>
      </div>
    </>
  );
}
