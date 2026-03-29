import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Avatar from "../components/Molecules/Avatar";

// Import avatar images
import drowFemale from "../app/images/drowIconFemale.png";
import drowMale from "../app/images/drowIconMale.png";
import dwarfFemale from "../app/images/dwarfIconFemale.png";
import dwarfMale from "../app/images/dwarfIconMale.png";
import elfFemale from "../app/images/elfIconFemale.png";
import elfMale from "../app/images/elfIconMale.png";
import halflingFemale from "../app/images/halflingIconFemale.png";
import halflingMale1 from "../app/images/halflingIconMale1.png";
import halflingMale2 from "../app/images/halflingIconMale2.png";
import humanFemale from "../app/images/humanIconFemale.png";
import humanMale from "../app/images/humanIconMale.png";
import orcFemale from "../app/images/orcIconFemale.png";
import orcMale from "../app/images/orcIconMale.png";

const meta = {
    title: "Molecules/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["small", "medium", "large"],
            description: "Size of the avatar",
        },
        src: {
            control: "text",
            description: "Image source URL",
        },
        isSelected: {
            control: "boolean",
            description: "Whether the avatar is selected (shows yellow border)",
        },
        withPattern: {
            control: "boolean",
            description: "Whether to show the graphic pattern overlay",
        },
    },
    args: {
        size: "medium",
        isSelected: false,
        withPattern: true,
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Small size
export const Small: Story = {
    args: {
        size: "small",
        src: humanMale.src,
    },
};

// Medium size
export const Medium: Story = {
    args: {
        size: "medium",
        src: elfFemale.src,
    },
};

// Large size
export const Large: Story = {
    args: {
        size: "large",
        src: dwarfMale.src,
    },
};

// All sizes comparison
export const AllSizes: Story = {
    args: {
        size: "medium",
        src: orcMale.src,
    },
    render: () => (
        <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="small" src={humanMale.src} />
                <span className="text-silvery-barbs text-xs">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={humanMale.src} />
                <span className="text-silvery-barbs text-xs">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="large" src={humanMale.src} />
                <span className="text-silvery-barbs text-xs">Large</span>
            </div>
        </div>
    ),
};

// All races - Male
export const AllRacesMale: Story = {
    args: {
        size: "medium",
    },
    render: () => (
        <div className="flex flex-wrap gap-4 max-w-[600px]">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={humanMale.src} />
                <span className="text-silvery-barbs text-xs">Human</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={elfMale.src} />
                <span className="text-silvery-barbs text-xs">Elf</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={dwarfMale.src} />
                <span className="text-silvery-barbs text-xs">Dwarf</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={halflingMale1.src} />
                <span className="text-silvery-barbs text-xs">Halfling 1</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={halflingMale2.src} />
                <span className="text-silvery-barbs text-xs">Halfling 2</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={orcMale.src} />
                <span className="text-silvery-barbs text-xs">Orc</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={drowMale.src} />
                <span className="text-silvery-barbs text-xs">Drow</span>
            </div>
        </div>
    ),
};

// All races - Female
export const AllRacesFemale: Story = {
    args: {
        size: "medium",
    },
    render: () => (
        <div className="flex flex-wrap gap-4 max-w-[600px]">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={humanFemale.src} />
                <span className="text-silvery-barbs text-xs">Human</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={elfFemale.src} />
                <span className="text-silvery-barbs text-xs">Elf</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={dwarfFemale.src} />
                <span className="text-silvery-barbs text-xs">Dwarf</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={halflingFemale.src} />
                <span className="text-silvery-barbs text-xs">Halfling</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={orcFemale.src} />
                <span className="text-silvery-barbs text-xs">Orc</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={drowFemale.src} />
                <span className="text-silvery-barbs text-xs">Drow</span>
            </div>
        </div>
    ),
};

// Placeholder (no image)
export const Placeholder: Story = {
    args: {
        size: "medium",
        src: "",
    },
};

// Selected state
export const Selected: Story = {
    args: {
        size: "medium",
        src: humanMale.src,
        isSelected: true,
    },
};

// Selected small
export const SelectedSmall: Story = {
    args: {
        size: "small",
        src: elfFemale.src,
        isSelected: true,
    },
};

// All states - Small
export const AllStatesSmall: Story = {
    args: {
        size: "small",
    },
    render: () => (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="small" src={humanFemale.src} isSelected={true} />
                <span className="text-silvery-barbs text-xs">Selected</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="small" src={humanFemale.src} isSelected={false} />
                <span className="text-silvery-barbs text-xs">Not Selected</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="small" src="" isSelected={false} />
                <span className="text-silvery-barbs text-xs">Placeholder</span>
            </div>
        </div>
    ),
};

// All states - Medium/Large
export const AllStatesMedium: Story = {
    args: {
        size: "medium",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={dwarfMale.src} isSelected={false} />
                    <span className="text-silvery-barbs text-xs">Not Selected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src="" isSelected={false} />
                    <span className="text-silvery-barbs text-xs">Placeholder</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={dwarfMale.src} isSelected={true} />
                    <span className="text-silvery-barbs text-xs">Selected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="large" src={dwarfMale.src} isSelected={true} />
                    <span className="text-silvery-barbs text-xs">Large Selected</span>
                </div>
            </div>
        </div>
    ),
};

// With pattern (default)
export const WithPattern: Story = {
    args: {
        size: "medium",
        src: humanMale.src,
        withPattern: true,
    },
};

// Without pattern
export const WithoutPattern: Story = {
    args: {
        size: "medium",
        src: humanMale.src,
        withPattern: false,
    },
};

// Pattern comparison
export const PatternComparison: Story = {
    args: {
        size: "medium",
    },
    render: () => (
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={elfFemale.src} withPattern={true} />
                <span className="text-silvery-barbs text-xs">With Pattern</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Avatar size="medium" src={elfFemale.src} withPattern={false} />
                <span className="text-silvery-barbs text-xs">Without Pattern</span>
            </div>
        </div>
    ),
};

// All options combined
export const AllOptionsCombined: Story = {
    args: {
        size: "medium",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={orcMale.src} withPattern={true} isSelected={false} />
                    <span className="text-silvery-barbs text-xs">Pattern, Not Selected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={orcMale.src} withPattern={false} isSelected={false} />
                    <span className="text-silvery-barbs text-xs">No Pattern, Not Selected</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={orcMale.src} withPattern={true} isSelected={true} />
                    <span className="text-silvery-barbs text-xs">Pattern, Selected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar size="medium" src={orcMale.src} withPattern={false} isSelected={true} />
                    <span className="text-silvery-barbs text-xs">No Pattern, Selected</span>
                </div>
            </div>
        </div>
    ),
};

