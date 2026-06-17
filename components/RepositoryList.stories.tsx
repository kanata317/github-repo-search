import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

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

const meta = {
  title: "Components/RepositoryList",
  component: RepositoryList,
} satisfies Meta<typeof RepositoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { repositories: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText("該当するリポジトリが見つかりませんでした。")
    ).toBeInTheDocument();
  },
};

export const WithRepositories: Story = {
  args: {
    repositories: [
      createRepository({ id: 1, fullName: "facebook/react" }),
      createRepository({ id: 2, fullName: "vuejs/vue" }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("link", { name: "facebook/react" })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: "vuejs/vue" })
    ).toBeInTheDocument();
  },
};
