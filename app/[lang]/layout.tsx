import type { Metadata } from "next";
import { Amiri, Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/layout/Providers";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";
import { headers } from "next/headers";
import Header from "@/components/layout/Header";
import { pageMeta, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/StructuredData";
import { Language } from "@/lib/i18n";
import CookieConsent from "@/components/ui/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });


// Why: Converting static metadata to generateMetadata ensures that the root layout's canonical and alternate lang 
// tags are dynamically generated based on the active locale parameter ('[lang]') resolved at request time.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  return pageMeta({
    title: "Arabia Khaleej — The GCC Standard",
    titleAr: "عربية خليج — المعيار الخليجي",
    description: SITE_DESCRIPTION,
    descriptionAr: "المرجع النهائي لتجربة خليجية متميزة.",
    path: "/",
    lang,
  });
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// NOTE: runtime='edge' removed for OpenNext/Cloudflare Workers compatibility.
// All routes run in nodejs_compat Workers runtime - edge declaration not needed.

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const headList = await headers();
  const nonce = headList.get('x-nonce') || undefined;
  
  const resolvedParams = await params;
  const initialLanguage = (resolvedParams.lang === 'ar' ? 'ar' : 'en') as Language;

  return (
    <html lang={initialLanguage} dir={initialLanguage === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning className={`${inter.variable} ${amiri.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <OrganizationSchema nonce={nonce} />
        <WebSiteSchema nonce={nonce} />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-brand-gold focus:text-brand-obsidian focus:rounded-2xl focus:font-bold focus:shadow-2xl transition-all">
          Skip to content
        </a>
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
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`} 
            crossOrigin="anonymous" 
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
