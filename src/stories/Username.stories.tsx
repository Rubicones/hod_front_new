import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Username from "../components/Atoms/Username";

const meta = {
    title: "Atoms/Username",
    component: Username,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        characterName: {
            control: "text",
            description: "The character's name",
        },
        userName: {
            control: "text",
            description: "The player's username",
        },
        variant: {
            control: "select",
            options: ["light", "dark"],
            description: "Visual variant - light (horizontal) or dark (vertical)",
        },
    },
    args: {
        characterName: "Торин",
        userName: "Player123",
        variant: "dark",
    },
} satisfies Meta<typeof Username>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dark variant (default - vertical layout)
export const Dark: Story = {
    args: {
        characterName: "Торин",
        userName: "Player123",
        variant: "dark",
    },
};

// Light variant (horizontal layout)
export const Light: Story = {
    args: {
        characterName: "Торин",
        userName: "Player123",
        variant: "light",
    },
};

// Long names - Dark
export const LongNamesDark: Story = {
    args: {
        characterName: "Бальтазар Великолепный",
        userName: "SuperDungeonMaster2024",
        variant: "dark",
    },
};

// Long names - Light
export const LongNamesLight: Story = {
    args: {
        characterName: "Бальтазар Великолепный",
        userName: "SuperDungeonMaster2024",
        variant: "light",
    },
};

// Short names
export const ShortNames: Story = {
    args: {
        characterName: "Грок",
        userName: "Bob",
        variant: "dark",
    },
};

// Variant comparison
export const VariantComparison: Story = {
    args: {
        characterName: "Торин",
        userName: "Player123",
        variant: "dark",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-silvery-barbs text-xs mb-2">Dark (Vertical)</p>
                <Username characterName="Торин" userName="Player123" variant="dark" />
            </div>
            <div>
                <p className="text-silvery-barbs text-xs mb-2">Light (Horizontal)</p>
                <Username characterName="Торин" userName="Player123" variant="light" />
            </div>
        </div>
    ),
};

// Multiple examples
export const MultipleExamples: Story = {
    args: {
        characterName: "Торин",
        userName: "Player123",
        variant: "dark",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <Username characterName="Торин" userName="Player123" variant="dark" />
            <Username characterName="Элара" userName="MagicUser42" variant="light" />
            <Username characterName="Грок" userName="OrcWarrior" variant="dark" />
            <Username characterName="Миралда" userName="HealerGirl" variant="light" />
        </div>
    ),
};
