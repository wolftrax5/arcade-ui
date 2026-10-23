import type { Meta, StoryObj } from '@storybook/react';
import { VariablesPanel } from './VariablesPanel';
import { ArcadeButton } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { PixelInput } from '../PixelInput/PixelInput';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import { RetroBadge } from '../RetroBadge/RetroBadge';
import { Slider } from '../Slider/Slider';
import { InventoryChip } from '../InventoryChip/InventoryChip';

const meta: Meta<typeof VariablesPanel> = {
  title: 'Arcade-UI/VariablesPanel',
  component: VariablesPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof VariablesPanel>;

export const Default: Story = {};

/**
 * Rendered next to one of each control so color, mode, type style, and
 * sound changes can be verified together.
 */
export const WithPreview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '320px 1fr' }}>
      <VariablesPanel />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <ArcadeButton variant="primary">Insert Coin</ArcadeButton>
          <ArcadeButton variant="danger">Game Over</ArcadeButton>
          <ArcadeButton variant="start">Press Start</ArcadeButton>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <RetroBadge status="idle">Idle</RetroBadge>
          <RetroBadge status="ok">Ready</RetroBadge>
          <RetroBadge status="warn">Low HP</RetroBadge>
          <RetroBadge status="alert">Alert</RetroBadge>
        </div>
        <PixelInput label="Initials" placeholder="AAA" maxLength={3} />
        <Checkbox label="Enable turbo" defaultChecked />
        <RadioGroup
          label="Difficulty"
          defaultValue="normal"
          options={[
            { value: 'easy', label: 'Easy' },
            { value: 'normal', label: 'Normal' },
            { value: 'hard', label: 'Hard' },
          ]}
        />
        <Slider label="Volume" defaultValue={60} />
        <div style={{ display: 'flex', gap: 10 }}>
          <InventoryChip label="Coin" qty={12} icon="$" />
          <InventoryChip label="Potion" qty={3} icon="+" selected />
        </div>
      </div>
    </div>
  ),
};
