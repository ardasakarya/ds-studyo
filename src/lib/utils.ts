import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Rota karşılaştırmaları için yolu sadeleştirir.
 *
 * Site statik dışa aktarıldığından `trailingSlash: true` açık ve `usePathname()`
 * "/hakkimizda/" döndürüyor; `scenes.ts`/menü gibi yerlerde ise yollar
 * "/hakkimizda" yazılı. İkisi karşılaştırılmadan önce buradan geçmeli, yoksa
 * eşleşme kaçıyor (ör. sayfa hero'sunun tam ekran fotoğrafı gelmiyordu).
 * Ayrıca site alt dizinde yayınlanıyorsa (GitHub Pages) baştaki alt yol atılır.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function normalizePath(path: string) {
  let value = path;
  if (basePath && value.startsWith(basePath)) value = value.slice(basePath.length);
  if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
  return value || "/";
}

/** 2026-06-18 -> 18 Haziran 2026 */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
