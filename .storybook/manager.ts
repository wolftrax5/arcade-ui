import { addons } from '@storybook/manager-api';
import arcadeTheme from './theme';

addons.setConfig({
  theme: arcadeTheme,
  panelPosition: 'bottom',
});
