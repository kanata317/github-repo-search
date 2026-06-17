import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { RepositoryCard } from "./RepositoryCard";

const baseRepository = {
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

const meta = {
  title: "Components/RepositoryCard",
  component: RepositoryCard,
} satisfies Meta<typeof RepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDescriptionAndLanguage: Story = {
  args: { repository: baseRepository },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = await canvas.findByRole("link", { name: "facebook/react" });
    await expect(link).toHaveAttribute("href", baseRepository.htmlUrl);
    await expect(
      canvas.getByText(baseRepository.description)
    ).toBeInTheDocument();
    await expect(canvas.getByText("★ 12,345")).toBeInTheDocument();
    await expect(canvas.getByText("JavaScript")).toBeInTheDocument();
  },
};

export const WithoutDescriptionAndLanguage: Story = {
  args: {
    repository: { ...baseRepository, description: null, language: null },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByText(baseRepository.description)
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("JavaScript")).not.toBeInTheDocument();
  },
};
