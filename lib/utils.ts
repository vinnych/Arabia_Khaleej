import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Converts a title + url into a readable SEO slug.
 * Supports both English and Arabic characters.
 * e.g. "Qatar Raises Fuel Prices" → "qatar-raises-fuel-prices-a3f9"
 * The hash suffix guarantees uniqueness across same-title articles.
 */
export function toSlug(title: string, url: string): string {
  const base = title
    .toLowerCase()
    // Keep Arabic characters (\u0600-\u06FF), English alphanumeric, spaces and dashes
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .replace(/-+$/, "");
    
  // If base resulted in nothing (e.g. only symbols), use "news"
  const slugBase = base || "news";
  
  // 6-char hash from url for strong uniqueness in large archives
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  const hash = Math.abs(h).toString(36).slice(0, 6).padStart(6, "0");
  
  return `${slugBase}-${hash}`;
}

/**
 * Parses any date string (RSS, Aladhan .readable, ISO, etc.) into parts.
 * Returns { day, mon, year, display } or null if unparseable.
 */
export function parseDate(raw: string | undefined | null): { day: string; mon: string; year: string; display: string } | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  const day = d.getDate().toString();
  const mon = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const year = d.getFullYear().toString();
  return { day, mon, year, display: `${day} ${mon} ${year}` };
}

/** Escapes </script> in JSON-LD strings to prevent XSS */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

const SSRF_DENYLIST = /^(localhost|127\.|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|\[::1\]|fe80:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

/** Like isValidHttpUrl but also blocks private/loopback IPs to prevent SSRF */
export function isSafeExternalUrl(str: string): boolean {
  if (!isValidHttpUrl(str)) return false;
  try {
    const { hostname, protocol } = new URL(str);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (SSRF_DENYLIST.test(hostname)) return false;
    return true;
  } catch { return false; }
}
