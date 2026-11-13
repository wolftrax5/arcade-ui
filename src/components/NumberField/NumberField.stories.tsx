import type { Meta, StoryObj } from '@storybook/react';
import { NumberField } from './NumberField';

const meta: Meta<typeof NumberField> = {
  title: 'Arcade-UI/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: {
    label: 'Credits',
    defaultValue: 10,
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {};

export const WithRange: Story = {
  args: {
    label: 'Lives',
    defaultValue: 3,
    min: 0,
    max: 9,
    step: 1,
  },
};

export const StepTen: Story = {
  args: {
    label: 'Score',
    defaultValue: 100,
    min: 0,
    max: 999,
    step: 10,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Credits',
    defaultValue: 10,
    disabled: true,
  },
};
