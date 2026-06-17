import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchPage from "./page";

vi.mock("@/components/SearchForm", () => ({
  SearchForm: () => null,
}));

const searchRepositories = vi.fn();

vi.mock("@/lib/github", () => ({
  searchRepositories: (...args: unknown[]) => searchRepositories(...args),
}));

describe("SearchPage", () => {
  it("qが指定されていない場合、検索結果の表示が出ない", async () => {
    const ui = await SearchPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(searchRepositories).not.toHaveBeenCalled();
    expect(screen.queryByText(/検索結果:/)).not.toBeInTheDocument();
  });

  it("qが指定されている場合、検索結果件数とリポジトリ一覧が表示される", async () => {
    searchRepositories.mockResolvedValueOnce({
      totalCount: 2,
      items: [
        { id: 1, fullName: "facebook/react" },
        { id: 2, fullName: "vuejs/vue" },
      ],
    });

    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react", page: "2" }),
    });
    render(ui);

    expect(searchRepositories).toHaveBeenCalledWith("react", 2);
    expect(screen.getByText("検索結果: 2件（page: 2）")).toBeInTheDocument();
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
    expect(screen.getByText("vuejs/vue")).toBeInTheDocument();
  });

  it("pageが省略されている場合、デフォルトで1が使われる", async () => {
    searchRepositories.mockResolvedValueOnce({ totalCount: 0, items: [] });

    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react" }),
    });
    render(ui);

    expect(searchRepositories).toHaveBeenCalledWith("react", 1);
  });
});
