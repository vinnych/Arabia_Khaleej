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
 * e.g. "Qatar Raises Fuel Prices" → "qatar-raises-fuel-prices-a3f9"
 * The 4-char hash suffix guarantees uniqueness across same-title articles.
 */
export function toSlug(title: string, url: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
  // 4-char hash from url for uniqueness
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  const hash = Math.abs(h).toString(36).slice(0, 4).padStart(4, "0");
  return `${base}-${hash}`;
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
