import type { Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import type { ThemeMode } from '../src/theme/tokens';

/**
 * Wraps every story in `ThemeProvider`. The Storybook toolbar seeds the
 * initial mode/sound and the provider is re-mounted whenever those change,
 * so clicks inside the `VariablesPanel` still own the state day-to-day.
 */
export const withArcadeTheme: Decorator = (Story, context) => {
  const mode = (context.globals.arcadeTheme as ThemeMode) ?? 'dark';
  const sound = context.globals.arcadeSound !== 'off';

  return (
    <ThemeProvider key={`${mode}-${sound}`} defaultMode={mode} defaultSound={sound}>
      <Story />
    </ThemeProvider>
  );
};
