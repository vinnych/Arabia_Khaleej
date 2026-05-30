// Why explicit import is used: Imports the translation helper module to verify edge markdown translation,
// chunking, code block shielding, and linear retry/fallback strategies.
import { translateMarkdown } from "../translate";

describe("translateMarkdown", () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    // Why: Back up the original global fetch so we can safely restore it after all tests complete,
    // avoiding side effects for any other test suites.
    originalFetch = global.fetch;
  });

  afterAll(() => {
    // Why: Clean up global state by restoring original fetch.
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    // Why: Clear all mock histories before each individual test run to keep them fully hermetic.
    jest.resetAllMocks();
  });

  it("translates simple English markdown to Arabic successfully", async () => {
    // Why: Set up the mock fetch to resolve with Google Translate segment structure.
    // In Google's response: data[0] is an array of segments where segment[0] is the translated string.
    const mockResponse = [
      [
        ["مرحبا بالعالم", "Hello World"]
      ]
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await translateMarkdown("Hello World", "en", "ar");
    expect(result).toBe("مرحبا بالعالم");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("shields fenced code blocks from translation and restores them verbatim", async () => {
    // Why: We mock fetch to translate only the text segments.
    // The translator should replace code blocks with `[CODE_BLOCK_0]`, send only the text to the API,
    // and then swap the code block back in.
    global.fetch = jest.fn().mockImplementation(async (url: string) => {
      // Why: Decode URL to see if it translated the placeholder or actual text.
      const decodedUrl = decodeURIComponent(url);
      
      let responseContent = "";
      if (decodedUrl.includes("[CODE_BLOCK_0]")) {
        // Why: Mock translation that translates the placeholder along with surrounding text.
        responseContent = "هنا بعض الكود:\n[CODE_BLOCK_0]\nانتهى.";
      } else {
        responseContent = "ترجمة افتراضية";
      }

      return {
        ok: true,
        json: async () => [[ [responseContent, "original"] ]],
      };
    });

    const markdownInput = "Here is some code:\n```javascript\nconst a = 1;\nconsole.log(a);\n```\nDone.";
    const result = await translateMarkdown(markdownInput, "en", "ar");

    // Why: Verify the output contains the exact, unaltered fenced code block.
    expect(result).toContain("```javascript\nconst a = 1;\nconsole.log(a);\n```");
    expect(result).toContain("هنا بعض الكود:");
    expect(result).toContain("انتهى.");
  });

  it("splits large texts exceeding limits into multiple chunks and translates them sequentially", async () => {
    // Why: Setup lines to test chunk grouping. Each line will be added. 
    // We create 60 lines to trigger the >50 lines limit in translateMarkdown.
    const lines: string[] = [];
    for (let i = 1; i <= 60; i++) {
      lines.push(`Line number ${i}`);
    }
    const largeMarkdown = lines.join("\n");

    // Why: Mock fetch to return a translated chunk indicator so we can confirm multiple chunks are handled.
    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(async () => {
      callCount++;
      // Return custom translations based on which chunk is requested
      const translatedChunkText = `Translated Chunk ${callCount}`;
      return {
        ok: true,
        json: async () => [[ [translatedChunkText, "original"] ]],
      };
    });

    const result = await translateMarkdown(largeMarkdown, "en", "ar");

    // Why: Verify that 2 sequential calls were made (since 60 lines is split into 50 lines + 10 lines).
    expect(callCount).toBe(2);
    expect(result).toBe("Translated Chunk 1\nTranslated Chunk 2");
  });

  it("performs linear backoff retry on HTTP failure and falls back to original text on fatal failures", async () => {
    // Why: We temporarily mock console.warn to keep test runner output clean from warning alerts.
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    // Why: Mock fetch to fail continuously with 500 status code.
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as any);

    const input = "Persistent failure test";
    const result = await translateMarkdown(input, "en", "ar");

    // Why: It should attempt 3 calls (1 initial + 2 retries) before giving up and returning the original string.
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result).toBe(input);

    warnSpy.mockRestore();
  });
});
