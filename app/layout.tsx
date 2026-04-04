import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import ConditionalHeader from "@/components/ConditionalHeader";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["700"], style: ["italic"], variable: "--font-newsreader" });

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
    images: [{ url: "https://qatar-portal.vercel.app/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <head />
      <body className={`${inter.className} bg-[#faf9f6] text-on-surface min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <ConditionalHeader><Header /></ConditionalHeader>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Qatar Portal",
            "url": "https://qatar-portal.vercel.app",
            "logo": { "@type": "ImageObject", "url": "https://qatar-portal.vercel.app/logo.png", "width": 200, "height": 60 },
            "description": "Your daily Qatar resource: accurate prayer times for Doha, latest job listings in Qatar, and top Gulf news headlines.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "West Bay",
              "addressRegion": "Doha",
              "postalCode": "11111",
              "addressCountry": "QA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 25.2854,
              "longitude": 51.5310
            },
            "areaServed": [
              { "@type": "Country", "name": "Qatar" },
              { "@type": "Country", "name": "United Arab Emirates" },
              { "@type": "Country", "name": "Saudi Arabia" },
              { "@type": "Country", "name": "Kuwait" },
              { "@type": "Country", "name": "Bahrain" },
              { "@type": "Country", "name": "Oman" }
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "areaServed": "GCC"
            }
          })}}
        />
        <main id="main-content" className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-20 md:pb-5">{children}</main>
        <CookieConsent />
        <SpeedInsights />
        {/* Rich footer */}
        <footer className="relative mt-auto bg-primary-dark text-white overflow-hidden pb-20 md:pb-0">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=2000"
              alt="Doha Skyline"
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-bold text-2xl tracking-wide text-qatar-sand">QATAR</span>
                  <span className="text-[9px] font-medium opacity-70 uppercase tracking-[0.2em] mt-1 border border-white/20 rounded-full px-2 py-0.5">Portal</span>
                </div>
                <p className="text-sm text-qatar-sand/80 leading-relaxed">
                  Your daily companion for life in Qatar. Bringing you real-time prayer times, local news, and job opportunities in one beautifully designed dashboard.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-qatar-sand mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li><a href="/prayer" className="hover:text-secondary-accent transition-colors">Prayer Times</a></li>
                  <li><a href="/news" className="hover:text-secondary-accent transition-colors">Local News</a></li>
                  <li><a href="/jobs" className="hover:text-secondary-accent transition-colors">Job Board</a></li>
                  <li><a href="/weather" className="hover:text-secondary-accent transition-colors">Weather</a></li>
                  <li><a href="/currency" className="hover:text-secondary-accent transition-colors">QAR Rates</a></li>
                  <li><a href="/hijri-calendar" className="hover:text-secondary-accent transition-colors">Hijri Calendar</a></li>
                  <li><a href="/qatar-metro" className="hover:text-secondary-accent transition-colors">Qatar Metro</a></li>
                  <li><a href="/about" className="hover:text-secondary-accent transition-colors">About Us</a></li>
                </ul>
              </div>

              {/* Resources + Contact */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-qatar-sand mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-white/80 mb-6">
                  <li><a href="/work-in-qatar" className="hover:text-secondary-accent transition-colors">Work in Qatar</a></li>
                  <li><a href="/qatar-visa-requirements" className="hover:text-secondary-accent transition-colors">Qatar Visa</a></li>
                  <li><a href="/cost-of-living-doha" className="hover:text-secondary-accent transition-colors">Cost of Living</a></li>
                  <li><a href="/qatar-salary-guide" className="hover:text-secondary-accent transition-colors">Salary Guide</a></li>
                  <li><a href="/qatar-public-holidays" className="hover:text-secondary-accent transition-colors">Public Holidays</a></li>
                  <li><a href="/emergency-numbers-qatar" className="hover:text-secondary-accent transition-colors">Emergency Numbers</a></li>
                  <li><a href="/privacy" className="hover:text-secondary-accent transition-colors">Privacy</a></li>
                  <li><a href="/terms" className="hover:text-secondary-accent transition-colors">Terms of Service</a></li>
                </ul>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-3">
                    <MapPin size={16} className="text-secondary-accent shrink-0" />
                    <span>West Bay, Doha, Qatar</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-qatar-sand/60">
              <p>© {new Date().getFullYear()} Qatar Portal · Aladhan · Open-Meteo · ExchangeRate-API</p>
              <p className="mt-2 sm:mt-0">Made with ❤️ in Doha</p>
            </div>
          </div>
        </footer>

        <BottomNav />
      </body>
    </html>
  );
}
