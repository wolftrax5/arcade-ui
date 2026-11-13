import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar/Avatar';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Arcade-UI/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  args: {
    variant: 'circular',
    size: 40,
    max: 4,
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Max: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar alt="Remy Sharp" />
      <Avatar alt="Travis Howard" />
      <Avatar alt="Cindy Baker" />
      <Avatar alt="Agnes Walker" />
      <Avatar alt="Trevor Henderson" />
    </AvatarGroup>
  ),
};

export const Total: Story = {
  render: (args) => (
    <AvatarGroup {...args} total={24}>
      <Avatar alt="Remy Sharp" />
      <Avatar alt="Travis Howard" />
      <Avatar alt="Agnes Walker" />
      <Avatar alt="Trevor Henderson" />
    </AvatarGroup>
  ),
};

export const SpacingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AvatarGroup spacing="medium" variant="circular">
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
      </AvatarGroup>
      <AvatarGroup spacing="small" variant="circular">
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
      </AvatarGroup>
      <AvatarGroup spacing={20} variant="circular">
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
      </AvatarGroup>
    </div>
  ),
};

export const CustomSurplus: Story = {
  render: (args) => (
    <AvatarGroup
      {...args}
      total={4251}
      renderSurplus={(n) => (
        <Avatar variant={args.variant} size={args.size}>
          +{n.toString()[0]}k
        </Avatar>
      )}
    >
      <Avatar alt="Remy Sharp" />
      <Avatar alt="Travis Howard" />
      <Avatar alt="Agnes Walker" />
      <Avatar alt="Trevor Henderson" />
    </AvatarGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AvatarGroup variant="square" max={3}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
        <Avatar alt="Dana" />
      </AvatarGroup>
      <AvatarGroup variant="rounded" max={3}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
        <Avatar alt="Dana" />
      </AvatarGroup>
      <AvatarGroup variant="circular" max={3}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Chris" />
        <Avatar alt="Dana" />
      </AvatarGroup>
    </div>
  ),
};
