# D&S Stüdyo — ajans sitesi

Next.js 16 + TypeScript + Tailwind v4 ile kurulmuş, 3D içermeyen, koyu premium
ajans sitesi iskeleti.

## Çalıştırma

```bash
npm run dev      # http://localhost:5290
npm run build
npm run lint
```

## İçeriği nereden düzenlerim?

| Ne | Dosya |
| --- | --- |
| Marka adı, telefon, e-posta, sosyal, menü | `src/lib/site.ts` |
| Hizmetler, işler (6), süreç, SSS, yorumlar, blog | `src/lib/data.ts` |
| Paket kademeleri, fiyatlar, karşılaştırma satırları, hesaplayıcı soruları | `src/lib/pricing.ts` |
| Renk paleti, tipografi, animasyon token'ları | `src/app/globals.css` (`@theme`) |

Hiçbir metin bileşenlerin içine gömülmedi; yeni hizmet/proje/paket eklemek
ilgili diziye bir kayıt eklemek demek. `TODO` işaretli alanlar (telefon,
domain, sosyal linkler, ekip isimleri, yasal metinler) gerçek bilgiyle
doldurulmayı bekliyor.

## Sayfa haritası

Menü sırası: **anasayfa → hizmetler → referanslar → paketler → hakkımızda → iletişim**
(tümü tam ekran MENÜ overlay'inde).

- `/` — 8 bölümlük uzun anasayfa: 01 giriş · 02 manifesto (+rakamlar) ·
  03 hizmetler (+teknoloji) · 04 referanslar (+vaka) · 05 süreç (+neden biz) ·
  06 paketler (+hesaplayıcı) · 07 yorumlar (+blog +SSS) · 08 iletişim
- `/hizmetler` + `/hizmetler/[slug]` (11 sayfa, tek şablon)
- `/referanslar` + `/referanslar/[slug]` (vaka çalışması)
- `/paketler` — hizmet seçici + 3 kademe, hizmete özel karşılaştırma tablosu,
  7 adımlı fiyat hesaplayıcı (sonunda iletişim formu), fiyat SSS
- `/teklif-al` — 5 adımlı sihirbaz (şimdilik mailto ile gönderiyor)
- `/hakkimizda`, `/blog` + `/blog/[slug]`, `/iletisim`
- `/gizlilik`, `/kvkk`, `/cerez`, `not-found`, `sitemap.xml`, `robots.txt`

## Tasarım sistemi — "Sand & Black"

Saf siyah zemin (`#000`) + soluk kum rengi tipografi (`#e6ddaa`). **Beyaz
kullanılmıyor**; görsel dil siyah ile kumun yüksek kontrastına dayanıyor.
Panel/kart yüzeyi `#131313`, çizgiler kumun düşük opaklıklı halleri.

Üç katmanlı tipografi: display **Clash Display** (dev, uppercase, lh 0.9),
metin **Satoshi**, sayaç/claim katmanı **DM Mono** 14px uppercase.

### Tek arkaplan kuralı
Site baştan sona **tek zemin** (`--color-ink-950`) üzerinde durur; bölümler
kendi arkaplanını boyamaz (`section { background: transparent }`). Bir bölümün
zemini farklı olacaksa o bölüm tek tek değiştirilir.

Referans dil (imperialebolgheri.com) şu utility'lerle taşınıyor:
`.display` (dev BÜYÜK HARF başlık), `.chapter` (BÖLÜM 03 mono etiketi),
`.edge-note` (kenar mikro notu), `.tilt` (hafif eğik görsel kartı).

### Index — sadece sayfa yönlendirmeleri
`components/index/scene-navigator.tsx` + içerik `src/lib/scenes.ts`.

Açılış ekranında başka içerik yok: `100dvh` tam ekran sahneler arasında gezilir,
karta tıklanınca o sayfaya girilir ve içerik orada devam eder.

- 5 sahne: hizmetler · referanslar · paketler · hakkımızda · iletişim.
- Wheel, klavye (`ArrowDown/Right/PageDown` ileri, `ArrowUp/Left/PageUp` geri) ve
  dokunma (50px eşik) ile geçiş; **tek hareket = tek sahne** (950 ms kilit),
  son sahneden başa döner.
- Görsel, dev başlık, iki claim ve sayaç tek `index` state'iyle senkron değişir.
- Eğik maske dışta döner, fotoğraf içeride ters döner → ufuk çizgisi eğilmez.
  Geçişte ±1.8° drift; mobilde görsel iki kenardan taşar.
- Açılış animasyonu `scene-navigator.tsx` içinde: marka adı ortada belirir,
  fotoğraf tek noktadan açılır, "&" görselin altında kalıp sönerken "D" sola
  "S" sağa süzülür. Her yüklemede çalışır (~2,4 sn).
- `prefers-reduced-motion`'da perde hiç açılmaz, geçişler anlık olur.

## Animasyon yaklaşımı

- Scroll reveal tek merkezden: `src/components/reveal-engine.tsx`. Sunucu
  bileşenleri sadece `className="reveal"` yazar. IntersectionObserver + scroll
  dinleyicisi birlikte çalışır (gömülü önizleme sekmelerinde IO tetiklenmiyor).
- Başlıklar SplitText ile değil, `.line-mask > span` maskesiyle satır satır
  açılır (SplitText React strict mode'da satırları kopyalıyordu).
- Sekme/adım geçişleri AnimatePresence ile değil saf CSS
  (`.animate-fade-up`, `grid-template-rows`) ile yapılır.
- Yumuşak scroll Lenis (`components/providers/smooth-scroll.tsx`).
  Lenis altında framer-motion `useScroll` donuyor — scroll'a bağlı ölçüm
  gerekirse kendi rAF + `getBoundingClientRect` döngünüzü kurun.

## Hizmetleri gizleme

`src/lib/data.ts` → `hiddenServiceSlugs`. Buradaki slug'lar listelerden,
paketlerden, sitemap'ten ve kendi detay sayfasından düşer (veri silinmez).
Geri açmak = slug'ı diziden silmek.

## Ekip bölümü — ipe asılı kartlar (Lanyard)

`components/ui/lanyard.tsx` React Bits "Lanyard" bileşeninin TypeScript portu:
rapier fizikli ip (rope joint), meshline bant ve `card.glb` kimlik kartı.
Kart tutulup sürüklenebilir, bırakınca sallanır.

İpin ucundaki kart, React Bits **ProfileCard**'ının kendisidir
(`components/ui/profile-card.tsx`): holografik parlama, imleci izleyen ışık ve
3B tilt canlı çalışır; üstündeki LinkedIn / GitHub / Instagram ikonları ve
"Yaz" butonu tıklanabilir. Kartın boş bir yerinden tutup sürükleyince fizik
devralır (link ve butonlar sürüklemeyi tetiklemez).

- Ekip verisi: `src/lib/team.ts` — üye eklemek bir kayıt eklemek demek.
- Kart yüzünü dokuya basmak isterseniz `frontImage` / `backImage` props'ları da
  duruyor (spec API'si), o modda GLB kart kullanılır.

Varlıklar: `public/lanyard/card.glb` (kart modeli), `lanyard-light.png` (bant
dokusu). Bağımlılıklar: `three`, `meshline`, `@react-three/fiber`,
`@react-three/drei`, `@react-three/rapier`.

## Yayına alma — GitHub Pages

Site **tamamen statik** üretiliyor: `npm run build` sonunda `out/` klasöründe
her rota için bir `index.html` oluşuyor (`next.config.ts` → `output: "export"`).
Elle `index.html` hazırlamana gerek yok.

1. Bu klasörü GitHub'a push et (dal: `main`).
2. Repo → **Settings → Pages → Source: GitHub Actions** seç.
3. Hepsi bu. `.github/workflows/deploy.yml` her push'ta derleyip yayınlar;
   adres `https://<kullanici>.github.io/<repo-adi>/` olur.

Alt dizinde yayınlandığı için (`/<repo-adi>`) bütün bağlantı ve dosya
adreslerinin başına o yolun gelmesi gerekiyor. Workflow bunu repo adından
hesaplayıp `NEXT_PUBLIC_BASE_PATH` ile veriyor — repo adı
`<kullanici>.github.io` ise otomatik olarak boş bırakır. Elle denemek için:

```bash
NEXT_PUBLIC_BASE_PATH=/repo-adi npm run build   # out/ alt yola göre üretilir
```

Bu yapının gerektirdikleri (hepsi kurulu):

- `public/.nojekyll` — olmazsa Pages `_next/` klasörünü yok sayar, site çıplak
  HTML olarak açılır.
- `trailingSlash: true` — `/hizmetler` → `/hizmetler/index.html`.
- `src/lib/asset.ts` — `public/` altındaki her dosya yolu buradan geçer;
  Next.js `basePath`i yalnızca kendi ürettiği varlıklara ekliyor.
- Marka fontları `next/font/local` ile paketlenir (`src/fonts/`), CSS'te
  mutlak `url("/fonts/…")` yoktur.

Sunucu tarafı yok: API route'u, sunucu tarafı form işleme veya `searchParams`
okuyan sayfa eklenemez. Formlar şimdilik `mailto:` ile çalışıyor; gerçek form
gönderimi gerekirse ya Formspree gibi bir servis ya da Vercel'e geçiş gerekir.

## Sıradaki adımlar

1. `site.ts` içindeki TODO'lar (marka adı, domain, telefon, sosyal hesaplar)
2. Formlar için `/api/teklif` ve `/api/iletisim` route'ları (şu an mailto)
3. Blog içeriklerinin MDX'e taşınması
4. OG görseli, favicon, JSON-LD (Organization + Service şemaları)
5. Ekip fotoğrafları ve gerçek müşteri yorumları
# ds-studyo

