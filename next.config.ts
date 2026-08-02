import type { NextConfig } from "next";

/**
 * Site tamamen statik olarak dışa aktarılıyor (`out/` klasörü, her rota için
 * `index.html`). Böylece GitHub Pages, cPanel, Netlify gibi düz dosya servis
 * eden her yere olduğu gibi yüklenebiliyor.
 *
 * Alt yolda yayınlanıyorsa (ör. kullanici.github.io/ds-studyo) tüm bağlantı ve
 * varlık adreslerinin başına o yolun eklenmesi gerekir; bunu GitHub Actions
 * akışı repo adından hesaplayıp `NEXT_PUBLIC_BASE_PATH` ile veriyor.
 *
 * Not: bu modda sunucu tarafı yok — API route'u, sunucu tarafı form işleme ve
 * `searchParams` okuyan sayfa eklenemez (formlar şimdilik mailto ile çalışıyor).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  /** /hizmetler → /hizmetler/index.html (statik sunucularda 404 olmasın). */
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  /** Statik dışa aktarımda sunucu tarafı görsel optimizasyonu çalışmaz. */
  images: { unoptimized: true },
};

export default nextConfig;
