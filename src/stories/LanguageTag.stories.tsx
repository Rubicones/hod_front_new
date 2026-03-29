import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import LanguageTag from '../components/Atoms/LanguageTag';

const meta = {
  title: 'Atoms/LanguageTag',
  component: LanguageTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text content of the language tag',
    },
    isEditable: {
      control: 'boolean',
      description: 'Whether the tag is editable (shows delete icon)',
    },
    onDelete: {
      action: 'deleted',
      description: 'Callback function when delete icon is clicked',
    },
  },
  args: {
    onDelete: fn(),
    isEditable: false,
  },
} satisfies Meta<typeof LanguageTag>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default non-editable tag
export const Default: Story = {
  args: {
    text: 'English',
    isEditable: false,
    onDelete: fn(),
  },
};

// Editable tag with delete icon
export const Editable: Story = {
  args: {
    text: 'English',
    isEditable: true,
    onDelete: fn(),
  },
};

// Non-editable tag with different language
export const Spanish: Story = {
  args: {
    text: 'Español',
    isEditable: false,
    onDelete: fn(),
  },
};

// Editable tag with different language
export const EditableSpanish: Story = {
  args: {
    text: 'Español',
    isEditable: true,
    onDelete: fn(),
  },
};

// Long language name
export const LongText: Story = {
  args: {
    text: 'Português (Brasil)',
    isEditable: false,
    onDelete: fn(),
  },
};

// Editable long language name
export const EditableLongText: Story = {
  args: {
    text: 'Português (Brasil)',
    isEditable: true,
    onDelete: fn(),
  },
};

// Multiple language tags showcase
export const AllVariants: Story = {
  args: {
    text: 'English',
    isEditable: false,
  },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Non-Editable Tags</h3>
        <div className="flex flex-wrap gap-2">
          <LanguageTag text="English" isEditable={false} onDelete={fn()} />
          <LanguageTag text="Español" isEditable={false} onDelete={fn()} />
          <LanguageTag text="Français" isEditable={false} onDelete={fn()} />
          <LanguageTag text="Deutsch" isEditable={false} onDelete={fn()} />
          <LanguageTag text="日本語" isEditable={false} onDelete={fn()} />
          <LanguageTag text="中文" isEditable={false} onDelete={fn()} />
          <LanguageTag text="Português (Brasil)" isEditable={false} onDelete={fn()} />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Editable Tags</h3>
        <div className="flex flex-wrap gap-2">
          <LanguageTag text="English" isEditable={true} onDelete={fn()} />
          <LanguageTag text="Español" isEditable={true} onDelete={fn()} />
          <LanguageTag text="Français" isEditable={true} onDelete={fn()} />
          <LanguageTag text="Deutsch" isEditable={true} onDelete={fn()} />
          <LanguageTag text="日本語" isEditable={true} onDelete={fn()} />
          <LanguageTag text="中文" isEditable={true} onDelete={fn()} />
          <LanguageTag text="Português (Brasil)" isEditable={true} onDelete={fn()} />
        </div>
      </div>
    </div>
  ),
};

// D&D Languages showcase - matching the design reference
export const DnDLanguages: Story = {
  args: {
    text: 'Общий',
    isEditable: false,
  },
  render: () => (
    <div className="flex gap-6 p-6">
      {/* Left column: Editable tags (with delete icon) */}
      <div className="flex flex-col gap-2">
        <LanguageTag text="Общий" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Гоблинский" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Дварфский" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Эльфийский" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Великаний" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Гномий" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Полуросликов" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Орочий" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Бездны" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Небесный" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Драконий" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Глубинная Речь" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Инфернальный" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Первичный" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Сильван" isEditable={true} onDelete={fn()} />
        <LanguageTag text="Подземный" isEditable={true} onDelete={fn()} />
      </div>
      
      {/* Right column: Non-editable tags (without delete icon) */}
      <div className="flex flex-col gap-2">
        <LanguageTag text="Общий" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Гоблинский" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Дварфский" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Эльфийский" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Великаний" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Гномий" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Полуросликов" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Орочий" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Бездны" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Небесный" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Драконий" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Глубинная Речь" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Инфернальный" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Первичный" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Сильван" isEditable={false} onDelete={fn()} />
        <LanguageTag text="Подземный" isEditable={false} onDelete={fn()} />
      </div>
    </div>
  ),
};

// Interactive example
export const Interactive: Story = {
  args: {
    text: 'English',
    isEditable: false,
    onDelete: fn(),
  },
  render: (args) => (
    <div className="flex flex-col gap-4 p-6">
      <LanguageTag
        text={args.text}
        isEditable={args.isEditable}
        onDelete={fn()}
      />
    </div>
  ),
};

