"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { LanguageProvider, Language } from "@/lib/i18n";

export function Providers({ children, initialLanguage, nonce }: { children: ReactNode, initialLanguage?: Language, nonce?: string }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} nonce={nonce}>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
