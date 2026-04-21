export const PREMIUM_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', // Dubai
  'https://images.unsplash.com/photo-1590059397633-875f68480356?q=80&w=800&auto=format&fit=crop', // Doha
  'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop', // Riyadh
  'https://images.unsplash.com/photo-1549944850-84e00be4203b?q=80&w=800&auto=format&fit=crop', // Bahrain
  'https://images.unsplash.com/photo-1578330132822-01869bb9c1a1?q=80&w=800&auto=format&fit=crop', // Oman
  'https://images.unsplash.com/photo-1524492707947-28a0ff99d1f3?q=80&w=800&auto=format&fit=crop', // India
  'https://images.unsplash.com/photo-1527359443443-84a18a1a7410?q=80&w=800&auto=format&fit=crop', // Pakistan
  'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=800&auto=format&fit=crop', // Bangladesh
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800&auto=format&fit=crop', // Philippines
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop', // Newsstand
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop', // Corporate Building
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop', // Global News
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop', // Finance
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', // Tech Network
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=800&auto=format&fit=crop', // Modern architecture
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop', // Business Desk
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', // Data/Analytics
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop', // Data/Network
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', // Legal/Diplomacy
  'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=800&auto=format&fit=crop', // Global mapping
];

export const getDeterministicFallback = (slug: string): string => {
  if (!slug) return PREMIUM_FALLBACK_IMAGES[0];
  const index = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % PREMIUM_FALLBACK_IMAGES.length;
  return PREMIUM_FALLBACK_IMAGES[index];
};
