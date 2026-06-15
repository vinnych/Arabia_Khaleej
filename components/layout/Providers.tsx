"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { LanguageProvider, Language } from '@/lib/i18n/i18n';

export function Providers({ children, initialLanguage, nonce }: { children: ReactNode, initialLanguage?: Language, nonce?: string }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      {/* Why: The GCC Standard brand of Arabia Khaleej is built around a signature premium dark obsidian style.
               Therefore, we configure the ThemeProvider to load the "dark" theme by default, and allow
               users to explicitly opt into "light" (Daylight Vision) when clicking the toggle. */}
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} nonce={nonce}>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
