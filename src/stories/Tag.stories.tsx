import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tag from '../components/Atoms/Tag';

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the tag',
    },
    level: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'The level number to display in the badge',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the tag is in active state',
    },
    withLevel: {
      control: 'boolean',
      description: 'Whether to show the level badge (currently not used in component)',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default inactive tag without level
export const Default: Story = {
  args: {
    text: 'Tag Label',
    isActive: false,
    withLevel: false,
  },
};

// Active tag without level
export const Active: Story = {
  args: {
    text: 'Active Tag',
    isActive: true,
    withLevel: false,
  },
};

// Tag with level badge (inactive)
export const WithLevel: Story = {
  args: {
    text: 'Character Class',
    level: 15,
    isActive: false,
    withLevel: false,
  },
};

// Tag with level badge (active)
export const WithLevelActive: Story = {
  args: {
    text: 'Active Character',
    level: 25,
    isActive: true,
    withLevel: true,
  },
};

// High level tag
export const HighLevel: Story = {
  args: {
    text: 'Master',
    level: 99,
    isActive: true,
    withLevel: true,
  },
};

// Low level tag
export const LowLevel: Story = {
  args: {
    text: 'Beginner',
    level: 1,
    isActive: false,
    withLevel: true,    
  },
};

// Long text tag
export const LongText: Story = {
  args: {
    text: 'Very Long Tag Label Text',
    level: 42,
    isActive: false,
    withLevel: true,
  },
};

// Examples in different contexts
export const AllVariants: Story = {
  args: {
    text: 'Example',
    level: 0,
    isActive: false,
  },
  render: () => 
    <div className="flex gap-2 p-6 flex-row-reverse">
      {/* First column: statuses (Russian), inactive */}
      <div className="flex flex-col gap-2">
        <Tag text="Очарован" isActive={false} />
        <Tag text="Ослеплён" isActive={false} />
        <Tag text="Оглушён" isActive={false} />
        <Tag text="Испуган" isActive={false} />
        <Tag text="Схвачен" isActive={false} />
        <Tag text="Недееспособен" isActive={false} />
        <Tag text="Невидим" isActive={false} />
        <Tag text="Парализован" isActive={false} />
        <Tag text="Окаменел" isActive={false} />
        <Tag text="Отравлен" isActive={false} />
        <Tag text="Сбит с ног" isActive={false} />
        <Tag text="Опутан" isActive={false} />
        <Tag text="Ошеломлён" isActive={false} />
        <Tag text="Без сознания" isActive={false} />
        <Tag text="Истощён" withLevel={true} level={1} isActive={false} />
        <Tag text="Истощён" withLevel={true} level={2} isActive={false} />
        <Tag text="Истощён" withLevel={true} level={3} isActive={false} />
        <Tag text="Истощён" withLevel={true} level={4} isActive={false} />
        <Tag text="Истощён" withLevel={true} level={5} isActive={false} />
        <Tag text="+1к4" isActive={false} />
        <Tag text="+1к6" isActive={false} />
        <Tag text="+1к8" isActive={false} />
        <Tag text="+1к10" isActive={false} />
        <Tag text="+1к12" isActive={false} />
      </div>
      {/* Divider */}
      <div className="w-full border-t border-dashed border-[#7753e9]/30 my-2" />
      {/* Second column: statuses (Russian), active */}
      <div className="flex flex-col gap-2">
        <Tag text="Очарован" isActive={true} />
        <Tag text="Ослеплён" isActive={true} />
        <Tag text="Оглушён" isActive={true} />
        <Tag text="Испуган" isActive={true} />
        <Tag text="Схвачен" isActive={true} />
        <Tag text="Недееспособен" isActive={true} />
        <Tag text="Невидим" isActive={true} />
        <Tag text="Парализован" isActive={true} />
        <Tag text="Окаменел" isActive={true} />
        <Tag text="Отравлен" isActive={true} />
        <Tag text="Сбит с ног" isActive={true} />
        <Tag text="Опутан" isActive={true} />
        <Tag text="Ошеломлён" isActive={true} />
        <Tag text="Без сознания" isActive={true} />
        <Tag text="Истощён" withLevel={true} level={1} isActive={true} />
        <Tag text="Истощён" withLevel={true} level={2} isActive={true} />
        <Tag text="Истощён" withLevel={true} level={3} isActive={true} />
        <Tag text="Истощён" withLevel={true} level={4} isActive={true} />
        <Tag text="Истощён" withLevel={true} level={5} isActive={true} />
        <Tag text="+1к4" isActive={true} />
        <Tag text="+1к6" isActive={true} />
        <Tag text="+1к8" isActive={true} />
        <Tag text="+1к10" isActive={true} />
        <Tag text="+1к12" isActive={true} />
      </div>
    </div>
  ,
};
