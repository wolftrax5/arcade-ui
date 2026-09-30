import type { Meta, StoryObj } from '@storybook/react';
import { InventoryChip } from './InventoryChip';

const SwordIcon = () => (
  <span aria-hidden style={{ fontFamily: 'VT323, monospace', fontSize: 14 }}>
    ⚔
  </span>
);

const PotionIcon = () => (
  <span aria-hidden style={{ fontFamily: 'VT323, monospace', fontSize: 14 }}>
    ⚗
  </span>
);

const meta: Meta<typeof InventoryChip> = {
  title: 'Arcade-UI/InventoryChip',
  component: InventoryChip,
  tags: ['autodocs'],
  args: {
    label: 'Potion',
    qty: 3,
    selected: false,
  },
};

export default meta;
type Story = StoryObj<typeof InventoryChip>;

export const Plain: Story = {
  args: {
    icon: undefined,
    qty: undefined,
    label: 'Key',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Iron Sword',
    icon: <SwordIcon />,
    qty: undefined,
  },
};

export const Stacked: Story = {
  args: {
    label: 'Hi-Potion',
    icon: <PotionIcon />,
    qty: 9,
  },
};

export const Selected: Story = {
  args: {
    label: 'Iron Sword',
    icon: <SwordIcon />,
    selected: true,
  },
};
