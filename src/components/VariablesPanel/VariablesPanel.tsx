import type { ChangeEvent, HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import styles from './VariablesPanel.module.css';
import {
  type ColorToken,
  colorTokenGroups,
  textStyleClass,
} from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';

export interface VariablesPanelProps extends HTMLAttributes<HTMLElement> {
  /** Panel title. Defaults to "Variables". */
  title?: string;
  /** Hide the light/dark switch. Default: visible. */
  showModeSwitch?: boolean;
  /** Hide the sound toggle. Default: visible. */
  showSoundSwitch?: boolean;
}

// Human-readable labels keep the panel approachable while the CSS variable
// name below stays faithful to the token.
const tokenLabel: Record<ColorToken, string> = {
  red: 'Red',
  cyan: 'Cyan',
  yellow: 'Yellow',
  purple: 'Purple',
  orange: 'Orange',
  black: 'Black',
  ink: 'Ink / Background',
  panel: 'Panel',
  muted: 'Muted',
  white: 'White',
  shadow: 'Shadow',
  fg: 'Foreground',
  fgOnAccent: 'FG on Accent',
  fgOnDanger: 'FG on Danger',
};

const groupLabel: Record<keyof typeof colorTokenGroups, string> = {
  accents: 'Accents',
  surfaces: 'Surfaces',
  text: 'Text',
};

export function VariablesPanel({
  title = 'Variables',
  showModeSwitch = true,
  showSoundSwitch = true,
  className,
  ...props
}: VariablesPanelProps) {
  const {
    mode,
    setMode,
    colors,
    setColor,
    resetColors,
    sound,
    setSound,
    reducedMotion,
  } = useTheme();

  const active = colors[mode];

  const handleColorChange = (token: ColorToken) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setColor(token, event.target.value);
    };

  return (
    <section
      {...props}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      aria-label={title}
    >
      <h3 className={[styles.title, textStyleClass('label')].join(' ')}>
        {title}
      </h3>

      {showModeSwitch ? (
        <div className={styles.row}>
          <span className={[styles.rowLabel, textStyleClass('caption')].join(' ')}>
            Theme
          </span>
          <div
            className={[styles.toggle, textStyleClass('caption')].join(' ')}
            role="group"
            aria-label="Theme mode"
          >
            <button
              type="button"
              data-active={mode === 'dark'}
              onClick={() => setMode('dark')}
            >
              Dark
            </button>
            <button
              type="button"
              data-active={mode === 'light'}
              onClick={() => setMode('light')}
            >
              Light
            </button>
          </div>
        </div>
      ) : null}

      {showSoundSwitch ? (
        <div className={styles.row}>
          <span className={[styles.rowLabel, textStyleClass('caption')].join(' ')}>
            Sound
          </span>
          <div
            className={[styles.toggle, textStyleClass('caption')].join(' ')}
            role="group"
            aria-label="Sound"
          >
            <button
              type="button"
              data-active={sound && !reducedMotion}
              disabled={reducedMotion}
              onClick={() => setSound(true)}
            >
              On
            </button>
            <button
              type="button"
              data-active={!sound || reducedMotion}
              disabled={reducedMotion}
              onClick={() => setSound(false)}
            >
              Off
            </button>
          </div>
        </div>
      ) : null}

      {reducedMotion ? (
        <p className={[styles.hint, textStyleClass('caption')].join(' ')}>
          Reduced motion is on — sound disabled.
        </p>
      ) : null}

      {(Object.keys(colorTokenGroups) as Array<keyof typeof colorTokenGroups>).map(
        (groupKey) => (
          <div className={styles.group} key={groupKey}>
            <span
              className={[styles.groupTitle, textStyleClass('caption')].join(' ')}
            >
              {groupLabel[groupKey]}
            </span>
            {colorTokenGroups[groupKey].map((token) => (
              <ColorRow
                key={token}
                token={token}
                label={tokenLabel[token]}
                value={active[token]}
                onColorChange={handleColorChange(token)}
                onHexCommit={(value) => setColor(token, value)}
              />
            ))}
          </div>
        ),
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={[styles.reset, textStyleClass('caption')].join(' ')}
          onClick={resetColors}
        >
          Reset {mode}
        </button>
      </div>
    </section>
  );
}

interface ColorRowProps {
  token: ColorToken;
  label: string;
  value: string;
  onColorChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onHexCommit: (value: string) => void;
}

/**
 * One row of the panel. Keeps the hex input as a local draft so partial
 * typing doesn't reset the caret, and resyncs whenever the committed value
 * changes (mode switch, swatch click, reset).
 */
function ColorRow({ token, label, value, onColorChange, onHexCommit }: ColorRowProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setDraft(next);
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(next.trim())) {
      onHexCommit(next.trim());
    }
  };

  return (
    <div className={styles.colorRow}>
      <input
        type="color"
        className={styles.swatch}
        value={value}
        aria-label={`${label} color picker`}
        onChange={onColorChange}
      />
      <span
        className={[styles.tokenName, textStyleClass('caption')].join(' ')}
        title={label}
        id={`arcade-var-${token}`}
      >
        {label}
      </span>
      <input
        type="text"
        className={[styles.hex, textStyleClass('caption')].join(' ')}
        value={draft}
        aria-labelledby={`arcade-var-${token}`}
        spellCheck={false}
        onChange={handleHexChange}
      />
    </div>
  );
}
