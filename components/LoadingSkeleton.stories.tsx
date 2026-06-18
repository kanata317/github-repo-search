import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { LoadingSkeleton } from "./LoadingSkeleton";

const meta = {
  title: "Components/LoadingSkeleton",
  component: LoadingSkeleton,
} satisfies Meta<typeof LoadingSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
  },
};

export const Few: Story = {
  args: { count: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
  },
};
