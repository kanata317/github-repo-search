import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { ErrorMessage } from "./ErrorMessage";

const meta = {
  title: "Components/ErrorMessage",
  component: ErrorMessage,
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRetry: Story = {
  args: {
    message: "GitHub Search APIの呼び出しに失敗しました (status: 500)",
    onRetry: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(args.message)).toBeInTheDocument();

    const retryButton = canvas.getByRole("button", { name: "再試行" });
    await userEvent.click(retryButton);

    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const WithoutRetry: Story = {
  args: {
    message: "GitHub Search APIの呼び出しに失敗しました (status: 500)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("button", { name: "再試行" })
    ).not.toBeInTheDocument();
  },
};
