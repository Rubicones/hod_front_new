import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSmall from "../components/Atoms/StatsSmall";
import StatsRow from "../components/Atoms/StatsRow";

const meta = {
    title: "Atoms/StatsSmall",
    component: StatsSmall,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["insight", "investigation", "perception", "armor", "hp", "initiative"],
            description: "The type of stat to display",
        },
        value: {
            control: { type: "number", min: 0, max: 999 },
            description: "The value to display",
        },
        size: {
            control: { type: "number", min: 16, max: 48 },
            description: "Size of the icon in pixels",
        },
    },
    args: {
        type: "investigation",
        value: 99,
        size: 24,
    },
} satisfies Meta<typeof StatsSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

// Individual stat types
export const Investigation: Story = {
    args: {
        type: "investigation",
        value: 99,
    },
};

export const Perception: Story = {
    args: {
        type: "perception",
        value: 99,
    },
};

export const Insight: Story = {
    args: {
        type: "insight",
        value: 99,
    },
};

export const Armor: Story = {
    args: {
        type: "armor",
        value: 99,
    },
};

export const Hp: Story = {
    args: {
        type: "hp",
        value: 99,
    },
};

export const Initiative: Story = {
    args: {
        type: "initiative",
        value: 99,
    },
};

// Different sizes
export const SmallSize: Story = {
    args: {
        type: "investigation",
        value: 99,
        size: 18,
    },
};

export const LargeSize: Story = {
    args: {
        type: "investigation",
        value: 99,
        size: 32,
    },
};

// All stats in a row (matching the design)
export const AllStatsRow: Story = {
    args: {
        type: "insight",
        value: 99,
    },
    decorators: [
        (Story) => (
            <div className="w-[320px]">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <StatsRow>
            <StatsSmall type="insight" value={99} />
            <StatsSmall type="investigation" value={99} />
            <StatsSmall type="perception" value={99} />
            <StatsSmall type="initiative" value={99} />
        </StatsRow>
    ),
};

// Combat stats row
export const CombatStatsRow: Story = {
    args: {
        type: "armor",
        value: 99,
    },
    decorators: [
        (Story) => (
            <div className="w-[240px]">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <StatsRow>
            <StatsSmall type="hp" value={120} />
            <StatsSmall type="armor" value={18} />
            <StatsSmall type="initiative" value={15} />
        </StatsRow>
    ),
};

// Skills stats row
export const SkillsStatsRow: Story = {
    args: {
        type: "insight",
        value: 99,
    },
    decorators: [
        (Story) => (
            <div className="w-[240px]">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <StatsRow>
            <StatsSmall type="insight" value={85} />
            <StatsSmall type="investigation" value={72} />
            <StatsSmall type="perception" value={91} />
        </StatsRow>
    ),
};

// Single stat (matching first design image)
export const SingleStat: Story = {
    args: {
        type: "investigation",
        value: 99,
    },
    decorators: [
        (Story) => (
            <div className="p-4">
                <Story />
            </div>
        ),
    ],
};

// All variants showcase
export const AllVariants: Story = {
    args: {
        type: "insight",
        value: 99,
    },
    render: () => (
        <div className="flex flex-col gap-6 w-[400px]">
            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-3">All Stat Types</h3>
                <StatsRow>
                    <StatsSmall type="insight" value={99} />
                    <StatsSmall type="investigation" value={99} />
                    <StatsSmall type="perception" value={99} />
                    <StatsSmall type="initiative" value={99} />
                    <StatsSmall type="hp" value={99} />
                    <StatsSmall type="armor" value={99} />
                </StatsRow>
            </div>
            
            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-3">Different Values</h3>
                <StatsRow>
                    <StatsSmall type="insight" value={5} />
                    <StatsSmall type="investigation" value={42} />
                    <StatsSmall type="perception" value={100} />
                    <StatsSmall type="initiative" value={999} />
                </StatsRow>
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-3">Different Sizes</h3>
                <StatsRow>
                    <StatsSmall type="investigation" value={99} size={18} />
                    <StatsSmall type="investigation" value={99} size={24} />
                    <StatsSmall type="investigation" value={99} size={32} />
                </StatsRow>
            </div>
        </div>
    ),
};

