import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RepositoryCard } from "./RepositoryCard";
import type { GithubRepository } from "@/lib/types";

const baseRepository: GithubRepository = {
  id: 1,
  name: "react",
  fullName: "facebook/react",
  htmlUrl: "https://github.com/facebook/react",
  description: "A declarative, efficient, and flexible JavaScript library.",
  stargazersCount: 12345,
  language: "JavaScript",
  ownerLogin: "facebook",
  ownerAvatarUrl: "https://avatars.githubusercontent.com/u/69631",
};

describe("RepositoryCard", () => {
  it("リポジトリ名がhtmlUrlへのリンクとして表示される", () => {
    render(<RepositoryCard repository={baseRepository} />);

    const link = screen.getByRole("link", { name: "facebook/react" });
    expect(link).toHaveAttribute("href", baseRepository.htmlUrl);
  });

  it("description, stars, languageが表示される", () => {
    render(<RepositoryCard repository={baseRepository} />);

    expect(screen.getByText(baseRepository.description!)).toBeInTheDocument();
    expect(screen.getByText("★ 12,345")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("descriptionとlanguageがnullの場合は表示されない", () => {
    render(
      <RepositoryCard
        repository={{ ...baseRepository, description: null, language: null }}
      />
    );

    expect(
      screen.queryByText(baseRepository.description!)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
  });
});
