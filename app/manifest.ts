import type { MetadataRoute } from "next";


export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabia Khaleej — The GCC Standard",
    short_name: "Arabia Khaleej",
    description:
      "The definitive regional reference for the GCC: accurate prayer times, country insights, and protocols.",
    start_url: "/en/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#0f172a",
    icons: [
      { src: "/favicon-emblem.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon-emblem.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-emblem.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      {
        name: "Prayer Times",
        url: "/en/prayer",
        description: "GCC Prayer Schedules",
      },
      {
        name: "Currency Exchange",
        url: "/en/currency-exchange",
        description: "Live Currency Rates",
      }
    ]
  };
}
