import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RepositoryList } from "./RepositoryList";
import type { GithubRepository } from "@/lib/types";

function createRepository(
  overrides: Partial<GithubRepository>
): GithubRepository {
  return {
    id: 1,
    name: "react",
    fullName: "facebook/react",
    htmlUrl: "https://github.com/facebook/react",
    description: null,
    stargazersCount: 0,
    language: null,
    ownerLogin: "facebook",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/69631",
    ...overrides,
  };
}

describe("RepositoryList", () => {
  it("リポジトリが0件の場合、空状態メッセージが表示される", () => {
    render(<RepositoryList repositories={[]} />);

    expect(
      screen.getByText("該当するリポジトリが見つかりませんでした。")
    ).toBeInTheDocument();
  });

  it("リポジトリがある場合、件数分のRepositoryCardが表示される", () => {
    const repositories = [
      createRepository({ id: 1, fullName: "facebook/react" }),
      createRepository({ id: 2, fullName: "vuejs/vue" }),
    ];

    render(<RepositoryList repositories={repositories} />);

    expect(
      screen.getByRole("link", { name: "facebook/react" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "vuejs/vue" })
    ).toBeInTheDocument();
  });
});
