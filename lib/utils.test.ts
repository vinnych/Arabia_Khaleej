import { expect, test, describe } from "bun:test";
import { toSlug } from "./utils";

describe("toSlug", () => {
  test("should convert basic title to kebab-case and add hash", () => {
    const title = "Hello World";
    const url = "https://example.com/hello-world";
    const slug = toSlug(title, url);
    expect(slug).toMatch(/^hello-world-[a-z0-9]{4}$/);
  });

  test("should handle special characters and extra spaces", () => {
    const title = "  Qatar's Fuel Prices @ 2024!!  ";
    const url = "https://example.com/qatar-fuel";
    const slug = toSlug(title, url);
    // Note: 's is replaced by s, not removed, because of [^a-z0-9\s-]
    expect(slug).toMatch(/^qatars-fuel-prices-2024-[a-z0-9]{4}$/);
  });

  test("should truncate long titles to 60 characters before adding hash", () => {
    const longTitle = "a".repeat(100);
    const url = "https://example.com/long";
    const slug = toSlug(longTitle, url);
    const base = slug.split("-").slice(0, -1).join("-");
    expect(base.length).toBeLessThanOrEqual(60);
    expect(base).toBe("a".repeat(60));
  });

  test("should remove trailing hyphens before adding hash", () => {
    const title = "Hello World - ";
    const url = "https://example.com/hello";
    const slug = toSlug(title, url);
    expect(slug).toMatch(/^hello-world-[a-z0-9]{4}$/);
  });

  test("should produce different hashes for different URLs with same title", () => {
    const title = "Same Title";
    const url1 = "https://example.com/a";
    const url2 = "https://google.com/a";
    const slug1 = toSlug(title, url1);
    const slug2 = toSlug(title, url2);
    expect(slug1).not.toBe(slug2);
    const hash1 = slug1.split("-").pop();
    const hash2 = slug2.split("-").pop();
    expect(hash1).not.toBe(hash2);
  });

  test("should produce same hash for same URL and title", () => {
    const title = "Same Title";
    const url = "https://example.com/1";
    const slug1 = toSlug(title, url);
    const slug2 = toSlug(title, url);
    expect(slug1).toBe(slug2);
  });

  test("should handle empty title gracefully (only hash)", () => {
    const title = "";
    const url = "https://example.com/empty";
    const slug = toSlug(title, url);
    expect(slug).toMatch(/^-[a-z0-9]{4}$/);
  });
});
