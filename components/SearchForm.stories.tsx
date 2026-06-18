import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getRouter } from "@storybook/nextjs-vite/navigation.mock";
import { expect, spyOn, userEvent, within } from "storybook/test";

import { SearchForm } from "./SearchForm";

const meta = {
  title: "Components/SearchForm",
  component: SearchForm,
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitialQuery: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react" },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("textbox")).toHaveValue("react");
  },
};

export const TypingUpdatesInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.type(input, "next.js");

    await expect(input).toHaveValue("next.js");
  },
};

export const SubmitNavigatesWithQuery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const router = getRouter();

    await userEvent.type(canvas.getByRole("textbox"), "react");
    await userEvent.click(canvas.getByRole("button", { name: "検索" }));

    await expect(router.push).toHaveBeenCalledWith("/search?q=react");
  },
};

export const SubmitWithEmptyQuery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const router = getRouter();

    await userEvent.click(canvas.getByRole("button", { name: "検索" }));

    await expect(router.push).toHaveBeenCalledWith("/search?");
  },
};

export const SubmitPreventsDefaultFormSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const preventDefaultSpy = spyOn(Event.prototype, "preventDefault");

    await userEvent.click(canvas.getByRole("button", { name: "検索" }));

    await expect(preventDefaultSpy).toHaveBeenCalled();
  },
};
