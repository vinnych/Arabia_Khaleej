import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qatar Portal — Prayer Times & Service Guides",
    short_name: "Qatar Portal",
    description:
      "Your daily Qatar resource: accurate prayer times for Doha, service guides, and essential public utilities.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#003fa4",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
