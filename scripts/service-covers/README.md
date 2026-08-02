# Hizmet kartı kapak görselleri

`public/services/<slug>.webp` (1200×1500) dosyalarını üretir. Her hizmet için
sıfırdan çizilmiş, sitenin kum+siyah paletinde bir SVG sahne; fotoğraf değil.

```bash
node scripts/service-covers/build.mjs            # 15'ini birden
node scripts/service-covers/build.mjs seo reklam # sadece seçilenler
```

- Sahneler `scenes.mjs` içinde (anahtar = `data.ts`'teki hizmet `slug`'ı).
- Ortak zemin/ışık/grain ve %88 ölçek `build.mjs`'teki şablonda; ölçek dar
  kadrajda (sahnede kart 0.62 en-boy) yandan kırpılmaya karşı pay bırakır.
- Gereksinim: Google Chrome (headless ekran görüntüsü) + `cwebp` (`brew install webp`).
