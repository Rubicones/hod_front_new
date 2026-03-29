import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ExpandableSkillsGrid from '../components/Molecules/ExpandableSkillsGrid';

const meta = {
  title: 'Molecules/ExpandableSkillsGrid',
  component: ExpandableSkillsGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    skills: {
      control: 'object',
      description: 'Array of three skills with name and level',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 85 },
      { name: 'perception', level: 92 },
    ],
  },
} satisfies Meta<typeof ExpandableSkillsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default grid with all skills
export const Default: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 85 },
      { name: 'perception', level: 92 },
    ],
  },
  render: (args) => (
    <div className="w-full">
      <ExpandableSkillsGrid {...args} className="w-full" />
    </div>
  ),
};

// All skills with same level
export const EqualLevels: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 99 },
      { name: 'perception', level: 99 },
    ],
  },
};

// Low levels
export const LowLevels: Story = {
  args: {
    skills: [
      { name: 'insight', level: 5 },
      { name: 'investigation', level: 10 },
      { name: 'perception', level: 15 },
    ],
  },
};

// Mixed levels
export const MixedLevels: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 50 },
      { name: 'perception', level: 25 },
    ],
  },
};

// With custom width
export const WithCustomWidth: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 85 },
      { name: 'perception', level: 92 },
    ],
    className: 'w-full max-w-2xl',
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <ExpandableSkillsGrid {...args} className="w-full" />
    </div>
  ),
};

// Full width showcase
export const FullWidth: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 85 },
      { name: 'perception', level: 92 },
    ],
    className: 'w-full',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

// Resizable container wrapper
const ResizableContainer = () => {
  const [width, setWidth] = useState(400);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Width control */}
      <div className="flex items-center gap-4">
        <label className="text-silvery-barbs text-sm">
          Container Width: {width}px
        </label>
        <input
          type="range"
          min={200}
          max={800}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-64"
        />
      </div>

      {/* Container with dynamic width */}
      <div
        className="bg-time-stop rounded-2xl p-4 transition-all duration-200"
        style={{ width: `${width}px` }}
      >
        <ExpandableSkillsGrid
          skills={[
            { name: 'insight', level: 99 },
            { name: 'investigation', level: 85 },
            { name: 'perception', level: 92 },
          ]}
          className="w-full"
        />
      </div>

      {/* Width markers */}
      <div className="flex gap-2 flex-wrap">
        {[200, 300, 400, 500, 600, 700, 800].map((w) => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            className={`px-3 py-1 rounded text-sm ${
              width === w
                ? 'bg-acid-arrow text-cloudkill'
                : 'bg-dark-star text-silvery-barbs'
            }`}
          >
            {w}px
          </button>
        ))}
      </div>
    </div>
  );
};

// Resizable test
export const ResizableWidth: Story = {
  args: {
    skills: [
      { name: 'insight', level: 99 },
      { name: 'investigation', level: 85 },
      { name: 'perception', level: 92 },
    ],
  },
  parameters: {
    layout: 'padded',
  },
  render: () => <ResizableContainer />,
};

