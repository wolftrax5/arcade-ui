import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Arcade-UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Sound FX',
    disabled: false,
    defaultChecked: false,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Music On',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Locked',
  },
};
