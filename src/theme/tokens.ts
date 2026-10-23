/**
 * Arcade-UI theme tokens.
 *
 * This is the TypeScript source of truth for the color collection. The same
 * values are mirrored in `src/styles/retro-theme.css` so a host can set
 * `data-theme` without the provider.
 *
 * Keep these keys in sync with `src/styles/retro-theme.css`.
 */

export const colorTokenKeys = [
  // Accents
  'red',
  'cyan',
  'yellow',
  'purple',
  'orange',
  // Surfaces
  'black',
  'ink',
  'panel',
  'muted',
  'white',
  'shadow',
  // Text roles
  'fg',
  'fgOnAccent',
  'fgOnDanger',
] as const;

export type ColorToken = (typeof colorTokenKeys)[number];

export type ColorMap = Record<ColorToken, string>;

export type ThemeMode = 'dark' | 'light';

export type ColorCollection = Record<ThemeMode, ColorMap>;

export const colorTokenGroups: Readonly<
  Record<'accents' | 'surfaces' | 'text', readonly ColorToken[]>
> = {
  accents: ['red', 'cyan', 'yellow', 'purple', 'orange'],
  surfaces: ['black', 'ink', 'panel', 'muted', 'white', 'shadow'],
  text: ['fg', 'fgOnAccent', 'fgOnDanger'],
};

export const defaultColors: ColorCollection = {
  dark: {
    red: '#ff0044',
    cyan: '#00ffcc',
    yellow: '#ffd700',
    purple: '#aa00ff',
    orange: '#ff8800',
    black: '#050508',
    ink: '#0a0a12',
    panel: '#141422',
    muted: '#2a2a3a',
    white: '#f4f4f0',
    shadow: '#000000',
    fg: '#f4f4f0',
    fgOnAccent: '#0a0a12',
    fgOnDanger: '#f4f4f0',
  },
  light: {
    red: '#d60036',
    cyan: '#00b5a0',
    yellow: '#d49800',
    purple: '#8e00d6',
    orange: '#d66600',
    black: '#050508',
    ink: '#ece8d4',
    panel: '#ddd8c0',
    muted: '#a89f80',
    white: '#ffffff',
    shadow: '#262520',
    fg: '#0a0a12',
    fgOnAccent: '#0a0a12',
    fgOnDanger: '#f4f4f0',
  },
};

export const textStyles = ['display', 'label', 'caption', 'body'] as const;
export type TextStyle = (typeof textStyles)[number];

export function textStyleClass(style: TextStyle): string {
  return `arcade-style-${style}`;
}

const kebabCache = new Map<ColorToken, string>();

function toKebab(token: ColorToken): string {
  const cached = kebabCache.get(token);
  if (cached) {
    return cached;
  }
  const result = token.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
  kebabCache.set(token, result);
  return result;
}

/** CSS custom property name for a token, e.g. `--arcade-fg-on-accent`. */
export function cssVar(token: ColorToken): string {
  return `--arcade-${toKebab(token)}`;
}
