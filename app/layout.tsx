import type { Metadata } from "next";
import { Amiri, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";
import { headers } from "next/headers";
import Header from "@/components/layout/Header";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

import { pageMeta, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/StructuredData";
import { Language } from "@/lib/i18n";
import CookieConsent from "@/components/ui/CookieConsent";

export const metadata = pageMeta({
  title: "Arabia Khaleej — The GCC Standard",
  titleAr: "عربية خليج — المعيار الخليجي",
  description: SITE_DESCRIPTION,
  descriptionAr: "المرجع النهائي لتجربة خليجية متميزة.",
  path: "/",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headList = await headers();
  const nonce = headList.get('x-nonce') || undefined;
  
  const cookieHeader = headList.get('cookie') || '';
  const initialLanguage = (cookieHeader.split('; ').find(row => row.startsWith('NEXT_LOCALE='))?.split('=')[1] || 'en') as Language;

  return (
    <html lang={initialLanguage} dir={initialLanguage === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning className={`${inter.variable} ${amiri.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://open.er-api.com" />
        <link rel="preconnect" href="https://api.aladhan.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <OrganizationSchema nonce={nonce} />
        <WebSiteSchema nonce={nonce} />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-brand-gold focus:text-brand-obsidian focus:rounded-2xl focus:font-bold focus:shadow-2xl transition-all">
          Skip to content
        </a>
        <div className="fluid-gold-bg" />
        <Providers initialLanguage={initialLanguage} nonce={nonce}>
          <Header />
          <ClientLayout>
            <main id="main-content">
              {children}
            </main>
          </ClientLayout>
          <CookieConsent />
        </Providers>
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-WRXQ5H9Z7K" 
          strategy="afterInteractive" 
          nonce={nonce}
        />
        <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WRXQ5H9Z7K');
        `}</Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7212871157824722"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          nonce={nonce}
        />
      </body>
    </html>
  );
}
