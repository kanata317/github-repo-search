import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMaxPage, searchRepositories } from "./github";

function mockFetchResponse(totalCount: number, itemCount = 0) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      total_count: totalCount,
      items: Array.from({ length: itemCount }, (_, i) => ({
        id: i,
        name: `repo-${i}`,
        full_name: `owner/repo-${i}`,
        html_url: `https://github.com/owner/repo-${i}`,
        description: null,
        stargazers_count: 0,
        language: null,
        owner: { login: "owner", avatar_url: "https://example.com/a.png" },
      })),
    }),
  };
}

describe("getMaxPage", () => {
  it("1000件 / per_pageで最大ページ数を算出する", () => {
    expect(getMaxPage(10)).toBe(100);
    expect(getMaxPage(30)).toBe(33);
  });
});

describe("searchRepositories", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("totalCountからtotalPagesを算出する", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockFetchResponse(95) as unknown as Response
    );

    const result = await searchRepositories("react", 1, 10);

    expect(result.totalPages).toBe(10);
  });

  it("totalPagesは1000件制約の最大ページ数を超えない", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockFetchResponse(5000) as unknown as Response
    );

    const result = await searchRepositories("react", 1, 10);

    expect(result.totalPages).toBe(100);
  });

  it("最大ページ数を超えるpageが指定された場合、最大ページ数にクランプして要求する", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(mockFetchResponse(5000) as unknown as Response);

    const result = await searchRepositories("react", 200, 10);

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain("page=100");
    expect(result.page).toBe(100);
  });

  it("APIがエラーを返した場合は例外をthrowする", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
    } as unknown as Response);

    await expect(searchRepositories("react", 1, 10)).rejects.toThrow(
      "status: 403"
    );
  });
});
