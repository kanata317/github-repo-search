import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getRouter } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, within } from "storybook/test";

import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react", page: "3" },
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole("navigation")).not.toBeInTheDocument();
  },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "前へ" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "次へ" })).toBeEnabled();
  },
};

export const LastPage: Story = {
  args: { currentPage: 5, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "前へ" })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: "次へ" })).toBeDisabled();
  },
};

export const MiddlePage: Story = {
  args: { currentPage: 3, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(
      canvas.getByRole("button", { name: "2" })
    ).not.toHaveAttribute("aria-current");
  },
};

export const NavigatesToNextPage: Story = {
  args: { currentPage: 3, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const router = getRouter();

    await userEvent.click(canvas.getByRole("button", { name: "次へ" }));

    await expect(router.push).toHaveBeenCalledWith("/search?q=react&page=4");
  },
};

export const NavigatesToPreviousPage: Story = {
  args: { currentPage: 3, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const router = getRouter();

    await userEvent.click(canvas.getByRole("button", { name: "前へ" }));

    await expect(router.push).toHaveBeenCalledWith("/search?q=react&page=2");
  },
};

export const NavigatesToSpecificPage: Story = {
  args: { currentPage: 3, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const router = getRouter();

    await userEvent.click(canvas.getByRole("button", { name: "5" }));

    await expect(router.push).toHaveBeenCalledWith("/search?q=react&page=5");
  },
};
