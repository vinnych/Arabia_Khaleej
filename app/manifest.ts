import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabia Khaleej — Independent Community Guide",
    short_name: "Arabia Khaleej",
    description:
      "Independent informational guide for the GCC region: accurate prayer times, country guides, and regional protocols.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#0f172a",
    icons: [
      { src: "/favicon-emblem.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
