import type { Meta, StoryObj } from '@storybook/react';
import { RetroBadge } from './RetroBadge';

const meta: Meta<typeof RetroBadge> = {
  title: 'Arcade-UI/RetroBadge',
  component: RetroBadge,
  tags: ['autodocs'],
  args: {
    children: 'Standby',
    status: 'idle',
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['idle', 'ok', 'warn', 'alert'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RetroBadge>;

export const Idle: Story = {};

export const Ok: Story = {
  args: {
    status: 'ok',
    children: '1-Up',
  },
};

export const Warn: Story = {
  args: {
    status: 'warn',
    children: 'Low HP',
  },
};

export const Alert: Story = {
  args: {
    status: 'alert',
    children: 'Danger',
  },
};
