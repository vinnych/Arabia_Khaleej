import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ClientLayout from "@/components/ClientLayout";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });

import { pageMeta, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import Header from "@/components/Header";

export const metadata = pageMeta({
  title: "Arabia Khaleej | The GCC Standard — Regional Intelligence Portal",
  titleAr: "عربية خليج | المعيار الخليجي — بوابة الاستخبارات الإقليمية",
  description: "The definitive reference for a refined GCC experience. High-fidelity intelligence on economy, sovereign vision, and national infrastructure across the Gulf.",
  descriptionAr: "المرجع النهائي لتجربة خليجية متميزة. معلومات عالية الدقة حول الاقتصاد والرؤية السيادية والبنية التحتية الوطنية في جميع أنحاء الخليج.",
  path: "/",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WRXQ5H9Z7K" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WRXQ5H9Z7K');
        `}</Script>
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <Providers>
          <OrganizationSchema />
          <WebSiteSchema />
          <Header />
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
