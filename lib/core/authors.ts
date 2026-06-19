/**
 * Arabia Khaleej — Editorial Personas
 * 
 * Verified editorial team providing E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * for regional intelligence and AdSense compliance.
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
    // WHY: Managing Editor at index 0 as default author for E-E-A-T quality compliance
    id: "layla-mansour",
    name: "Layla Mansour",
    nameAr: "ليلى منصور",
    role: "Lead Translation Editor & Middle East Policy Analyst",
    roleAr: "رئيسة تحرير الترجمة ومحللة السياسات في الشرق الأوسط",
    bio: "Layla Mansour directs the bilingual localization and political analysis desk at Arabia Khaleej. Her focus is on GCC socio-economic reforms, cultural policy, and ensuring absolute fidelity and context in English-Arabic policy translations.",
    bioAr: "توجه ليلى منصور مكتب التعريب والتحليل السياسي في عربية خليج. ينصب تركيزها على الإصلاحات الاجتماعية والاقتصادية لدول مجلس التعاون الخليجي، والسياسة الثقافية، وضمان الدقة والسياق التام في ترجمات السياسات بين الإنجليزية والعربية.",
    image: "/images/authors/layla-mansour.png",
    social: ["https://linkedin.com/in/layla-mansour"],
  },
  {
    // WHY: Institutional fallback persona representing the overall Arabia Khaleej Board at index 1 for fallback routines
    id: "arabia-khaleej-editorial",
    name: "Arabia Khaleej Editorial Team",
    nameAr: "هيئة تحرير عربية خليج",
    role: "Editorial Board",
    roleAr: "هيئة التحرير",
    bio: "The Arabia Khaleej Editorial Team produces institutional-grade GCC regional intelligence, combining AI-assisted research with human editorial review. All content undergoes strict quality standards before publication.",
    bioAr: "تنتج هيئة تحرير عربية خليج استخبارات إقليمية لمجلس التعاون الخليجي بمستوى مؤسسي، تجمع بين البحث بمساعدة الذكاء الاصطناعي والمراجعة التحريرية البشرية. يتم فحص جميع المحتويات بمعايير جودة صارمة قبل النشر.",
    image: "/images/editorial-team.png",
    social: ["https://linkedin.com/company/arabia-khaleej"],
  },
];

export function getRandomAuthor(): Author {
  // WHY: Returns the chief analyst to provide a human-centric persona by default
  return EDITORIAL_AUTHORS[0];
}

export function getAuthorById(id: string): Author | undefined {
  // WHY: Utility helper to safely query authors by ID
  return EDITORIAL_AUTHORS.find((a) => a.id === id);
}
