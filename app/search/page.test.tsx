import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchPage from "./page";

vi.mock("@/components/SearchForm", () => ({
  SearchForm: () => null,
}));

describe("SearchPage", () => {
  it("qが指定されていない場合、検索クエリの表示が出ない", async () => {
    const ui = await SearchPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.queryByText(/検索クエリ:/)).not.toBeInTheDocument();
  });

  it("qが指定されている場合、検索クエリとpageが表示される", async () => {
    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react", page: "2" }),
    });
    render(ui);

    expect(
      screen.getByText("検索クエリ: react（page: 2）")
    ).toBeInTheDocument();
  });

  it("pageが省略されている場合、デフォルトで1が表示される", async () => {
    const ui = await SearchPage({
      searchParams: Promise.resolve({ q: "react" }),
    });
    render(ui);

    expect(
      screen.getByText("検索クエリ: react（page: 1）")
    ).toBeInTheDocument();
  });
});
