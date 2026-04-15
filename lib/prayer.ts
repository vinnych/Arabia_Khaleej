export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string;
  hijriDate: string;
  hijriMonth: string;
  hijriYear: string;
}

export interface PrayerDay {
  date: string;
  hijriDate: string;
  dayOfWeek: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface AladhanDate {
  readable: string;
  hijri: {
    day: string;
    month: { en: string };
    year: string;
  };
  gregorian: {
    weekday: { en: string };
  };
}

interface AladhanDayData {
  timings: AladhanTimings;
  date: AladhanDate;
}

interface AladhanResponse<T> {
  data: T;
}

export async function getPrayerTimes(city = "Doha", country = "Qatar"): Promise<PrayerTimes> {
  const res = await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`,
    { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error("Failed to fetch prayer times");
  const data: AladhanResponse<AladhanDayData> = await res.json();
  if (!data?.data?.timings || !data?.data?.date?.hijri) {
    throw new Error("Unexpected prayer times API response shape");
  }
  const t = data.data.timings;
  const h = data.data.date.hijri;
  const result: PrayerTimes = {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
    date: data.data.date.readable,
    hijriDate: h.day,
    hijriMonth: h.month.en,
    hijriYear: h.year,
  };
  return result;
}

export async function getPrayerTimesByCoords(lat: number, lng: number): Promise<PrayerTimes> {
  const res = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`,
    { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error("Failed to fetch prayer times by coordinates");
  const data: AladhanResponse<AladhanDayData> = await res.json();
  if (!data?.data?.timings || !data?.data?.date?.hijri) {
    throw new Error("Unexpected prayer times API response shape");
  }
  const t = data.data.timings;
  const h = data.data.date.hijri;
  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
    date: data.data.date.readable,
    hijriDate: h.day,
    hijriMonth: h.month.en,
    hijriYear: h.year,
  };
}

export async function getMonthlyPrayerTimesByCoords(year: number, month: number, lat: number, lng: number): Promise<PrayerDay[]> {
  const res = await fetch(
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=2`,
    { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error("Failed to fetch monthly prayer times by coordinates");
  const data: AladhanResponse<AladhanDayData[]> = await res.json();
  if (!Array.isArray(data?.data)) {
    throw new Error("Unexpected monthly prayer API response shape");
  }
  return data.data.map((day: AladhanDayData) => {
    const strip = (s: string) => s.replace(/ \([^)]*\)$/, "");
    return {
      date: day.date.readable,
      hijriDate: `${day.date.hijri.day} ${day.date.hijri.month.en}`,
      dayOfWeek: day.date.gregorian.weekday.en,
      Fajr: strip(day.timings.Fajr),
      Sunrise: strip(day.timings.Sunrise),
      Dhuhr: strip(day.timings.Dhuhr),
      Asr: strip(day.timings.Asr),
      Maghrib: strip(day.timings.Maghrib),
      Isha: strip(day.timings.Isha),
    };
  });
}

export async function getMonthlyPrayerTimes(year: number, month: number, city = "Doha", country = "Qatar"): Promise<PrayerDay[]> {
  const res = await fetch(
    `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`,
    { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error("Failed to fetch monthly prayer times");
  const data: AladhanResponse<AladhanDayData[]> = await res.json();
  if (!Array.isArray(data?.data)) {
    throw new Error("Unexpected monthly prayer API response shape");
  }
  const result = data.data.map((day: AladhanDayData) => {
    const strip = (s: string) => s.replace(/ \([^)]*\)$/, "");
    return {
      date: day.date.readable,
      hijriDate: `${day.date.hijri.day} ${day.date.hijri.month.en}`,
      dayOfWeek: day.date.gregorian.weekday.en,
      Fajr: strip(day.timings.Fajr),
      Sunrise: strip(day.timings.Sunrise),
      Dhuhr: strip(day.timings.Dhuhr),
      Asr: strip(day.timings.Asr),
      Maghrib: strip(day.timings.Maghrib),
      Isha: strip(day.timings.Isha),
    };
  });
  return result;
}
