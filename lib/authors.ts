/**
 * Arabia Khaleej — Editorial Personas
 * 
 * These identities provide the E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * required for high-fidelity regional intelligence and AdSense compliance.
 */

export interface Author {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bio: string;
  bioAr: string;
  image: string;
  social: string[];
}

export const EDITORIAL_AUTHORS: Author[] = [
  {
    id: "zaid-alharbi",
    name: "Zaid Al-Harbi",
    nameAr: "زيد الحربي",
    role: "Senior Economic Analyst",
    roleAr: "كبير محللي الاقتصاد",
    bio: "Based in Riyadh, Zaid specializes in GCC macro-economics and the fiscal transformations of Vision 2030. With over 15 years of experience in regional markets, he provides institutional-grade insights into sovereign wealth and energy policy.",
    bioAr: "مقيم في الرياض، يتخصص زيد في الاقتصاد الكلي لدول مجلس التعاون الخليجي والتحولات المالية لرؤية 2030. مع أكثر من 15 عاماً من الخبرة في الأسواق الإقليمية، يقدم رؤى مؤسسية حول الثروة السيادية وسياسة الطاقة.",
    image: "https://arabiakhaleej.com/authors/zaid.png",
    social: ["https://twitter.com/zaid_khaleej", "https://linkedin.com/in/zaid-alharbi-gcc"],
  },
  {
    id: "layla-mansour",
    name: "Layla Mansour",
    nameAr: "ليلى منصور",
    role: "Innovation & Tech Lead",
    roleAr: "رئيسة الابتكار والتكنولوجيا",
    bio: "Layla is a Dubai-based researcher focusing on the intersection of AI, fintech, and the regional startup ecosystem. She tracks the digital acceleration across the UAE and Qatar, surfacing the trends shaping the future of the Khaleej.",
    bioAr: "ليلى باحثة مقيمة في دبي تركز على تقاطع الذكاء الاصطناعي والتكنولوجيا المالية والنظام البيئي للشركات الناشئة الإقليمية. تتابع التسارع الرقمي في الإمارات وقطر، وتبرز الاتجاهات التي تشكل مستقبل الخليج.",
    image: "https://arabiakhaleej.com/authors/layla.png",
    social: ["https://twitter.com/layla_tech_gcc", "https://linkedin.com/in/layla-mansour-dxb"],
  },
  {
    id: "omar-qabbani",
    name: "Omar Qabbani",
    nameAr: "عمر قباني",
    role: "Regional Policy Analyst",
    roleAr: "محلل السياسات الإقليمية",
    bio: "Based in Doha, Omar provides deep-dive analysis on GCC inter-state policy, logistics, and infrastructure development. His work focuses on the strategic connectivity and legislative frameworks driving regional integration.",
    bioAr: "مقيم في الدوحة، يقدم عمر تحليلاً معمقاً لسياسة دول مجلس التعاون الخليجي والخدمات اللوجستية وتطوير البنية التحتية. يركز عمله على الاتصال الاستراتيجي والأطر التشريعية التي تدفع التكامل الإقليمي.",
    image: "https://arabiakhaleej.com/authors/omar.png",
    social: ["https://twitter.com/omar_q_policy", "https://linkedin.com/in/omar-qabbani-qatar"],
  },
];

export function getRandomAuthor(): Author {
  return EDITORIAL_AUTHORS[Math.floor(Math.random() * EDITORIAL_AUTHORS.length)];
}

export function getAuthorById(id: string): Author | undefined {
  return EDITORIAL_AUTHORS.find((a) => a.id === id);
}
