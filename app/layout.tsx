import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FooterScenery from "@/components/FooterScenery";
import MobileNav from "@/components/MobileNav";
import DonateDialog from "@/components/DonateDialog";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://qatar-portal.vercel.app"),
  verification: { google: "fg-taPtjNWtu89uOmajC0OB3XxlZapUPAIItSnSnBQo" },
  title: "Qatar Portal — Prayer Times, Jobs & News",
  description:
    "Your daily Qatar resource: accurate prayer times for Doha, latest job listings in Qatar, and top Gulf news headlines.",
  keywords: ["Qatar prayer times", "Doha prayer times today", `Qatar jobs ${new Date().getFullYear()}`, "Qatar news", "Gulf jobs", "Fajr time Doha"],
  alternates: { canonical: "https://qatar-portal.vercel.app" },
  openGraph: {
    title: "Qatar Portal",
    description: "Prayer times, jobs, and news for Qatar",
    url: "https://qatar-portal.vercel.app",
    siteName: "Qatar Portal",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} bg-stone-50 text-gray-900 min-h-screen`}>
        <header className="bg-rose-900 sticky top-0 z-10 border-b border-rose-950/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
            <a href="/" className={`${playfair.className} text-lg tracking-widest text-amber-300 uppercase leading-none`}>
              Qatar
            </a>
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-5 text-[11px] font-semibold tracking-wide">
              <a href="/" className="text-white/70 hover:text-white transition-colors duration-150">Home</a>
              <a href="/prayer" className="text-white/70 hover:text-white transition-colors duration-150">Prayer</a>
              <a href="/weather" className="text-white/70 hover:text-white transition-colors duration-150">Weather</a>
              <a href="/currency" className="text-white/70 hover:text-white transition-colors duration-150">Currency</a>
              <a href="/news" className="text-white/70 hover:text-white transition-colors duration-150">News</a>
              <a href="/jobs" className="text-white/70 hover:text-white transition-colors duration-150">Jobs</a>
              <a href="/hijri-calendar" className="text-white/70 hover:text-white transition-colors duration-150">Hijri</a>
              <a href="/ramadan-2026" className="text-white/70 hover:text-white transition-colors duration-150">Ramadan</a>
            </nav>
            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </header>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Qatar Portal",
            "url": "https://qatar-portal.vercel.app",
            "description": "Prayer times, jobs, and news for Qatar",
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": "https://qatar-portal.vercel.app/news?q={search_term_string}" },
              "query-input": "required name=search_term_string"
            }
          })}}
        />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7212871157824722"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VPREJS079K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VPREJS079K');
          `}
        </Script>
        <SpeedInsights />
        <DonateDialog />
        <FooterScenery />
        <footer className="border-t border-stone-200 py-6 text-[11px] text-gray-400">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-5 gap-y-2 mb-4">
              <a href="/" className="hover:text-gray-600 transition-colors duration-150">Home</a>
              <a href="/prayer" className="hover:text-gray-600 transition-colors duration-150">Prayer Times</a>
              <a href="/hijri-calendar" className="hover:text-gray-600 transition-colors duration-150">Hijri Calendar</a>
              <a href="/ramadan-2026" className="hover:text-gray-600 transition-colors duration-150">Ramadan 2026</a>
              <a href="/weather" className="hover:text-gray-600 transition-colors duration-150">Weather</a>
              <a href="/currency" className="hover:text-gray-600 transition-colors duration-150">Currency</a>
              <a href="/news" className="hover:text-gray-600 transition-colors duration-150">News</a>
              <a href="/jobs" className="hover:text-gray-600 transition-colors duration-150">Jobs</a>
              <a href="/work-in-qatar" className="hover:text-gray-600 transition-colors duration-150">Work in Qatar</a>
              <a href="/qatar-visa-requirements" className="hover:text-gray-600 transition-colors duration-150">Qatar Visa</a>
              <a href="/cost-of-living-doha" className="hover:text-gray-600 transition-colors duration-150">Cost of Living</a>
              <a href="/qatar-salary-guide" className="hover:text-gray-600 transition-colors duration-150">Salary Guide</a>
              <a href="/about" className="hover:text-gray-600 transition-colors duration-150">About</a>
              <a href="/privacy" className="hover:text-gray-600 transition-colors duration-150">Privacy</a>
            </div>
            <p className="text-center text-gray-300">© {new Date().getFullYear()} Qatar Portal · Aladhan · Open-Meteo · ExchangeRate-API</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
