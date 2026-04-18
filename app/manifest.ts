import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabia Khaleej — The GCC Standard",
    short_name: "Arabia Khaleej",
    description:
      "The definitive regional reference for the GCC: accurate prayer times, country insights, and protocols.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#0f172a",
    icons: [
      { src: "/favicon-emblem.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
