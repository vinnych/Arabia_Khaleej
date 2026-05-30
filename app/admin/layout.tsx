import Link from "next/link";
// WHY: We import the global styles (which includes Tailwind, CSS variables, body styles, custom scrollbars, and animations)
// to ensure the admin panel renders properly and has access to custom design system tokens.
import "../globals.css";

// Force static rendering for the admin panel to avoid Cloudflare 1102 Worker limits.
// The dashboard fetches data strictly on the client side, so SSR is unnecessary.
export const dynamic = 'force-static';

// Admin layout for review pages
// Uses glass morphism design consistent with the Arabia Khaleej brand
// Provides navigation back to the main site and a clean content area
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // WHY: We force the "dark" class on the parent container here.
    // Since this admin panel is built around a premium obsidian-and-gold color scheme,
    // forcing "dark" ensures that HSL-based CSS variables (like --foreground and --card) 
    // resolve to light text and dark backgrounds, preventing unreadable dark-charcoal text
    // on a dark-obsidian background if the user has an active system-wide light mode theme.
    <div className="dark min-h-screen bg-brand-obsidian text-foreground">

      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-brand-gold/4 blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-[500px] h-[500px] bg-brand-accent/3 blur-[140px] rounded-full -z-10 pointer-events-none" />
      
      <nav className="px-6 sm:px-12 pt-10 pb-0">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-accent hover:text-brand-gold transition-all duration-300 group"
        >
          <span className="w-5 h-[1.5px] bg-brand-gold/40 group-hover:bg-brand-gold transition-all duration-300 group-hover:w-8" />
          Arabia Khaleej
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-16 pb-32">
        {children}
      </main>
    </div>
  );
}