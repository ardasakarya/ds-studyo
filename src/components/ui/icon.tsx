import {
  AppWindow,
  Boxes,
  Globe,
  LifeBuoy,
  Megaphone,
  Monitor,
  Palette,
  Share2,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingUp,
  Webhook,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** data.ts içindeki `icon` anahtarları burada bileşene çevrilir. */
const map: Record<string, LucideIcon> = {
  globe: Globe,
  "app-window": AppWindow,
  smartphone: Smartphone,
  "shopping-cart": ShoppingCart,
  wrench: Wrench,
  sparkles: Sparkles,
  boxes: Boxes,
  monitor: Monitor,
  webhook: Webhook,
  workflow: Workflow,
  "trending-up": TrendingUp,
  megaphone: Megaphone,
  share: Share2,
  palette: Palette,
  "life-buoy": LifeBuoy,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = map[name] ?? Globe;
  return <Cmp className={className} strokeWidth={1.5} aria-hidden />;
}
