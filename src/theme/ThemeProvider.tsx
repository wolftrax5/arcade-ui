import {
  type CSSProperties,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type ColorCollection,
  type ColorMap,
  type ColorToken,
  type ThemeMode,
  colorTokenKeys,
  cssVar,
  defaultColors,
} from './tokens';
import { type SoundCue, playCue } from './sound';

type PartialColorMap = Partial<ColorMap>;
type Overrides = Record<ThemeMode, PartialColorMap>;

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Full merged color collection: defaults layered with the user's overrides. */
  colors: ColorCollection;
  /** Set a color on the currently active mode only. */
  setColor: (token: ColorToken, value: string) => void;
  /** Clear overrides for the active mode (defaults return). */
  resetColors: () => void;
  /** True when sound effects should play. Default: true. */
  sound: boolean;
  setSound: (sound: boolean) => void;
  /** True when the OS requests reduced motion. Silences sound and animations. */
  reducedMotion: boolean;
  /**
   * Play a cue through the provider's gates. Components should prefer the
   * `useArcadeSound` helper, which also respects per-instance opt-out.
   */
  play: (cue: SoundCue) => void;
}

const EMPTY_OVERRIDES: Overrides = { dark: {}, light: {} };

function emptyOverrides(): Overrides {
  return { dark: {}, light: {} };
}

function mergeColors(overrides: Overrides): ColorCollection {
  return {
    dark: { ...defaultColors.dark, ...overrides.dark },
    light: { ...defaultColors.light, ...overrides.light },
  };
}

const defaultContextValue: ThemeContextValue = {
  mode: 'dark',
  setMode: () => {},
  colors: mergeColors(EMPTY_OVERRIDES),
  setColor: () => {},
  resetColors: () => {},
  sound: true,
  setSound: () => {},
  reducedMotion: false,
  play: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

export interface ThemeProviderProps {
  children?: ReactNode;
  /** Initial mode. Defaults to `dark`. */
  defaultMode?: ThemeMode;
  /** Controlled mode. When set, `setMode` becomes a notifier only. */
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  /** Initial sound preference. Defaults to `true`. */
  defaultSound?: boolean;
  /** Controlled sound preference. */
  sound?: boolean;
  onSoundChange?: (sound: boolean) => void;
  /** Extra class on the wrapper div. */
  className?: string;
  /** Extra inline style on the wrapper (merged after overrides). */
  style?: CSSProperties;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    if (query.addEventListener) {
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }
    // Safari < 14 fallback.
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return reduced;
}

export function ThemeProvider({
  children,
  defaultMode = 'dark',
  mode: controlledMode,
  onModeChange,
  defaultSound = true,
  sound: controlledSound,
  onSoundChange,
  className,
  style,
}: ThemeProviderProps) {
  const [internalMode, setInternalMode] = useState<ThemeMode>(defaultMode);
  const mode = controlledMode ?? internalMode;

  const [internalSound, setInternalSound] = useState<boolean>(defaultSound);
  const sound = controlledSound ?? internalSound;

  const [overrides, setOverrides] = useState<Overrides>(emptyOverrides);

  const reducedMotion = usePrefersReducedMotion();

  const setMode = useCallback(
    (next: ThemeMode) => {
      if (controlledMode === undefined) {
        setInternalMode(next);
      }
      onModeChange?.(next);
    },
    [controlledMode, onModeChange],
  );

  const setSound = useCallback(
    (next: boolean) => {
      if (controlledSound === undefined) {
        setInternalSound(next);
      }
      onSoundChange?.(next);
    },
    [controlledSound, onSoundChange],
  );

  // Keep a ref to the active mode so setColor/resetColors stay stable across renders.
  const modeRef = useLatestRef(mode);

  const setColor = useCallback(
    (token: ColorToken, value: string) => {
      setOverrides((prev) => {
        const active = modeRef.current;
        return {
          ...prev,
          [active]: { ...prev[active], [token]: value },
        };
      });
    },
    [modeRef],
  );

  const resetColors = useCallback(() => {
    setOverrides((prev) => ({ ...prev, [modeRef.current]: {} }));
  }, [modeRef]);

  const colors = useMemo(() => mergeColors(overrides), [overrides]);

  const play = useCallback(
    (cue: SoundCue) => {
      if (!sound || reducedMotion) {
        return;
      }
      playCue(cue);
    },
    [sound, reducedMotion],
  );

  // Overrides for the active mode as inline CSS variables. We also hard-set
  // --arcade-bg here so that overriding `ink` cascades into `--arcade-bg`
  // (CSS variable inheritance already does that, but keeping it explicit
  // documents the intent).
  const inlineStyle = useMemo<CSSProperties>(() => {
    const next: Record<string, string> = {};
    const activeOverrides = overrides[mode];
    for (const key of colorTokenKeys) {
      const value = activeOverrides[key];
      if (value !== undefined) {
        next[cssVar(key)] = value;
      }
    }
    return { ...next, ...style } as CSSProperties;
  }, [mode, overrides, style]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      colors,
      setColor,
      resetColors,
      sound,
      setSound,
      reducedMotion,
      play,
    }),
    [mode, setMode, colors, setColor, resetColors, sound, setSound, reducedMotion, play],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-arcade-theme-root=""
        data-theme={mode}
        className={className}
        style={inlineStyle}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Tiny ref helper so callbacks can read the latest value without re-creating.
function useLatestRef<T>(value: T) {
  const [ref] = useState(() => ({ current: value }));
  ref.current = value;
  return ref;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Component helper: returns a `play` function that gates on the provider's
 * mute, reduced motion, and the component's own `sound` prop.
 */
export function useArcadeSound(instanceSound: boolean | undefined) {
  const { play } = useTheme();
  return useCallback(
    (cue: SoundCue) => {
      if (instanceSound === false) {
        return;
      }
      play(cue);
    },
    [play, instanceSound],
  );
}
