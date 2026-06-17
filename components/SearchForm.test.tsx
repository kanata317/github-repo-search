import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchForm } from "./SearchForm";

const push = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParamsValue,
}));

beforeEach(() => {
  push.mockClear();
  searchParamsValue = new URLSearchParams();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SearchForm", () => {
  it("URLのqパラメータが入力欄の初期値に反映される", () => {
    searchParamsValue = new URLSearchParams({ q: "react" });

    render(<SearchForm />);

    expect(screen.getByRole("textbox")).toHaveValue("react");
  });

  it("入力欄に文字を入力すると表示が更新される", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.type(screen.getByRole("textbox"), "next.js");

    expect(screen.getByRole("textbox")).toHaveValue("next.js");
  });

  it("検索ボタン押下時、入力値を含むURLへ遷移する", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(push).toHaveBeenCalledWith("/search?q=react");
  });

  it("入力値が空の場合、qパラメータなしのURLへ遷移する", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(push).toHaveBeenCalledWith("/search?");
  });

  it("submit時にデフォルトのフォーム送信が発生しない", async () => {
    const preventDefaultSpy = vi.spyOn(Event.prototype, "preventDefault");
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
