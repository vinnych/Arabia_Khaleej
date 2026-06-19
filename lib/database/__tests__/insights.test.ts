// Why explicit import is used: Imports SOLID Read-side Service components, Validators,
// Processors, and Facades to verify robust validation, sorting, filtering, and fuzzy fallback mechanisms.
import {
  StandardInsightValidator,
  DeduplicateProcessor,
  SortByDateDescendingProcessor,
  CategoryFilterProcessor,
  InsightService,
  getUnifiedInsights,
  getArticleBySlug,
  getAllInsightSlugs,
} from "../../services/insightService";
import { IInsightRepository } from "../repositories/insightRepository";
import { InsightItem } from "../../types/insight";
import { getWithCompression } from "../redis";

// Why we mock the Redis module: Prevents real network hits to Upstash Redis REST endpoints
// during local testing, enabling clean offline unit testing with high deterministic guarantees.
jest.mock("../redis", () => {
  return {
    redis: {
      get: jest.fn(),
      set: jest.fn(),
    },
    getWithCompression: jest.fn(),
  };
});

// Why MockInsightRepository is created: Implements IInsightRepository following the
// Dependency Inversion Principle (DIP). Allows testing the InsightService engine in absolute
// isolation from Upstash Redis or any specific database client.
class MockInsightRepository implements IInsightRepository {
  public mockInsightsList: InsightItem[] = [];
  public mockArticles: Record<string, InsightItem> = {};

  async getRawInsights(lang: "en" | "ar"): Promise<InsightItem[]> {
    return this.mockInsightsList.filter((item) => item.language === lang);
  }

  async getRawArticle(slug: string): Promise<InsightItem | null> {
    return this.mockArticles[slug] || null;
  }

  async saveArticle(article: any): Promise<void> {
    this.mockArticles[article.slug] = article;
    const index = this.mockInsightsList.findIndex(item => item.slug === article.slug);
    if (index > -1) {
      this.mockInsightsList[index] = article;
    } else {
      this.mockInsightsList.push(article);
    }
  }

  async deleteArticle(slug: string): Promise<void> {
    delete this.mockArticles[slug];
    this.mockInsightsList = this.mockInsightsList.filter(item => item.slug !== slug);
  }
}

describe("StandardInsightValidator", () => {
  let validator: StandardInsightValidator;

  beforeEach(() => {
    validator = new StandardInsightValidator();
  });

  it("validates valid published articles correctly", () => {
    const validArticle: InsightItem = {
      id: "1",
      slug: "valid-slug",
      title: "Valid Title",
      description: "Valid Description",
      link: "/insights/valid-slug",
      pubDate: "2026-05-30T10:00:00Z",
      source: "Arabia Khaleej",
      category: "gcc",
      language: "en",
    };
    expect(validator.isValid(validArticle)).toBe(true);
  });

  it("rejects draft articles", () => {
    const draftArticle: InsightItem = {
      id: "1",
      slug: "draft-slug",
      title: "Draft Title",
      description: "Draft Description",
      link: "/insights/draft-slug",
      pubDate: "2026-05-30T10:00:00Z",
      source: "Arabia Khaleej",
      category: "gcc",
      language: "en",
      status: "draft",
    };
    expect(validator.isValid(draftArticle)).toBe(false);
  });

  it("rejects articles with missing slug or title", () => {
    const missingTitle: any = {
      id: "1",
      slug: "valid-slug",
      pubDate: "2026-05-30T10:00:00Z",
    };
    const missingSlug: any = {
      id: "1",
      title: "Valid Title",
      pubDate: "2026-05-30T10:00:00Z",
    };
    expect(validator.isValid(missingTitle)).toBe(false);
    expect(validator.isValid(missingSlug)).toBe(false);
  });

  it("rejects articles with invalid or missing publication date", () => {
    const missingDate: any = {
      id: "1",
      slug: "valid-slug",
      title: "Valid Title",
    };
    const invalidDate: any = {
      id: "1",
      slug: "valid-slug",
      title: "Valid Title",
      pubDate: "not-a-valid-date-string",
    };
    expect(validator.isValid(missingDate)).toBe(false);
    expect(validator.isValid(invalidDate)).toBe(false);
  });
});

