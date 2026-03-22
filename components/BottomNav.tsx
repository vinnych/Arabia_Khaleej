"use client";

import { usePathname } from "next/navigation";
import { Home, Newspaper, Briefcase, Moon, Map } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/news", icon: Newspaper, label: "News" },
  { path: "/jobs", icon: Briefcase, label: "Jobs" },
  { path: "/prayer", icon: Moon, label: "Prayer" },
  { path: "/qatar-metro", icon: Map, label: "Metro" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-200 z-50 pb-safe">
      <nav className="flex items-center justify-around px-2 h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;
          return (
            <a
              key={path}
              href={path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <div className={`relative p-1 rounded-full transition-all duration-300 ${isActive ? "bg-primary/10" : ""}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {label}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
