import type { Preview } from '@storybook/react';
import arcadeTheme from './theme';
import '../src/styles/retro-theme.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cabinet',
      values: [
        { name: 'cabinet', value: '#0a0a12' },
        { name: 'scanline', value: '#141422' },
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
        order: ['Arcade-UI', ['Introduction', 'ArcadeButton', 'PixelInput', 'RetroBadge', 'InventoryChip']],
      },
    },
  },
};

export default preview;
