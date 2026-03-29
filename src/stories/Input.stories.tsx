import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import Input from '../components/Atoms/Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'select',
      options: [
        'insight',
        'investigation',
        'perception',
        'armor',
        'initiative',
        'hp',
        'custom',
      ],
      description: 'The placeholder text or default placeholder type',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value to pre-fill the input',
    },
    isError: {
      control: 'boolean',
      description: 'Whether the input has an error',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display (only shown when isError is true)',
    },
    displayMode: {
      control: 'boolean',
      description: 'Whether the input is in display-only mode (non-editable)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when input value changes',
    },
  },
  args: {
    onChange: fn(),
    isError: false,
    displayMode: false,
    defaultValue: '',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default input
export const Default: Story = {
  args: {
    placeholder: 'insight',
    isError: false,
    onChange: fn(),
  },
};

// Input with error
export const WithError: Story = {
  args: {
    placeholder: 'perception',
    isError: true,
    errorMessage: 'Invalid value',
    onChange: fn(),
  },
};

// Different placeholder types
export const Insight: Story = {
  args: {
    placeholder: 'insight',
    onChange: fn(),
  },
};

export const Investigation: Story = {
  args: {
    placeholder: 'investigation',
    onChange: fn(),
  },
};

export const Perception: Story = {
  args: {
    placeholder: 'perception',
    onChange: fn(),
  },
};

export const Armor: Story = {
  args: {
    placeholder: 'armor',
    onChange: fn(),
  },
};

export const Initiative: Story = {
  args: {
    placeholder: 'initiative',
    onChange: fn(),
  },
};

export const HP: Story = {
  args: {
    placeholder: 'hp',
    onChange: fn(),
  },
};

// Custom placeholder
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Enter your name',
    onChange: fn(),
  },
};

// With default value
export const WithDefaultValue: Story = {
  args: {
    placeholder: 'insight',
    defaultValue: '42',
    onChange: fn(),
  },
};

// With default value - all types
export const WithDefaultValueAllTypes: Story = {
  args: {
    placeholder: 'insight',
    defaultValue: '99',
    onChange: fn(),
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Input placeholder="insight" defaultValue="15" onChange={fn()} />
      <Input placeholder="investigation" defaultValue="12" onChange={fn()} />
      <Input placeholder="perception" defaultValue="18" onChange={fn()} />
      <Input placeholder="armor" defaultValue="16" onChange={fn()} />
      <Input placeholder="initiative" defaultValue="+3" onChange={fn()} />
      <Input placeholder="hp" defaultValue="45" onChange={fn()} />
    </div>
  ),
};

// Display mode (non-editable)
export const DisplayMode: Story = {
  args: {
    placeholder: 'insight',
    displayMode: true,
    defaultValue: '99',
    onChange: fn(),
  },
};

// Display mode with all placeholders
export const DisplayModeAllTypes: Story = {
  args: {
    placeholder: 'insight',
    displayMode: true,
    defaultValue: '99',
    onChange: fn(),
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Input placeholder="insight" displayMode={true} defaultValue="15" onChange={fn()} />
      <Input placeholder="investigation" displayMode={true} defaultValue="12" onChange={fn()} />
      <Input placeholder="perception" displayMode={true} defaultValue="18" onChange={fn()} />
      <Input placeholder="armor" displayMode={true} defaultValue="16" onChange={fn()} />
      <Input placeholder="initiative" displayMode={true} defaultValue="+3" onChange={fn()} />
      <Input placeholder="hp" displayMode={true} defaultValue="45" onChange={fn()} />
    </div>
  ),
};

// All states showcase
export const AllStates: Story = {
  args: {
    placeholder: 'insight',
    onChange: fn(),
  },
  render: () => {
    return (
      <div className="flex flex-col gap-6 p-8 rounded-lg w-full">
        <div className="flex flex-col gap-2">
          <h3 className="text-settings text-silvery-barbs mb-2">Default State (click to activate)</h3>
          <Input
            placeholder="insight"
            onChange={fn()}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-settings text-silvery-barbs mb-2">Error State</h3>
          <Input
            placeholder="perception"
            isError={true}
            errorMessage="Invalid value"
            onChange={fn()}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-settings text-silvery-barbs mb-2">With Default Value</h3>
          <Input
            placeholder="insight"
            defaultValue="42"
            onChange={fn()}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-settings text-silvery-barbs mb-2">Display Mode (non-editable)</h3>
          <Input
            placeholder="armor"
            displayMode={true}
            defaultValue="18"
            onChange={fn()}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-settings text-silvery-barbs mb-2">All Default Placeholders</h3>
          <div className="flex flex-col gap-3">
            <Input placeholder="insight" onChange={fn()} />
            <Input placeholder="investigation" onChange={fn()} />
            <Input placeholder="perception" onChange={fn()} />
            <Input placeholder="armor" onChange={fn()} />
            <Input placeholder="initiative" onChange={fn()} />
            <Input placeholder="HP" onChange={fn()} />
            <Input placeholder="One more placeholder" onChange={fn()} />
          </div>
        </div>
      </div>
    );
  },
};

// Interactive example wrapper component
const InteractiveInput = () => {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);
  
  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg w-full max-w-md">
      <Input
        placeholder="Enter a number"
        isError={isError}
        errorMessage={isError ? 'Please enter a valid number' : undefined}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          fn()(newValue);
          setIsError(newValue.length > 0 && isNaN(Number(newValue)));
        }}
      />
      <div className="flex flex-col gap-2 text-stats-secondary text-illusory-script">
        <p>Current value: {value || '(empty)'}</p>
        <p>Error: {isError ? 'Yes (not a number)' : 'No'}</p>
      </div>
      <button
        className="px-4 py-2 bg-fire-storm text-gentle-repose rounded-lg text-tag w-fit"
        onClick={() => setIsError(!isError)}
      >
        Toggle Error
      </button>
    </div>
  );
};

export const Interactive: Story = {
  args: {
    placeholder: 'insight',
    onChange: fn(),
  },
  render: () => <InteractiveInput />,
};
