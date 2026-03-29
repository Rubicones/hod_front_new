import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import ToggleInput from "../components/Molecules/ToggleInput";

const meta = {
    title: "Molecules/ToggleInput",
    component: ToggleInput,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        checked: {
            control: "boolean",
            description: "Whether the toggle is checked",
        },
        label: {
            control: "text",
            description: "Label text for the toggle",
        },
        onChange: {
            action: "changed",
            description: "Callback when toggle state changes",
        },
    },
    args: {
        checked: false,
        label: "Вдохновение",
        onChange: fn(),
    },
} satisfies Meta<typeof ToggleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Unchecked state
export const Unchecked: Story = {
    args: {
        checked: false,
        label: "Вдохновение",
    },
};

// Checked state
export const Checked: Story = {
    args: {
        checked: true,
        label: "Вдохновение",
    },
};

// Interactive wrapper
const InteractiveToggleInput = ({ label }: { label: string }) => {
    const [checked, setChecked] = useState(false);
    return <ToggleInput checked={checked} label={label} onChange={setChecked} />;
};

// Interactive
export const Interactive: Story = {
    args: {
        checked: false,
        label: "Вдохновение",
    },
    render: () => <InteractiveToggleInput label="Вдохновение" />,
};

// Multiple toggles
export const MultipleToggles: Story = {
    args: {
        checked: false,
        label: "Toggle",
    },
    render: () => {
        const ToggleGroup = () => {
            const [inspiration, setInspiration] = useState(false);
            const [concentration, setConcentration] = useState(true);
            const [exhaustion, setExhaustion] = useState(false);

            return (
                <div className="flex flex-col gap-3">
                    <ToggleInput
                        checked={inspiration}
                        label="Вдохновение"
                        onChange={setInspiration}
                    />
                    <ToggleInput
                        checked={concentration}
                        label="Концентрация"
                        onChange={setConcentration}
                    />
                    <ToggleInput
                        checked={exhaustion}
                        label="Истощение"
                        onChange={setExhaustion}
                    />
                </div>
            );
        };
        return <ToggleGroup />;
    },
};

// All states
export const AllStates: Story = {
    args: {
        checked: false,
        label: "Toggle",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-silvery-barbs text-xs mb-2">Unchecked</p>
                <ToggleInput checked={false} label="Вдохновение" onChange={fn()} />
            </div>
            <div>
                <p className="text-silvery-barbs text-xs mb-2">Checked</p>
                <ToggleInput checked={true} label="Вдохновение" onChange={fn()} />
            </div>
        </div>
    ),
};

