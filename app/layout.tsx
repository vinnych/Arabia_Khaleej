import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import HomeNav from "@/components/HomeNav";
import CookieConsent from "@/components/CookieConsent";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const serif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], style: ["italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://arabiakhaleej.com"),
  verification: { google: "fg-taPtjNWtu89uOmajC0OB3XxlZapUPAIItSnSnBQo" },
  description:
    "The definitive digital concierge for the GCC region. Elite curator analysis of prayer times, administrative protocols, and lifestyle registries for the global professional.",
  keywords: ["Arabia Khaleej", "GCC digital concierge", "Gulf expat registry", "living in Saudi Arabia 2026", "UAE administrative protocols", "Arabia Khaleej portal"],
  alternates: { canonical: "https://arabiakhaleej.com" },
  applicationName: "Arabia Khaleej",
  openGraph: {
    title: "Arabia Khaleej | Elite GCC Digital Concierge",
    description: "The definitive digital concierge for the GCC region. Performance-grade prayer times, administrative protocols, and lifestyle registries.",
    url: "https://arabiakhaleej.com",
    siteName: "Arabia Khaleej",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://arabiakhaleej.com/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#020617" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#faf9f6] dark:bg-slate-950 text-on-surface dark:text-slate-100 min-h-screen flex flex-col`}>
        {/* Zero-Risk Header Disclaimer */}
        <div className="bg-slate-900 text-white/60 text-[10px] uppercase tracking-[0.2em] py-1.5 text-center font-black">
          Independent Community Guide • Unofficial Hobbyist Project
        </div>
        
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <HomeNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Arabia Khaleej",
            "url": "https://arabiakhaleej.com",
            "description": "The definitive digital concierge for the GCC region — prayer times, expat guides, and administrative protocols."
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://arabiakhaleej.com/#organization",
            "name": "Arabia Khaleej",
            "url": "https://arabiakhaleej.com",
            "logo": { "@type": "ImageObject", "url": "https://arabiakhaleej.com/icon.png", "width": 512, "height": 512 },
            "description": "An independent community resource for the GCC region — prayer times, expat guides, visa information, and public service directories.",
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
              { "@type": "Country", "name": "Saudi Arabia" },
              { "@type": "Country", "name": "United Arab Emirates" },
              { "@type": "Country", "name": "Qatar" },
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
        <main id="main-content" className="flex-grow w-full px-4 sm:px-5 md:px-8 lg:px-12 py-2 sm:py-6">{children}</main>
        <CookieConsent />
        <SpeedInsights />
        <Analytics />

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
              <div className="max-w-xs">
                <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Independent Hobby Project</p>
                <p className="text-xs leading-relaxed mb-6 text-slate-500 dark:text-slate-400 font-medium">
                  <span className="lang-en">A dedicated, unofficial digital concierge for the GCC region. We provide high-density utility data focused on speed and simplicity.</span>
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-ar">الخدمات</span>
                    <span className="lang-en">Services</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/prayer" className="hover:text-primary transition-colors"><span className="lang-ar">مواقيت الصلاة</span><span className="lang-en">Prayer Times</span></a></li>
                    <li><a href="/weather" className="hover:text-primary transition-colors"><span className="lang-ar">الطقس</span><span className="lang-en">Weather</span></a></li>
                    <li><a href="/currency" className="hover:text-primary transition-colors"><span className="lang-ar">العملات</span><span className="lang-en">Currency</span></a></li>
                  </ul>
                </div>
                <div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-ar">الموارد</span>
                    <span className="lang-en">Resources</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/qatar-visa-requirements" className="hover:text-primary transition-colors"><span className="lang-ar">متطلبات التأشيرة</span><span className="lang-en">Visa Requirements</span></a></li>
                    <li><a href="/cost-of-living-doha" className="hover:text-primary transition-colors"><span className="lang-ar">تكلفة المعيشة</span><span className="lang-en">Cost of Living</span></a></li>
                    <li><a href="/qatar-salary-guide" className="hover:text-primary transition-colors"><span className="lang-ar">دليل الرواتب</span><span className="lang-en">Salary Guide</span></a></li>
                    <li><a href="/qatar-public-holidays" className="hover:text-primary transition-colors"><span className="lang-ar">الإجازات الرسمية</span><span className="lang-en">Public Holidays</span></a></li>
                  </ul>
                </div>
                <div className="hidden sm:block">
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-en">Community Guides</span>
                    <span className="lang-ar">أدلة المجتمع</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/qatar-services/qid" className="hover:text-primary transition-colors"><span className="lang-en">QID Application</span><span className="lang-ar">طلب البطاقة</span></a></li>
                    <li><a href="/qatar-services/work-visa" className="hover:text-primary transition-colors"><span className="lang-en">Work Visa</span><span className="lang-ar">تأشيرة العمل</span></a></li>
                    <li><a href="/qatar-services/family-visa" className="hover:text-primary transition-colors"><span className="lang-en">Family Visa</span><span className="lang-ar">تأشيرة العائلة</span></a></li>
                    <li><a href="/qatar-services/driving-licence" className="hover:text-primary transition-colors"><span className="lang-en">Driving Licence</span><span className="lang-ar">رخصة القيادة</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <p>© {new Date().getFullYear()} Arabia Khaleej — Independent Hobby Project</p>
              <div className="flex items-center gap-6">
                <a href="/about" className="hover:text-primary transition-colors">About</a>
                <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
