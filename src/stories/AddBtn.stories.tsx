import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import AddBtn from "../components/Atoms/AddBtn";

const meta = {
    title: "Atoms/AddBtn",
    component: AddBtn,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: {
            action: "clicked",
            description: "Click handler function",
        },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof AddBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

