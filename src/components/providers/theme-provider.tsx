"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Tema sağlayıcı — `data-theme="light"` / `"dark"` özniteliğini <html> üstüne
 * yazar. Koyu tema varsayılan; aydınlık token'lar globals.css içinde
 * `:root[data-theme="light"]` altında tanımlıdır.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="monolit-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
