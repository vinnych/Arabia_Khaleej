export interface AffiliateProduct {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  affiliateUrl: string;
  retailer: string;
  trendingRank?: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface MarketplaceProvider {
  name: string;
  getTrendingProducts(): Promise<AffiliateProduct[]>;
}
