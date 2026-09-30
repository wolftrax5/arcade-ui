import type { Meta, StoryObj } from '@storybook/react';
import { ArcadeButton } from './Button';

const meta: Meta<typeof ArcadeButton> = {
  title: 'Arcade-UI/ArcadeButton',
  component: ArcadeButton,
  tags: ['autodocs'],
  args: {
    children: 'Insert Coin',
    variant: 'primary',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'danger', 'start'],
    },
    onClick: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof ArcadeButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Insert Coin',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Game Over',
  },
};

export const Start: Story = {
  args: {
    variant: 'start',
    children: 'Press Start',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Locked',
  },
};
