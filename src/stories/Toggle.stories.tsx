import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import Toggle from '../components/Atoms/Toggle';

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked (on) or unchecked (off)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when toggle state changes',
    },
  },
  args: {
    checked: false,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Unchecked state (off)
export const Unchecked: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

// Checked state (on)
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};

// Disabled unchecked
export const DisabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

// Disabled checked
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

// All states showcase
export const AllStates: Story = {
  args: {
    checked: false,
    disabled: false,
  },
  render: () => (
    <div className="flex flex-col gap-6 p-8 rounded-lg">
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Active States</h3>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col gap-2 items-center">
            <Toggle checked={false} onChange={fn()} disabled={false} />
            <span className="text-stats-secondary text-illusory-script">Unchecked</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Toggle checked={true} onChange={fn()} disabled={false} />
            <span className="text-stats-secondary text-illusory-script">Checked</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Disabled States</h3>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col gap-2 items-center">
            <Toggle checked={false} onChange={fn()} disabled={true} />
            <span className="text-stats-secondary text-illusory-script">Disabled Unchecked</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Toggle checked={true} onChange={fn()} disabled={true} />
            <span className="text-stats-secondary text-illusory-script">Disabled Checked</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive wrapper component
const InteractiveToggle = () => {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-8 rounded-lg w-full max-w-md">
      <div className="flex flex-col gap-4 items-center">
        <Toggle
          checked={checked}
          onChange={(newChecked) => {
            setChecked(newChecked);
            fn()(newChecked);
          }}
          disabled={disabled}
        />
        <div className="text-body text-beacon-of-hope">
          {checked ? 'Toggle is ON' : 'Toggle is OFF'}
        </div>
      </div>

      <div className="flex flex-col gap-3 text-stats-secondary text-illusory-script">
        <div className="flex items-center gap-2">
          <label className="w-32">Checked:</label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-4 h-4"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-32">Disabled:</label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
            className="w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};

// Interactive example with state management
export const Interactive: Story = {
  args: {
    checked: false,
    disabled: false,
  },
  render: () => <InteractiveToggle />,
};

// Multiple toggles wrapper component
const MultipleTogglesDemo = () => {
  const [toggles, setToggles] = useState([
    { id: 1, checked: false, label: 'Notifications' },
    { id: 2, checked: true, label: 'Dark Mode' },
    { id: 3, checked: false, label: 'Auto-save' },
    { id: 4, checked: true, label: 'Sound Effects' },
  ]);

  const handleToggle = (id: number) => {
    setToggles(
      toggles.map((toggle) =>
        toggle.id === id ? { ...toggle, checked: !toggle.checked } : toggle
      )
    );
  };

  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg w-full max-w-md">
      <h3 className="text-settings text-silvery-barbs mb-2">Settings</h3>
      <div className="flex flex-col gap-4">
        {toggles.map((toggle) => (
          <div key={toggle.id} className="flex items-center justify-between">
            <span className="text-body text-beacon-of-hope">{toggle.label}</span>
            <Toggle
              checked={toggle.checked}
              onChange={() => handleToggle(toggle.id)}
              disabled={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Multiple toggles showcase
export const MultipleToggles: Story = {
  args: {
    checked: false,
    disabled: false,
  },
  render: () => <MultipleTogglesDemo />,
};

