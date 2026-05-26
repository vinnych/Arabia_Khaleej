import Link from "next/link";

// Admin layout for review pages
// Uses glass morphism design consistent with the Arabia Khaleej brand
// Provides navigation back to the main site and a clean content area
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-obsidian text-foreground">
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