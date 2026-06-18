import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

const push = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParamsValue,
}));

beforeEach(() => {
  push.mockClear();
  searchParamsValue = new URLSearchParams({ q: "react", page: "3" });
});

describe("Pagination", () => {
  it("totalPagesが1以下の場合、何も表示しない", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("先頭ページの場合、前へボタンが無効化される", () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByRole("button", { name: "前へ" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "次へ" })).toBeEnabled();
  });

  it("末尾ページの場合、次へボタンが無効化される", () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByRole("button", { name: "前へ" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "次へ" })).toBeDisabled();
  });

  it("現在のページ番号がaria-current=pageになる", () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "2" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("次へボタン押下時、qを保持しつつpageを+1したURLへ遷移する", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} />);

    await user.click(screen.getByRole("button", { name: "次へ" }));

    expect(push).toHaveBeenCalledWith("/search?q=react&page=4");
  });

  it("前へボタン押下時、qを保持しつつpageを-1したURLへ遷移する", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} />);

    await user.click(screen.getByRole("button", { name: "前へ" }));

    expect(push).toHaveBeenCalledWith("/search?q=react&page=2");
  });

  it("ページ番号ボタン押下時、そのページ番号のURLへ遷移する", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} />);

    await user.click(screen.getByRole("button", { name: "5" }));

    expect(push).toHaveBeenCalledWith("/search?q=react&page=5");
  });
});
