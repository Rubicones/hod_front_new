import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import LanguagesPicker from "../components/Molecules/LanguagesPicker";

const meta = {
    title: "Molecules/LanguagesPicker",
    component: LanguagesPicker,
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
            description: "Title of the section",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text for the input",
        },
        languages: {
            control: "object",
            description: "List of selected languages",
        },
        isEditable: {
            control: "boolean",
            description: "Whether the picker is editable",
        },
    },
    args: {
        title: "Языки",
        placeholder: "Впишите...",
        languages: [],
        isEditable: true,
        onLanguagesChange: fn(),
    },
    decorators: [
        (Story) => (
            <div className="w-[380px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof LanguagesPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for stories
const InteractiveLanguagesPicker = ({
    initialLanguages = [] as string[],
    isEditable = true,
}: {
    initialLanguages?: string[];
    isEditable?: boolean;
}) => {
    const [languages, setLanguages] = useState<string[]>(initialLanguages);

    return (
        <LanguagesPicker
            title="Языки"
            languages={languages}
            isEditable={isEditable}
            onLanguagesChange={setLanguages}
        />
    );
};

// Empty state - editable (click to activate)
export const Empty: Story = {
    args: {
        languages: [],
        isEditable: true,
    },
    render: () => <InteractiveLanguagesPicker />,
};

// One language - editable
export const OneLanguage: Story = {
    args: {
        languages: ["Общий"],
        isEditable: true,
    },
    render: () => <InteractiveLanguagesPicker initialLanguages={["Общий"]} />,
};

// One language - non-editable
export const OneLanguageNonEditable: Story = {
    args: {
        languages: ["Общий"],
        isEditable: false,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий"]}
            isEditable={false}
        />
    ),
};

// Two languages - editable
export const TwoLanguages: Story = {
    args: {
        languages: ["Общий", "Дварфский"],
        isEditable: true,
    },
    render: () => (
        <InteractiveLanguagesPicker initialLanguages={["Общий", "Дварфский"]} />
    ),
};

// Two languages - non-editable
export const TwoLanguagesNonEditable: Story = {
    args: {
        languages: ["Общий", "Дварфийский"],
        isEditable: false,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий", "Дварфийский"]}
            isEditable={false}
        />
    ),
};

// Three languages - editable
export const ThreeLanguages: Story = {
    args: {
        languages: ["Общий", "Дварфский", "Орочий"],
        isEditable: true,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий", "Дварфский", "Орочий"]}
        />
    ),
};

// Three languages - non-editable
export const ThreeLanguagesNonEditable: Story = {
    args: {
        languages: ["Общий", "Дварфийский", "Орочий"],
        isEditable: false,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий", "Дварфийский", "Орочий"]}
            isEditable={false}
        />
    ),
};

// Four languages with wrap - editable
export const FourLanguages: Story = {
    args: {
        languages: ["Общий", "Дварфский", "Орочий", "Полуросликов"],
        isEditable: true,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий", "Дварфский", "Орочий", "Полуросликов"]}
        />
    ),
};

// Four languages - non-editable
export const FourLanguagesNonEditable: Story = {
    args: {
        languages: ["Общий", "Дварфийский", "Орочий", "Полуросликов"],
        isEditable: false,
    },
    render: () => (
        <InteractiveLanguagesPicker
            initialLanguages={["Общий", "Дварфийский", "Орочий", "Полуросликов"]}
            isEditable={false}
        />
    ),
};

// All states comparison
export const AllStates: Story = {
    args: {
        languages: [],
    },
    decorators: [
        (Story) => (
            <div className="flex flex-col gap-4 w-[380px]">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <>
            <div>
                <p className="text-stats-secondary text-illusory-script mb-2">
                    Editable (click to type, space to add)
                </p>
                <InteractiveLanguagesPicker
                    initialLanguages={["Общий", "Дварфский"]}
                />
            </div>
            <div>
                <p className="text-stats-secondary text-illusory-script mb-2">
                    Non-editable
                </p>
                <InteractiveLanguagesPicker
                    initialLanguages={["Общий", "Дварфийский"]}
                    isEditable={false}
                />
            </div>
        </>
    ),
};
