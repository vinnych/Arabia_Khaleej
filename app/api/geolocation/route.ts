import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const { success } = await rateLimit(ip, 30, 3600, 'geo');

  if (!success) {
    return NextResponse.json({ status: 'error', message: 'Too many requests' }, { status: 429 });
  }

  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const rawIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';
    
    // Validate IP format to prevent SSRF
    const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    const isValidIp = rawIp && (ipv4Regex.test(rawIp) || ipv6Regex.test(rawIp));
    
    // Block private/loopback IPs
    const privateIpRegex = /^(localhost|127\.|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|fe80:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;
    const isSafe = isValidIp && !privateIpRegex.test(rawIp);

    const url = isSafe
      ? `https://freeipapi.com/api/json/${encodeURIComponent(rawIp)}`
      : "https://freeipapi.com/api/json";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal
      });
      
      if (!res.ok) throw new Error("FreeIPAPI failed");
      
      const data = await res.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.warn("Geolocation fetch failed, returning default UAE fallback");
      return NextResponse.json({
        cityName: "Dubai",
        countryCode: "AE",
        countryName: "United Arab Emirates",
        latitude: 25.2048,
        longitude: 55.2708
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Geolocation route error:", error);
    return NextResponse.json({ 
      cityName: "Dubai", 
      countryCode: "AE",
      status: 'fallback' 
    });
  }
}
