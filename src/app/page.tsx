import { SceneNavigator } from "@/components/index/scene-navigator";

/**
 * Index — SADECE sayfa yönlendirmeleri.
 * Tam ekran sahneler arasında gezilir, tıklanınca ilgili sayfaya girilir ve
 * içerik orada devam eder. Sahneler: src/lib/scenes.ts
 *
 * Açılış animasyonu sahne gezgininin içindedir (marka harfleri + çapraz
 * çerçevenin bir noktadan açılması) — ayrı bir perde yok.
 */
export default function HomePage() {
  return <SceneNavigator />;
}
