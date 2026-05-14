import { Providers } from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import CookieConsent from "@/components/ui/CookieConsent";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main id="main-content" className="pt-20 pb-8">
        {children}
      </main>
      <CookieConsent />
    </Providers>
  );
}