describe("DeduplicateProcessor", () => {
  it("removes duplicate articles based on lowercase slug representation", () => {
    const items: InsightItem[] = [
      { id: "1", slug: "slug-a", title: "Title A", description: "", link: "", pubDate: "2026-05-30", source: "", category: "gcc", language: "en" },
      { id: "2", slug: "SLUG-A", title: "Title A Capitalized", description: "", link: "", pubDate: "2026-05-30", source: "", category: "gcc", language: "en" },
      { id: "3", slug: "slug-b", title: "Title B", description: "", link: "", pubDate: "2026-05-30", source: "", category: "gcc", language: "en" },
    ];
    const processor = new DeduplicateProcessor();
    const result = processor.process(items);

    expect(result.length).toBe(2);
    // Why: Ensure the last duplicate seen takes precedence as a standard Map behavior.
    expect(result.map(r => r.id)).toEqual(["2", "3"]);
  });
});

describe("SortByDateDescendingProcessor", () => {
  it("sorts articles chronologically in descending order", () => {
    const items: InsightItem[] = [
      { id: "1", slug: "slug-1", title: "1", description: "", link: "", pubDate: "2026-05-28T10:00:00Z", source: "", category: "gcc", language: "en" },
      { id: "2", slug: "slug-2", title: "2", description: "", link: "", pubDate: "2026-05-30T10:00:00Z", source: "", category: "gcc", language: "en" },
      { id: "3", slug: "slug-3", title: "3", description: "", link: "", pubDate: "2026-05-29T10:00:00Z", source: "", category: "gcc", language: "en" },
    ];
    const processor = new SortByDateDescendingProcessor();
    const result = processor.process(items);

    expect(result.map(r => r.id)).toEqual(["2", "3", "1"]);
  });
});

describe("CategoryFilterProcessor", () => {
  const items: InsightItem[] = [
    { id: "1", slug: "slug-1", title: "Dubai real estate booming", description: "Real estate in the UAE", link: "", pubDate: "2026-05-30", source: "", category: "gcc", language: "en", tags: ["Real Estate"] },
    { id: "2", slug: "slug-2", title: "Expat taxes in GCC", description: "Tax policies for workers", link: "", pubDate: "2026-05-30", source: "", category: "expat", language: "en", tags: ["Tax", "Expat"] },
    { id: "3", slug: "slug-3", title: "Oman economy", description: "Muscat investment updates", link: "", pubDate: "2026-05-30", source: "", category: "gcc", language: "en", tags: ["Economy"] },
  ];

  it("filters articles by matching tag list entries case-insensitively", () => {
    const processor = new CategoryFilterProcessor("Tax");
    const result = processor.process(items);
    expect(result.map(r => r.id)).toEqual(["2"]);
  });

  it("filters articles by matching title content", () => {
    const processor = new CategoryFilterProcessor("estate");
    const result = processor.process(items);
    expect(result.map(r => r.id)).toEqual(["1"]);
  });

  it("returns all articles verbatim if no category filter is specified", () => {
    const processor = new CategoryFilterProcessor(null);
    const result = processor.process(items);
    expect(result.length).toBe(3);
  });
});

