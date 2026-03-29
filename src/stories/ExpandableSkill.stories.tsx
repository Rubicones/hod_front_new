import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ExpandableSkill from '../components/Atoms/ExpandableSkill';

const meta = {
  title: 'Atoms/ExpandableSkill',
  component: ExpandableSkill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'Whether the skill is expanded to show icon and name',
    },
    name: {
      control: 'select',
      options: ['insight', 'investigation', 'perception'],
      description: 'The skill name/type',
    },
    level: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'The skill level number',
    },
  },
  args: {
    isExpanded: false,
    name: 'insight',
    level: 99,
  },
} satisfies Meta<typeof ExpandableSkill>;

export default meta;
type Story = StoryObj<typeof meta>;

// Collapsed state - default
export const Collapsed: Story = {
  args: {
    isExpanded: false,
    name: 'insight',
    level: 99,
  },
};

// Expanded state
export const Expanded: Story = {
  args: {
    isExpanded: true,
    name: 'insight',
    level: 99,
  },
};

// Insight skill - collapsed
export const InsightCollapsed: Story = {
  args: {
    isExpanded: false,
    name: 'insight',
    level: 99,
  },
};

// Insight skill - expanded
export const InsightExpanded: Story = {
  args: {
    isExpanded: true,
    name: 'insight',
    level: 99,
  },
};

// Investigation skill - collapsed
export const InvestigationCollapsed: Story = {
  args: {
    isExpanded: false,
    name: 'investigation',
    level: 85,
  },
};

// Investigation skill - expanded
export const InvestigationExpanded: Story = {
  args: {
    isExpanded: true,
    name: 'investigation',
    level: 85,
  },
};

// Perception skill - collapsed
export const PerceptionCollapsed: Story = {
  args: {
    isExpanded: false,
    name: 'perception',
    level: 92,
  },
};

// Perception skill - expanded
export const PerceptionExpanded: Story = {
  args: {
    isExpanded: true,
    name: 'perception',
    level: 92,
  },
};

// Different levels
export const LowLevel: Story = {
  args: {
    isExpanded: true,
    name: 'insight',
    level: 5,
  },
};

export const MidLevel: Story = {
  args: {
    isExpanded: true,
    name: 'investigation',
    level: 50,
  },
};

export const HighLevel: Story = {
  args: {
    isExpanded: true,
    name: 'perception',
    level: 99,
  },
};

// All skills showcase
export const AllSkills: Story = {
  args: {
    isExpanded: true,
    name: 'insight',
    level: 99,
  },
  render: () => (
    <div className="flex flex-col gap-6 p-8 rounded-lg">
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Expanded Skills</h3>
        <div className="flex flex-col gap-3">
          <ExpandableSkill
            isExpanded={true}
            name="insight"
            level={99}
          />
          <ExpandableSkill
            isExpanded={true}
            name="investigation"
            level={85}
          />
          <ExpandableSkill
            isExpanded={true}
            name="perception"
            level={92}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Collapsed Skills</h3>
        <div className="flex flex-col gap-3">
          <ExpandableSkill
            isExpanded={false}
            name="insight"
            level={99}
          />
          <ExpandableSkill
            isExpanded={false}
            name="investigation"
            level={85}
          />
          <ExpandableSkill
            isExpanded={false}
            name="perception"
            level={92}
          />
        </div>
      </div>
    </div>
  ),
};

// Interactive wrapper component
const InteractiveExpandableSkill = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [skillName, setSkillName] = useState<'insight' | 'investigation' | 'perception'>('insight');
  const [level, setLevel] = useState(99);

  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg w-full max-w-md">
      <ExpandableSkill
        isExpanded={isExpanded}
        name={skillName}
        level={level}
      />
      <div className="flex flex-col gap-3 text-stats-secondary text-illusory-script">
        <div className="flex items-center gap-2">
          <label className="w-24">Expanded:</label>
          <input
            type="checkbox"
            checked={isExpanded}
            onChange={(e) => setIsExpanded(e.target.checked)}
            className="w-4 h-4"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24">Skill:</label>
          <select
            value={skillName}
            onChange={(e) => setSkillName(e.target.value as 'insight' | 'investigation' | 'perception')}
            className="px-2 py-1 bg-dark-star text-beacon-of-hope rounded"
          >
            <option value="insight">Insight</option>
            <option value="investigation">Investigation</option>
            <option value="perception">Perception</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24">Level:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="px-2 py-1 bg-dark-star text-beacon-of-hope rounded w-20"
          />
        </div>
      </div>
    </div>
  );
};

// Interactive example with toggle
export const Interactive: Story = {
  args: {
    isExpanded: false,
    name: 'insight',
    level: 99,
  },
  render: () => <InteractiveExpandableSkill />,
};

