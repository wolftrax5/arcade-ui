import type { Meta, StoryObj } from '@storybook/react';
import { PixelInput } from './PixelInput';

const meta: Meta<typeof PixelInput> = {
  title: 'Arcade-UI/PixelInput',
  component: PixelInput,
  tags: ['autodocs'],
  args: {
    label: 'Player Name',
    placeholder: 'AAA',
  },
};

export default meta;
type Story = StoryObj<typeof PixelInput>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: 'WOLF',
  },
};

export const Password: Story = {
  args: {
    label: 'Continue Code',
    type: 'password',
    placeholder: '****',
  },
};
