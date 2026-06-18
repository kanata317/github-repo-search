import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchPage from "./page";
import type { GithubRepository } from "@/lib/types";

vi.mock("@/components/SearchForm", () => ({
  SearchForm: () => null,
}));

vi.mock("@/components/RepositoryList", () => ({
  RepositoryList: ({ repositories }: { repositories: GithubRepository[] }) => (
    <div data-testid="repository-list">{repositories.length}件</div>
  ),
}));

vi.mock("@/components/Pagination", () => ({
  Pagination: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => (
    <div data-testid="pagination">
      {currentPage}/{totalPages}
    </div>
  ),
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

  it("qが指定されている場合、検索結果件数が表示されRepositoryList/Paginationに渡される", async () => {
    searchRepositories.mockResolvedValueOnce({
      totalCount: 2,
      page: 2,
      totalPages: 5,
      items: [{ id: 1 }, { id: 2 }],
    });

    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react", page: "2" }),
    });
    render(ui);

    expect(searchRepositories).toHaveBeenCalledWith("react", 2);
    expect(screen.getByText("検索結果: 2件（page: 2）")).toBeInTheDocument();
    expect(screen.getByTestId("repository-list")).toHaveTextContent("2件");
    expect(screen.getByTestId("pagination")).toHaveTextContent("2/5");
  });

  it("pageが省略されている場合、デフォルトで1が使われる", async () => {
    searchRepositories.mockResolvedValueOnce({
      totalCount: 0,
      page: 1,
      totalPages: 0,
      items: [],
    });

    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react" }),
    });
    render(ui);

    expect(searchRepositories).toHaveBeenCalledWith("react", 1);
  });
});
