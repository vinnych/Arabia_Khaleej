import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qatar Portal — Prayer Times, Jobs & News",
    short_name: "Qatar Portal",
    description:
      "Your daily Qatar resource: accurate prayer times for Doha, latest job listings, and top Gulf news headlines.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#003fa4",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
