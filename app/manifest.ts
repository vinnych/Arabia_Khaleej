import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabia Khaleej — Elite GCC Digital Concierge",
    short_name: "Arabia Khaleej",
    description:
      "The definitive digital concierge for the GCC: accurate prayer times, country guides, and regional protocols.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#0f172a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
