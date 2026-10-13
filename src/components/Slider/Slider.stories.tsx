import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Arcade-UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 50,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const Low: Story = {
  args: {
    label: 'Music',
    defaultValue: 15,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 30,
  },
};
