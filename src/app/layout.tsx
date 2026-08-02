import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { QuoteSpotlight } from "@/components/quote/quote-spotlight";
import {
  HideOnIndex,
  HideOnContactRoutes,
} from "@/components/layout/route-gate";
import { RevealEngine } from "@/components/reveal-engine";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

/* Sayaç ve claim katmanının mono fontu (spec: DM Mono) */
const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Yazılım & dijital ürün stüdyosu`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "web sitesi",
    "mobil uygulama",
    "e-ticaret",
    "özel yazılım",
    "yazılım ajansı",
    "Mersin yazılım",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${dmMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <SmoothScroll />
          <RevealEngine />
          <Header />

          {/* Sayfa katmanı opak ve footer'ın üstünde; sonundaki boşluk
              (footer-revealer) sabit footer'ı açığa çıkarır. */}
          <div className="page-layer flex flex-1 flex-col">
            <main className="flex-1">{children}</main>
            <HideOnContactRoutes>
              <QuoteSpotlight />
            </HideOnContactRoutes>
          </div>

          <HideOnIndex>
            <SiteFooter />
          </HideOnIndex>
        </ThemeProvider>
      </body>
    </html>
  );
}
