"use client";

import { usePathname } from "next/navigation";

/**
 * Index sayfası tam ekran sahne sistemidir; footer ve normal sayfa akışı
 * yalnızca diğer rotalarda görünür.
 */
export function HideOnIndex({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}

/** Teklif CTA'sının anlamsız kaldığı rotalar (formun kendisi ve iletişim). */
const CTA_HIDDEN = ["/", "/iletisim", "/teklif-al"];

export function HideOnContactRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (CTA_HIDDEN.includes(pathname)) return null;
  return <>{children}</>;
}
