import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import EffectsList from "../components/Molecules/EffectsList";

// All available effects in the game (from Tag.stories.tsx)
const ALL_EFFECTS = [
    { id: "charmed", name: "Очарован" },
    { id: "blinded", name: "Ослеплён" },
    { id: "deafened", name: "Оглушён" },
    { id: "frightened", name: "Испуган" },
    { id: "grappled", name: "Схвачен" },
    { id: "incapacitated", name: "Недееспособен" },
    { id: "invisible", name: "Невидим" },
    { id: "paralyzed", name: "Парализован" },
    { id: "petrified", name: "Окаменел" },
    { id: "poisoned", name: "Отравлен" },
    { id: "prone", name: "Сбит с ног" },
    { id: "restrained", name: "Опутан" },
    { id: "stunned", name: "Ошеломлён" },
    { id: "unconscious", name: "Без сознания" },
    { id: "exhaustion_1", name: "Истощён", withLevel: true, level: 1 },
    { id: "exhaustion_2", name: "Истощён", withLevel: true, level: 2 },
    { id: "exhaustion_3", name: "Истощён", withLevel: true, level: 3 },
    { id: "exhaustion_4", name: "Истощён", withLevel: true, level: 4 },
    { id: "exhaustion_5", name: "Истощён", withLevel: true, level: 5 },
    { id: "d4", name: "+1к4" },
    { id: "d6", name: "+1к6" },
    { id: "d8", name: "+1к8" },
    { id: "d10", name: "+1к10" },
    { id: "d12", name: "+1к12" },
];

const meta = {
    title: "Molecules/EffectsList",
    component: EffectsList,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        title: {
            control: "text",
            description: "Title of the effects section",
        },
        allEffects: {
            control: "object",
            description: "List of all available effects",
        },
        selectedEffectIds: {
            control: "object",
            description: "IDs of currently selected effects",
        },
    },
    args: {
        title: "Состояния",
        allEffects: ALL_EFFECTS,
        selectedEffectIds: [],
        onEffectToggle: fn(),
    },
    decorators: [
        (Story) => (
            <div className="w-[380px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EffectsList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for interactive stories
const InteractiveEffectsList = ({
    initialSelected = [] as string[],
}: {
    initialSelected?: string[];
}) => {
    const [selected, setSelected] = useState<string[]>(initialSelected);

    const handleToggle = (effectId: string) => {
        setSelected((prev) =>
            prev.includes(effectId)
                ? prev.filter((id) => id !== effectId)
                : [...prev, effectId]
        );
    };

    return (
        <EffectsList
            title="Состояния"
            allEffects={ALL_EFFECTS}
            selectedEffectIds={selected}
            onEffectToggle={handleToggle}
        />
    );
};

// Empty state - only add button
export const Empty: Story = {
    args: {
        selectedEffectIds: [],
    },
    render: () => <InteractiveEffectsList />,
};

// With two selected effects
export const TwoEffects: Story = {
    args: {
        selectedEffectIds: ["charmed", "incapacitated"],
    },
    render: () => (
        <InteractiveEffectsList initialSelected={["charmed", "incapacitated"]} />
    ),
};

// With four selected effects
export const FourEffects: Story = {
    args: {
        selectedEffectIds: ["charmed", "incapacitated", "blinded", "invisible"],
    },
    render: () => (
        <InteractiveEffectsList
            initialSelected={["charmed", "incapacitated", "blinded", "invisible"]}
        />
    ),
};

// With many effects including one with level
export const ManyEffects: Story = {
    args: {
        selectedEffectIds: [
            "charmed",
            "incapacitated",
            "blinded",
            "invisible",
            "unconscious",
            "exhaustion_1",
        ],
    },
    render: () => (
        <InteractiveEffectsList
            initialSelected={[
                "charmed",
                "incapacitated",
                "blinded",
                "invisible",
                "unconscious",
                "exhaustion_1",
            ]}
        />
    ),
};

// With exhaustion level
export const WithExhaustion: Story = {
    args: {
        selectedEffectIds: ["deafened", "exhaustion_1"],
    },
    render: () => (
        <InteractiveEffectsList initialSelected={["deafened", "exhaustion_1"]} />
    ),
};

// With dice bonus
export const WithDiceBonus: Story = {
    args: {
        selectedEffectIds: ["deafened", "d8"],
    },
    render: () => (
        <InteractiveEffectsList initialSelected={["deafened", "d8"]} />
    ),
};

// No effects applied state (empty state)
export const NoEffectsApplied: Story = {
    args: {
        title: "Состояния",
        allEffects: ALL_EFFECTS,
        selectedEffectIds: [],
        showEmptyState: true,
    },
};

// All states showcase
export const AllStates: Story = {
    args: {
        selectedEffectIds: [],
    },

    render: () => <InteractiveEffectsList />,
};
