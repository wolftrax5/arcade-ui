import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Arcade-UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    size: 40,
    variant: 'square',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['square', 'rounded', 'circular'],
    },
    size: { control: { type: 'range', min: 16, max: 96, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Letter: Story = {
  args: {
    alt: 'Player One',
  },
};

export const CustomChild: Story = {
  args: {
    children: 'P1',
    variant: 'rounded',
  },
};

export const Icon: Story = {
  args: {
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        aria-hidden
        width="60%"
        height="60%"
        shapeRendering="crispEdges"
      >
        <path
          fill="currentColor"
          d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z"
        />
      </svg>
    ),
    variant: 'circular',
  },
};

export const Fallback: Story = {
  args: {
    src: '/broken-image.png',
    alt: 'Travis Howard',
  },
};

export const GenericIcon: Story = {
  args: {},
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} variant="square" alt="Square" />
      <Avatar {...args} variant="rounded" alt="Rounded" />
      <Avatar {...args} variant="circular" alt="Circular" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar alt="Small" size={24} variant="circular" />
      <Avatar alt="Medium" size={40} variant="circular" />
      <Avatar alt="Large" size={64} variant="circular" />
    </div>
  ),
};