describe("InsightService & Fuzzy Slug Fallback", () => {
  let mockRepo: MockInsightRepository;
  let service: InsightService;

  beforeEach(() => {
    mockRepo = new MockInsightRepository();
    const validator = new StandardInsightValidator();
    // Why: Set up basic processor pipeline to verify integration inside InsightService.
    const processors = [new DeduplicateProcessor(), new SortByDateDescendingProcessor()];
    service = new InsightService(mockRepo, validator, processors);
  });

  it("filters out invalid articles and processes valid ones chronologically", async () => {
    mockRepo.mockInsightsList = [
      { id: "1", slug: "slug-1", title: "Title 1", description: "", link: "", pubDate: "2026-05-28T10:00:00Z", source: "", category: "gcc", language: "en" },
      { id: "2", slug: "slug-2", title: "Title 2", description: "", link: "", pubDate: "2026-05-30T10:00:00Z", source: "", category: "gcc", language: "en", status: "draft" }, // Invalid: draft
      { id: "3", slug: "slug-3", title: "Title 3", description: "", link: "", pubDate: "2026-05-29T10:00:00Z", source: "", category: "gcc", language: "en" },
    ];

    const result = await service.getInsights("en");
    expect(result.map(r => r.id)).toEqual(["3", "1"]);
  });

  it("resolves single articles by exact slug match", async () => {
    const targetArticle: InsightItem = {
      id: "1",
      slug: "target-slug",
      title: "Target Article",
      description: "",
      link: "",
      pubDate: "2026-05-30T10:00:00Z",
      source: "",
      category: "gcc",
      language: "en",
    };
    mockRepo.mockArticles["target-slug"] = targetArticle;

    const result = await service.getArticle("target-slug", "en");
    expect(result?.id).toBe("1");
  });

  it("falls back to fuzzy matching using base slug comparison when variant slug is requested", async () => {
    // Why: If user requests "dubai-taxes-2" and it doesn't exist directly in the database,
    // the system should perform fuzzy base comparison against the insights list to find "dubai-taxes"
    // and successfully return it as a resilient fallback.
    const parentArticle: InsightItem = {
      id: "parent",
      slug: "dubai-taxes",
      title: "Dubai Taxes",
      description: "",
      link: "",
      pubDate: "2026-05-30T10:00:00Z",
      source: "",
      category: "gcc",
      language: "en",
      content: "Bilingual content snippet",
    };

    mockRepo.mockInsightsList = [parentArticle];
    // Why: Do not register "dubai-taxes-2" in mockRepo.mockArticles to trigger the list fuzzy fallback search.
    mockRepo.mockArticles["dubai-taxes"] = parentArticle;

    const result = await service.getArticle("dubai-taxes-2", "en");
    expect(result?.id).toBe("parent");
    expect(result?.slug).toBe("dubai-taxes");
  });
});

describe("Facade API Helpers", () => {
  const mockGetWithComp = getWithCompression as jest.Mock;

  beforeEach(() => {
    mockGetWithComp.mockReset();
  });

  it("getUnifiedInsights fetches and flattens bilingual lists correctly", async () => {
    const bilingualMock = [
      {
        id: "1",
        slug: "bilingual-1",
        title: { en: "English Title", ar: "العنوان العربي" },
        description: { en: "English Desc", ar: "الوصف العربي" },
        pubDate: "2026-05-30T10:00:00Z",
        source: "Arabia Khaleej",
        category: "gcc",
        language: "regional",
      },
    ];
    mockGetWithComp.mockResolvedValue(bilingualMock);

    const enResult = await getUnifiedInsights({ lang: "en" });
    expect(enResult[0].title).toBe("English Title");
    expect(enResult[0].description).toBe("English Desc");

    const arResult = await getUnifiedInsights({ lang: "ar" });
    expect(arResult[0].title).toBe("العنوان العربي");
    expect(arResult[0].description).toBe("الوصف العربي");
  });

  it("getArticleBySlug retrieves a single article by its slug", async () => {
    const singleMock = {
      id: "1",
      slug: "some-article",
      title: "Direct Title",
      description: "Direct Desc",
      pubDate: "2026-05-30T10:00:00Z",
      source: "Arabia Khaleej",
      category: "gcc",
      language: "en",
    };
    mockGetWithComp.mockResolvedValue(singleMock);

    const result = await getArticleBySlug("some-article", "en");
    expect(result?.title).toBe("Direct Title");
    expect(mockGetWithComp).toHaveBeenCalledWith("insights:article:some-article");
  });

  it("getAllInsightSlugs generates list of all static slugs", async () => {
    const mockEnList = [
      { id: "1", slug: "slug-en", title: "EN Title", pubDate: "2026-05-30T10:00:00Z", source: "", category: "gcc", language: "en" }
    ];
    const mockArList = [
      { id: "2", slug: "slug-ar", title: "AR Title", pubDate: "2026-05-30T10:00:00Z", source: "", category: "gcc", language: "ar" }
    ];

    // Why: Mocking two successive calls of getWithCompression inside getAllInsightSlugs
    mockGetWithComp
      .mockResolvedValueOnce(mockEnList)  // For en listing
      .mockResolvedValueOnce(mockArList); // For ar listing

    const result = await getAllInsightSlugs();
    expect(result).toEqual([
      { slug: "slug-en", lang: "en", pubDate: "2026-05-30T10:00:00Z" },
      { slug: "slug-ar", lang: "ar", pubDate: "2026-05-30T10:00:00Z" },
    ]);
  });
});
