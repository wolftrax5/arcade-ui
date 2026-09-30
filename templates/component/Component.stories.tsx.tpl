import type { Meta, StoryObj } from '@storybook/react';
import { {{name}} } from './{{name}}';

const meta: Meta<typeof {{name}}> = {
  title: 'Arcade-UI/{{name}}',
  component: {{name}},
  tags: ['autodocs'],
  args: {
    children: '{{name}}',
  },
};

export default meta;
type Story = StoryObj<typeof {{name}}>;

export const Default: Story = {};
