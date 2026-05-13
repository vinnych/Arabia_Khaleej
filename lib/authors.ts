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
    id: "arabia-khaleej-editorial",
    name: "Arabia Khaleej Editorial Team",
    nameAr: "هيئة تحرير عربية خليج",
    role: "Editorial Board",
    roleAr: "هيئة التحرير",
    bio: "The Arabia Khaleej Editorial Team produces institutional-grade GCC regional intelligence, combining AI-assisted research with human editorial review.",
    bioAr: "تنتج هيئة تحرير عربية خليج استخبارات إقليمية لمجلس التعاون الخليجي بمستوى مؤسسي، تجمع بين البحث بمساعدة الذكاء الاصطناعي والمراجعة التحريرية البشرية.",
    image: "/images/editorial-team.png",
    social: ["https://linkedin.com/company/arabia-khaleej"],
  },
];

export function getRandomAuthor(): Author {
  return EDITORIAL_AUTHORS[0];
}

export function getAuthorById(id: string): Author | undefined {
  return EDITORIAL_AUTHORS.find((a) => a.id === id);
}
