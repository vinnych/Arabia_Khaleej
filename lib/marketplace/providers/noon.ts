import { AffiliateProduct, MarketplaceProvider } from "../types";

export class NoonProvider implements MarketplaceProvider {
  name = "Noon.com";

  private async generateToken(): Promise<string | null> {
    const keyId = process.env.NOON_KEY_ID;
    const privateKeyPem = process.env.NOON_PRIVATE_KEY;

    if (!keyId || !privateKeyPem) return null;

    try {
      const encode = (obj: object) =>
        btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      const now = Math.floor(Date.now() / 1000);
      const header = { alg: 'RS256', typ: 'JWT' };
      const payload = { iss: keyId, aud: 'noon-partners', iat: now, exp: now + 900 };
      const signingInput = `${encode(header)}.${encode(payload)}`;

      const pemContent = privateKeyPem
        .replace(/-----BEGIN.*?-----/g, '')
        .replace(/-----END.*?-----/g, '')
        .replace(/\s/g, '');

      const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

      const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        new TextEncoder().encode(signingInput)
      );

      const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      return `${signingInput}.${sigB64}`;
    } catch (error) {
      console.error("Noon JWT generation failed", error);
      return null;
    }
  }

  async getTrendingProducts(): Promise<AffiliateProduct[]> {
    const channelId = process.env.NOON_CHANNEL_ID;
    const token = await this.generateToken();

    if (!token || !channelId) {
      if (process.env.NODE_ENV === 'production') {
        console.error("CRITICAL: Noon credentials missing in PRODUCTION. Marketplace is using stale fallback data.");
      } else {
        console.warn("Noon credentials missing or invalid. Returning fallback data.");
      }
      return this.getFallbackData();
    }

    try {
      // Example endpoint for Noon Partners trending products
      // Note: Actual endpoint might vary based on their current API version
      const res = await fetch(`https://api.noon.partners/affiliate/v1/feed/trending?channel=${channelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`Noon API responded with ${res.status}`);

      const data = await res.json();
      
      // Map Noon API response to our common interface
      return data.items.map((item: any, index: number) => ({
        id: item.sku || `noon-${index}`,
        nameEn: item.name_en,
        nameAr: item.name_ar,
        descriptionEn: item.description_en || "",
        descriptionAr: item.description_ar || "",
        price: item.price?.amount || 0,
        currency: item.price?.currency || 'AED',
        category: item.category || 'general',
        image: item.images?.[0] || "",
        rating: item.rating || 4.5,
        reviews: item.review_count || 0,
        affiliateUrl: item.affiliate_url,
        retailer: "Noon.com",
        trendingRank: index + 1
      }));
    } catch (error) {
      console.error("Failed to fetch from Noon API", error);
      return this.getFallbackData();
    }
  }

  private getFallbackData(): AffiliateProduct[] {
    return [
      {
        id: 'noon-iphone-15-pro-max',
        nameEn: 'iPhone 15 Pro Max (256GB, Titanium)',
        nameAr: 'أيفون 15 برو ماكس (256 جيجابايت، تيتانيوم)',
        descriptionEn: 'The ultimate iPhone with aerospace-grade titanium design and A17 Pro chip.',
        descriptionAr: 'أقوى أيفون بتصميم من التيتانيوم وشريحة A17 برو.',
        price: 4699,
        currency: 'AED',
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        reviews: 1240,
        affiliateUrl: 'https://www.noon.com/uae-en/iphone-15-pro-max-256gb-natural-titanium-5g-with-facetime-international-specs/N53432431A/p/',
        retailer: 'Noon.com',
        isBestSeller: true,
        isTrending: true,
        trendingRank: 1
      },
      {
        id: 'noon-samsung-s24-ultra',
        nameEn: 'Samsung Galaxy S24 Ultra (512GB)',
        nameAr: 'سامسونج جالاكسي S24 ألترا (512 جيجابايت)',
        descriptionEn: 'The new era of mobile AI. Titanium exterior and 200MP camera.',
        descriptionAr: 'عصر جديد من الذكاء الاصطناعي للهواتف المحمولة. هيكل تيتانيوم وكاميرا 200 ميجابكسل.',
        price: 4299,
        currency: 'AED',
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
        rating: 4.8,
        reviews: 850,
        affiliateUrl: 'https://www.noon.com/uae-en/galaxy-s24-ultra-5g-dual-sim-titanium-gray-12gb-ram-512gb-storage-middle-east-version/N70035252A/p/',
        retailer: 'Noon.com',
        isBestSeller: true,
        isTrending: true,
        trendingRank: 2
      },
      {
        id: 'noon-dyson-v15',
        nameEn: 'Dyson V15 Detect Vacuum',
        nameAr: 'مكنسة دايسون V15 ديتكت',
        descriptionEn: 'The most powerful, intelligent cordless vacuum.',
        descriptionAr: 'المكنسة اللاسلكية الأكثر قوة وذكاءً.',
        price: 2899,
        currency: 'SAR',
        category: 'homeLifestyle',
        image: 'https://images.unsplash.com/photo-1558317374-067df5f1517d?auto=format&fit=crop&q=80&w=800',
        rating: 4.8,
        reviews: 850,
        affiliateUrl: 'https://www.noon.com/saudi-en/v15-detect-cordless-vacuum-cleaner/N51833543A/p/',
        retailer: 'Noon.com',
        trendingRank: 3
      },
      {
        id: 'noon-ps5-slim',
        nameEn: 'PlayStation 5 Slim Console',
        nameAr: 'منصة بلاي ستيشن 5 سليم',
        descriptionEn: 'Experience lightning-fast loading with an ultra-high speed SSD.',
        descriptionAr: 'استمتع بتحميل فائق السرعة مع محرك أقراص SSD فائق السرعة.',
        price: 1849,
        currency: 'AED',
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        reviews: 3200,
        affiliateUrl: 'https://www.noon.com/uae-en/playstation-5-console-slim/N70034421A/p/',
        retailer: 'Noon.com',
        isBestSeller: true,
        trendingRank: 4
      }
    ];
  }
}
