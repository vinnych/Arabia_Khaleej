"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prayer", label: "Prayer Times" },
  { href: "/weather", label: "Weather" },
  { href: "/currency", label: "QAR Rates" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#640023] shadow-lg z-50">
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors py-4 text-base font-medium border-b border-white/10 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
