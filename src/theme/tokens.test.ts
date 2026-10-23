import { describe, expect, it } from 'vitest';
import { colorTokenKeys, cssVar, defaultColors } from './tokens';

describe('tokens', () => {
  it('exposes dark and light modes', () => {
    expect(Object.keys(defaultColors).sort()).toEqual(['dark', 'light']);
  });

  it('contains every token key in both modes', () => {
    for (const key of colorTokenKeys) {
      expect(defaultColors.dark[key], `dark.${key}`).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      expect(defaultColors.light[key], `light.${key}`).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    }
  });

  it('converts tokens to CSS variable names', () => {
    expect(cssVar('red')).toBe('--arcade-red');
    expect(cssVar('fgOnAccent')).toBe('--arcade-fg-on-accent');
    expect(cssVar('fgOnDanger')).toBe('--arcade-fg-on-danger');
    expect(cssVar('ink')).toBe('--arcade-ink');
  });
});
