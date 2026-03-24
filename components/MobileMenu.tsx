"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prayer", label: "Prayer" },
  { href: "/weather", label: "Weather" },
  { href: "/currency", label: "Currency" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/hijri-calendar", label: "Hijri" },
  { href: "/qatar-metro", label: "Metro" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="sm:hidden p-2 -mr-2 text-white/70 hover:text-white transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="fixed top-3 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "rgba(14,4,10,0.96)",
                border: "1px solid rgba(200,168,75,0.18)",
                backdropFilter: "blur(20px)",
                minWidth: "180px",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="flex flex-col py-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
