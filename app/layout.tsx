import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HomeNav from "@/components/HomeNav";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["700"], style: ["italic"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  metadataBase: new URL("https://qatar-portal.vercel.app"),
  verification: { google: "fg-taPtjNWtu89uOmajC0OB3XxlZapUPAIItSnSnBQo" },
  title: "Qatar Portal — Prayer Times, Jobs & Services",
  description:
    "Your daily Qatar resource: accurate prayer times for Doha, latest job listings in Qatar, and local guides.",
  keywords: ["Qatar prayer times", "Doha prayer times today", `Qatar jobs ${new Date().getFullYear()}`, "Gulf jobs", "Fajr time Doha", "Qatar Portal"],
  alternates: { canonical: "https://qatar-portal.vercel.app" },
  applicationName: "Qatar Portal",
  openGraph: {
    title: "Qatar Portal",
    description: "Prayer times, jobs, and services for Qatar",
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
      <head>
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <HomeNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Qatar Portal",
            "url": "https://qatar-portal.vercel.app",
            "description": "Prayer times, jobs, and services for Qatar"
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://qatar-portal.vercel.app/#organization",
            "name": "Qatar Portal",
            "url": "https://qatar-portal.vercel.app",
            "logo": { "@type": "ImageObject", "url": "https://qatar-portal.vercel.app/logo.png", "width": 200, "height": 60 },
            "description": "Your daily Qatar resource: accurate prayer times for Doha, and latest job listings in Qatar.",
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
        <main id="main-content" className="flex-grow w-full px-4 sm:px-5 md:px-8 lg:px-12 py-5 sm:py-6 pb-20 md:pb-6">{children}</main>
        <CookieConsent />
        <SpeedInsights />

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
              <div className="max-w-xs">
                <span className="text-2xl font-black block mb-4 tracking-tight text-blue-600 dark:text-blue-400">
                  <span className="lang-en">Qatar Insider</span>
                  <span className="lang-ar">قطر إنسايدر</span>
                </span>
                <p className="text-sm leading-relaxed mb-6 text-slate-600 dark:text-slate-400">
                  <span className="lang-en">Your comprehensive digital companion for Qatar.</span>
                  <span className="lang-ar">رفيقك الرقمي الشامل في دولة قطر.</span>
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-en">Services</span>
                    <span className="lang-ar">الخدمات</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/prayer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Prayer Times</span><span className="lang-ar">مواقيت الصلاة</span></a></li>
                    <li><a href="/weather" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Weather</span><span className="lang-ar">الطقس</span></a></li>
                    <li><a href="/currency" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Currency</span><span className="lang-ar">العملات</span></a></li>
                    <li><a href="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Jobs</span><span className="lang-ar">الوظائف</span></a></li>
                  </ul>
                </div>
                <div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-en">Resources</span>
                    <span className="lang-ar">الموارد</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/qatar-visa-requirements" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Visa Requirements</span><span className="lang-ar">متطلبات التأشيرة</span></a></li>
                    <li><a href="/cost-of-living-doha" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Cost of Living</span><span className="lang-ar">تكلفة المعيشة</span></a></li>
                    <li><a href="/qatar-salary-guide" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Salary Guide</span><span className="lang-ar">دليل الرواتب</span></a></li>
                    <li><a href="/qatar-public-holidays" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Public Holidays</span><span className="lang-ar">الإجازات الرسمية</span></a></li>
                    <li><a href="/qatar-labour-law" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Labour Law</span><span className="lang-ar">قانون العمل</span></a></li>
                  </ul>
                </div>
                <div className="hidden sm:block">
                  <span className="font-black text-xs uppercase tracking-[0.2em] block mb-6 text-slate-900 dark:text-slate-100">
                    <span className="lang-en">Gov Guides</span>
                    <span className="lang-ar">الأدلة الحكومية</span>
                  </span>
                  <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <li><a href="/qatar-services/qid" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">QID Application</span><span className="lang-ar">طلب البطاقة</span></a></li>
                    <li><a href="/qatar-services/work-visa" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Work Visa</span><span className="lang-ar">تأشيرة العمل</span></a></li>
                    <li><a href="/qatar-services/family-visa" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Family Visa</span><span className="lang-ar">تأشيرة العائلة</span></a></li>
                    <li><a href="/qatar-services/driving-licence" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><span className="lang-en">Driving Licence</span><span className="lang-ar">رخصة القيادة</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <p>© {new Date().getFullYear()} The Digital Concierge Qatar.</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="lang-en">All Systems Operational</span>
                <span className="lang-ar">جميع الأنظمة تعمل</span>
              </div>
            </div>
          </div>
        </footer>

        <BottomNav />
      </body>
    </html>
  );
}
