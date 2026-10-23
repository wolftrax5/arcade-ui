import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { cssVar, defaultColors } from './tokens';

function Probe() {
  const theme = useTheme();
  return (
    <button
      type="button"
      data-testid="probe"
      data-mode={theme.mode}
      data-cyan={theme.colors[theme.mode].cyan}
      onClick={() => theme.setColor('cyan', '#123456')}
    >
      cyan
    </button>
  );
}

function ResetProbe() {
  const theme = useTheme();
  return (
    <>
      <button type="button" onClick={() => theme.setColor('red', '#aaaaaa')}>
        edit
      </button>
      <button type="button" onClick={() => theme.resetColors()}>
        reset
      </button>
      <span data-testid="red">{theme.colors[theme.mode].red}</span>
    </>
  );
}

describe('ThemeProvider', () => {
  it('writes data-theme on the wrapper', () => {
    const { container } = render(
      <ThemeProvider defaultMode="light">
        <span />
      </ThemeProvider>,
    );
    const root = container.querySelector('[data-arcade-theme-root]');
    expect(root?.getAttribute('data-theme')).toBe('light');
  });

  it('writes an override as an inline CSS variable on the wrapper', () => {
    const { container } = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    const root = container.querySelector<HTMLElement>('[data-arcade-theme-root]');
    expect(root).toBeTruthy();
    expect(root!.style.getPropertyValue(cssVar('cyan'))).toBe('');

    act(() => {
      screen.getByTestId('probe').click();
    });

    expect(root!.style.getPropertyValue(cssVar('cyan'))).toBe('#123456');
    expect(screen.getByTestId('probe').getAttribute('data-cyan')).toBe('#123456');
  });

  it('reset clears overrides for the active mode', () => {
    const { container, getByText, getByTestId } = render(
      <ThemeProvider>
        <ResetProbe />
      </ThemeProvider>,
    );
    const root = container.querySelector<HTMLElement>('[data-arcade-theme-root]');

    act(() => getByText('edit').click());
    expect(root!.style.getPropertyValue(cssVar('red'))).toBe('#aaaaaa');
    expect(getByTestId('red').textContent).toBe('#aaaaaa');

    act(() => getByText('reset').click());
    expect(root!.style.getPropertyValue(cssVar('red'))).toBe('');
    expect(getByTestId('red').textContent).toBe(defaultColors.dark.red);
  });

  it('scopes overrides to the active mode', () => {
    function TwoModeProbe() {
      const theme = useTheme();
      return (
        <>
          <button type="button" onClick={() => theme.setColor('cyan', '#111111')}>
            paint
          </button>
          <button type="button" onClick={() => theme.setMode('light')}>
            light
          </button>
          <span data-testid="dark">{theme.colors.dark.cyan}</span>
          <span data-testid="light">{theme.colors.light.cyan}</span>
        </>
      );
    }

    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TwoModeProbe />
      </ThemeProvider>,
    );

    act(() => getByText('paint').click());
    expect(getByTestId('dark').textContent).toBe('#111111');
    expect(getByTestId('light').textContent).toBe(defaultColors.light.cyan);

    act(() => getByText('light').click());
    // Overrides on dark do not leak into light.
    expect(getByTestId('light').textContent).toBe(defaultColors.light.cyan);
  });
});
