import { NextRequest, NextResponse } from "next/server";
import { getMonthlyPrayerTimes, getMonthlyPrayerTimesByCoords } from "@/lib/prayer";
export async function GET(req: NextRequest) {
  const rawLat = req.nextUrl.searchParams.get("lat");
  const rawLng = req.nextUrl.searchParams.get("lng");
  const city = (req.nextUrl.searchParams.get("city") || "Doha").replace(/[^a-zA-Z\s\-]/g, "").slice(0, 60);
  const country = (req.nextUrl.searchParams.get("country") || "Qatar").replace(/[^a-zA-Z\s\-]/g, "").slice(0, 60);
  const now = new Date();
  const year = parseInt(req.nextUrl.searchParams.get("year") || String(now.getFullYear()), 10);
  const month = parseInt(req.nextUrl.searchParams.get("month") || String(now.getMonth() + 1), 10);
  if (isNaN(year) || isNaN(month) || year < 1900 || year > 2100 || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }
  try {
    let calendar;
    if (rawLat && rawLng) {
      const lat = parseFloat(rawLat);
      const lng = parseFloat(rawLng);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
      }
      calendar = await getMonthlyPrayerTimesByCoords(year, month, lat, lng);
    } else {
      calendar = await getMonthlyPrayerTimes(year, month, city, country);
    }
    return NextResponse.json(calendar);
  } catch (err) {
    console.error("[api/prayer/monthly] error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to fetch monthly prayer times" }, { status: 500 });
  }
}
