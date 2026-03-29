import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import Button from '../components/Atoms/Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The button text content',
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary_big',
        'tertiary_small',
        'error_big',
        'error_small',
      ],
      description: 'The button variant/style',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
  args: {
    onClick: fn(),
    isDisabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button
export const Primary: Story = {
  args: {
    text: 'Начать игру',
    variant: 'primary',
    isDisabled: false,
  },
};

// Primary button - disabled
export const PrimaryDisabled: Story = {
  args: {
    text: 'Начать игру',
    variant: 'primary',
    isDisabled: true,
  },
};

// Secondary button
export const Secondary: Story = {
  args: {
    text: 'Добавить ещё',
    variant: 'secondary',
    isDisabled: false,
  },
};

// Secondary button - disabled
export const SecondaryDisabled: Story = {
  args: {
    text: 'Добавить ещё',
    variant: 'secondary',
    isDisabled: true,
  },
};

// Tertiary big button
export const TertiaryBig: Story = {
  args: {
    text: 'Зарегистрироваться',
    variant: 'tertiary_big',
    isDisabled: false,
  },
};

// Tertiary big button - disabled
export const TertiaryBigDisabled: Story = {
  args: {
    text: 'Зарегистрироваться',
    variant: 'tertiary_big',
    isDisabled: true,
  },
};

// Tertiary small button
export const TertiarySmall: Story = {
  args: {
    text: 'Удалить',
    variant: 'tertiary_small',
    isDisabled: false,
  },
};

// Tertiary small button - disabled
export const TertiarySmallDisabled: Story = {
  args: {
    text: 'Удалить',
    variant: 'tertiary_small',
    isDisabled: true,
  },
};

// Error big button
export const ErrorBig: Story = {
  args: {
    text: 'Зарегистрироваться',
    variant: 'error_big',
    isDisabled: false,
  },
};

// Error big button - disabled
export const ErrorBigDisabled: Story = {
  args: {
    text: 'Зарегистрироваться',
    variant: 'error_big',
    isDisabled: true,
  },
};

// Error small button
export const ErrorSmall: Story = {
  args: {
    text: 'Ошибочка',
    variant: 'error_small',
    isDisabled: false,
  },
};

// Error small button - disabled
export const ErrorSmallDisabled: Story = {
  args: {
    text: 'Ошибочка',
    variant: 'error_small',
    isDisabled: true,
  },
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    text: 'Button',
    variant: 'primary',
    isDisabled: false,
  },
  render: () => (
    <div className="flex flex-col gap-6 p-8 rounded-lg">
      {/* Primary Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Primary Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Начать игру"
            variant="primary"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Начать игру"
            variant="primary"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Secondary Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Добавить ещё"
            variant="secondary"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Добавить ещё"
            variant="secondary"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>

      {/* Tertiary Big Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Tertiary Big Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Зарегистрироваться"
            variant="tertiary_big"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Зарегистрироваться"
            variant="tertiary_big"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>

      {/* Tertiary Small Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Tertiary Small Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Удалить"
            variant="tertiary_small"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Удалить"
            variant="tertiary_small"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>

      {/* Error Big Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Error Big Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Зарегистрироваться"
            variant="error_big"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Зарегистрироваться"
            variant="error_big"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>

      {/* Error Small Buttons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-settings text-silvery-barbs mb-2">Error Small Buttons</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            text="Ошибочка"
            variant="error_small"
            isDisabled={false}
            onClick={fn()}
          />
          <Button
            text="Ошибочка"
            variant="error_small"
            isDisabled={true}
            onClick={fn()}
          />
        </div>
      </div>
    </div>
  ),
};

// Grid layout matching the design reference (Default | Focus/Pressed | Disabled)
export const ButtonGrid: Story = {
  args: {
    text: 'Button',
    variant: 'primary',
    isDisabled: false,
  },
  render: () => (
    <div className="flex flex-col gap-4 p-8 rounded-lg">
      {/* Row 1: Primary */}
      <div className="flex gap-4 items-center">
        <Button
          text="Начать игру"
          variant="primary"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Начать игру"
          variant="primary"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 2: Secondary */}
      <div className="flex gap-4 items-center">
        <Button
          text="Добавить ещё"
          variant="secondary"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Добавить ещё"
          variant="secondary"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 3: Error Small */}
      <div className="flex gap-4 items-center">
        <Button
          text="Ошибочка"
          variant="error_small"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Ошибочка"
          variant="error_small"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 4: Tertiary Big */}
      <div className="flex gap-4 items-center">
        <Button
          text="Зарегистрироваться"
          variant="tertiary_big"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Зарегистрироваться"
          variant="tertiary_big"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 5: Error Big */}
      <div className="flex gap-4 items-center">
        <Button
          text="Зарегистрироваться"
          variant="error_big"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Зарегистрироваться"
          variant="error_big"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 6: Tertiary Small */}
      <div className="flex gap-4 items-center">
        <Button
          text="Удалить"
          variant="tertiary_small"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Удалить"
          variant="tertiary_small"
          isDisabled={true}
          onClick={fn()}
        />
      </div>

      {/* Row 7: Error Small (Delete) */}
      <div className="flex gap-4 items-center">
        <Button
          text="Удалить"
          variant="error_small"
          isDisabled={false}
          onClick={fn()}
        />
        <p className="text-stats-secondary text-illusory-script w-32">
          Focus for pressed
        </p>
        <Button
          text="Удалить"
          variant="error_small"
          isDisabled={true}
          onClick={fn()}
        />
      </div>
    </div>
  ),
};
