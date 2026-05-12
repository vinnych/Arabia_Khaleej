import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/redis';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  // Use Cloudflare's connecting IP or fallback to x-forwarded-for
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const { success } = await rateLimit(ip, 30, 3600, 'geo');

  if (!success) {
    return NextResponse.json({ status: 'error', message: 'Too many requests' }, { status: 429 });
  }

  // 1. Try Cloudflare Edge Headers (Highest Reliability in Production)
  const cfCity = req.headers.get('cf-city');
  const cfCountry = req.headers.get('cf-ipcountry');
  const cfLat = req.headers.get('cf-latitude');
  const cfLon = req.headers.get('cf-longitude');

  if (cfCity && cfCountry) {
    return NextResponse.json({
      cityName: cfCity,
      countryCode: cfCountry,
      // For UAE, we provide the full name for consistency with components
      countryName: cfCountry === 'AE' ? 'United Arab Emirates' : cfCountry,
      latitude: cfLat ? parseFloat(cfLat) : 25.2048,
      longitude: cfLon ? parseFloat(cfLon) : 55.2708,
      status: 'success',
      source: 'edge'
    });
  }

  // 2. Fallback to IP-based Geolocation (Development or if headers missing)
  try {
    const rawIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '';
    
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
      return NextResponse.json({ ...data, source: 'api' });
    } catch (fetchError) {
      console.warn("Geolocation fetch failed, returning default UAE fallback");
      return NextResponse.json({
        cityName: "Dubai",
        countryCode: "AE",
        countryName: "United Arab Emirates",
        latitude: 25.2048,
        longitude: 55.2708,
        status: 'fallback',
        source: 'default'
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Geolocation route error:", error);
    return NextResponse.json({ 
      cityName: "Dubai", 
      countryCode: "AE",
      status: 'error-fallback',
      source: 'default'
    });
  }
}



