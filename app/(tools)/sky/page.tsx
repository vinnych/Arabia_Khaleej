import type { Metadata } from "next";
import SkyScene from "./SkyScene";

export const metadata: Metadata = {
  title: "Doha Sky — Live Sun & Moon | Qatar Portal",
  description:
    "Real-time 3D sky scene for Doha, Qatar. Accurate sun and moon positions calculated from your system clock using astronomical algorithms.",
};

// Full-screen canvas — hide the site header on this page
export default function SkyPage() {
  return <SkyScene />;
}
