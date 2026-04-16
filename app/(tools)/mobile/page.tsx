import { pageMeta } from "@/lib/seo";
import MobileDashboardClient from "./MobileDashboardClient";

export const metadata = pageMeta({
  title: "Qatar Concierge Hub — Prayer, Rates & Services | Qatar Portal",
  description:
    "Your mobile dashboard for Qatar essentials: next prayer time, QAR exchange rate, visa guides, labour law, and public service directories — all in one place.",
  path: "/mobile",
  keywords: ["Qatar mobile dashboard", "Doha prayer times", "QAR exchange rate", "Qatar expat hub", "Qatar services mobile"],
});

export default function MobileDashboardPage() {
  return <MobileDashboardClient />;
}
