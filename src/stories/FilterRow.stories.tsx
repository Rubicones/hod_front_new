import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import FilterRow from "../components/Atoms/FilterRow";
import FilterList from "../components/Atoms/FilterList";

// Wrapper components for stories that need state
const InteractiveExpandableWrapper = () => {
    const [selectedOption, setSelectedOption] = useState<string | undefined>("all_time");

    return (
        <FilterRow
            label="Количество законченных игр"
            options={[
                { id: "month", label: "Месяц" },
                { id: "half_year", label: "Полгода" },
                { id: "year", label: "Год" },
                { id: "all_time", label: "Всё время" },
            ]}
            selectedOptionId={selectedOption}
            onOptionSelect={setSelectedOption}
        />
    );
};

const FullFilterListWrapper = () => {
    const [selections, setSelections] = useState({
        filter1: false,
        filter4: true,
        filter6: false,
    });

    const [expandedOption, setExpandedOption] = useState<string | undefined>("all_time");

    const toggleSelection = (key: keyof typeof selections) => {
        setSelections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <FilterList>
            {/* Title row */}
            <FilterRow
                label="Количество законченных игр"
                isTitle={true}
                showDivider={false}
            />

            {/* Simple selectable filter */}
            <FilterRow
                label="Количество законченных игр"
                isSelected={selections.filter1}
                onClick={() => toggleSelection("filter1")}
            />

            {/* Filter with navigation */}
            <FilterRow
                label="Количество законченных игр"
                hasNavigation={true}
                onClick={() => fn()()}
            />

            {/* Selected filter with navigation */}
            <FilterRow
                label="Количество законченных игр"
                isSelected={selections.filter4}
                hasNavigation={true}
                onClick={() => toggleSelection("filter4")}
            />

            {/* Expandable filter with options - checkmark auto-shows when option selected */}
            <FilterRow
                label="Количество законченных игр"
                options={[
                    { id: "month", label: "Месяц" },
                    { id: "half_year", label: "Полгода" },
                    { id: "year", label: "Год" },
                    { id: "all_time", label: "Всё время" },
                ]}
                selectedOptionId={expandedOption}
                onOptionSelect={setExpandedOption}
            />

            {/* Simple filter without selection */}
            <FilterRow
                label="Количество законченных игр"
                isSelected={selections.filter6}
                onClick={() => toggleSelection("filter6")}
            />

            {/* Filter with navigation at the end */}
            <FilterRow
                label="Количество законченных игр"
                hasNavigation={true}
                showDivider={false}
                onClick={() => fn()()}
            />
        </FilterList>
    );
};

const AnimationShowcaseWrapper = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | undefined>("month");

    return (
        <FilterList>
            <div className="mb-4">
                <p className="text-stats-secondary text-silvery-barbs mb-4 text-center">
                    Click to see animations. Click same option to deselect.
                </p>
            </div>

            <FilterRow
                label="Toggle Selection"
                isSelected={isSelected}
                onClick={() => setIsSelected(!isSelected)}
            />

            <FilterRow
                label="Expand for Options"
                options={[
                    { id: "month", label: "Месяц" },
                    { id: "half_year", label: "Полгода" },
                    { id: "year", label: "Год" },
                    { id: "all_time", label: "Всё время" },
                ]}
                selectedOptionId={selectedOption}
                onOptionSelect={setSelectedOption}
                showDivider={false}
            />
        </FilterList>
    );
};

const meta = {
    title: "Atoms/FilterRow",
    component: FilterRow,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#0E0E0E" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        label: {
            control: "text",
            description: "The main label text",
        },
        isSelected: {
            control: "boolean",
            description: "Whether this filter is selected (shows checkmark)",
        },
        hasNavigation: {
            control: "boolean",
            description: "Shows a right chevron for navigation",
        },
        isTitle: {
            control: "boolean",
            description: "Whether the filter is a title/header",
        },
        showDivider: {
            control: "boolean",
            description: "Whether a divider should be shown below",
        },
    },
    args: {
        label: "Количество законченных игр",
        isSelected: false,
        hasNavigation: false,
        isTitle: false,
        showDivider: true,
        onClick: fn(),
    },
    decorators: [
        (Story) => (
            <div className="w-[400px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FilterRow>;

export default meta;
type Story = StoryObj<typeof meta>;

// Title variant - centered header
export const Title: Story = {
    args: {
        label: "Количество законченных игр",
        isTitle: true,
        showDivider: false,
    },
};

// Simple filter with selection
export const Selected: Story = {
    args: {
        label: "Количество законченных игр",
        isSelected: true,
    },
};

// Simple filter without selection
export const Unselected: Story = {
    args: {
        label: "Количество законченных игр",
        isSelected: false,
    },
};

// Filter with navigation arrow
export const WithNavigation: Story = {
    args: {
        label: "Количество законченных игр",
        hasNavigation: true,
    },
};

// Filter with selection and navigation
export const SelectedWithNavigation: Story = {
    args: {
        label: "Количество законченных игр",
        isSelected: true,
        hasNavigation: true,
    },
};

// Expandable filter with options
export const Expandable: Story = {
    args: {
        label: "Количество законченных игр",
        isSelected: true,
        options: [
            { id: "month", label: "Месяц" },
            { id: "half_year", label: "Полгода" },
            { id: "year", label: "Год" },
            { id: "all_time", label: "Всё время" },
        ],
        selectedOptionId: "all_time",
    },
};

// Interactive expandable filter
export const InteractiveExpandable: Story = {
    args: {
        label: "Количество законченных игр",
        isSelected: true,
    },
    render: () => <InteractiveExpandableWrapper />,
};

// Full filter list matching the design
export const FullFilterList: Story = {
    args: {
        label: "Количество законченных игр",
    },
    render: () => <FullFilterListWrapper />,
};

// All variants showcase
export const AllVariants: Story = {
    args: {
        label: "Filter Label",
    },
    render: () => (
        <FilterList className="flex flex-col gap-4">
            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    Title
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    isTitle={true}
                    showDivider={false}
                />
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    Selected
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    isSelected={true}
                    showDivider={false}
                />
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    Unselected
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    isSelected={false}
                    showDivider={false}
                />
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    With Navigation
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    hasNavigation={true}
                    showDivider={false}
                />
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    Selected with Navigation
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    isSelected={true}
                    hasNavigation={true}
                    showDivider={false}
                />
            </div>

            <div>
                <h3 className="text-stats-secondary text-silvery-barbs mb-2">
                    Expandable (click to expand)
                </h3>
                <FilterRow
                    label="Количество законченных игр"
                    isSelected={true}
                    options={[
                        { id: "month", label: "Месяц" },
                        { id: "half_year", label: "Полгода" },
                        { id: "year", label: "Год" },
                        { id: "all_time", label: "Всё время" },
                    ]}
                    selectedOptionId="all_time"
                    showDivider={false}
                />
            </div>
        </FilterList>
    ),
};

// Animation showcase
export const AnimationShowcase: Story = {
    args: {
        label: "Количество законченных игр",
    },
    render: () => <AnimationShowcaseWrapper />,
};

