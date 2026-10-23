import type { Preview } from '@storybook/react';
import arcadeTheme from './theme';
import { withArcadeTheme } from './withArcadeTheme';
import '../src/styles/retro-theme.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cabinet',
      values: [
        { name: 'cabinet', value: '#0a0a12' },
        { name: 'scanline', value: '#141422' },
        { name: 'paper', value: '#ece8d4' },
      ],
    },
    docs: {
      theme: arcadeTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Arcade-UI',
          [
            'Introduction',
            'ArcadeButton',
            'PixelInput',
            'RetroBadge',
            'InventoryChip',
            'Checkbox',
            'RadioGroup',
            'Slider',
            'VariablesPanel',
          ],
        ],
      },
    },
  },
  globalTypes: {
    arcadeTheme: {
      name: 'Theme',
      description: 'Arcade-UI theme mode',
      defaultValue: 'dark',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
    arcadeSound: {
      name: 'Sound',
      description: 'Arcade-UI sound effects',
      defaultValue: 'on',
      toolbar: {
        icon: 'speaker',
        items: [
          { value: 'on', title: 'On' },
          { value: 'off', title: 'Off' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withArcadeTheme],
};

export default preview;
