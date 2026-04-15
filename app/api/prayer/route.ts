import { NextRequest, NextResponse } from "next/server";
import { getPrayerTimes, getPrayerTimesByCoords } from "@/lib/prayer";
export async function GET(req: NextRequest) {
  const rawLat = req.nextUrl.searchParams.get("lat");
  const rawLng = req.nextUrl.searchParams.get("lng");
  const city = (req.nextUrl.searchParams.get("city") || "Doha").replace(/[^a-zA-Z\s\-]/g, "").slice(0, 60);
  const country = (req.nextUrl.searchParams.get("country") || "Qatar").replace(/[^a-zA-Z\s\-]/g, "").slice(0, 60);
  try {
    let times;
    if (rawLat && rawLng) {
      const lat = parseFloat(rawLat);
      const lng = parseFloat(rawLng);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
      }
      times = await getPrayerTimesByCoords(lat, lng);
    } else {
      times = await getPrayerTimes(city, country);
    }
    return NextResponse.json(times);
  } catch (err) {
    console.error("[api/prayer] error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 });
  }
}
