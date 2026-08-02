/**
 * `public/` altındaki dosyaların adresi.
 *
 * Site bir alt dizinde yayınlanabiliyor (GitHub Pages:
 * kullanici.github.io/repo-adi). Next.js `basePath`i kendi ürettiği
 * `_next/…` varlıklarına ekliyor ama `public/` içindeki dosyalara
 * DOKUNMUYOR — o yüzden bu klasördeki her yol buradan geçmeli.
 *
 * Alt yol GitHub Actions akışında repo adından hesaplanıp
 * `NEXT_PUBLIC_BASE_PATH` ile veriliyor; yerelde ve kök dizinde boş kalır.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
