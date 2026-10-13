import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];

const meta: Meta<typeof RadioGroup> = {
  title: 'Arcade-UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Difficulty',
    options: difficultyOptions,
    defaultValue: 'normal',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const Easy: Story = {
  args: {
    defaultValue: 'easy',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
