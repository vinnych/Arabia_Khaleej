import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });

import { pageMeta, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import Header from "@/components/Header";

export const metadata = pageMeta({
  title: `${SITE_NAME} — The GCC Standard`,
  description: SITE_DESCRIPTION,
  path: "/",
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
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
