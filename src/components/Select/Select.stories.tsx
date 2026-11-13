import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const difficulty = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
  { value: 'nightmare', label: 'Nightmare', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Arcade-UI/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Difficulty',
    options: difficulty,
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    defaultValue: 'normal',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Choose difficulty',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'normal',
    disabled: true,
  },
};
