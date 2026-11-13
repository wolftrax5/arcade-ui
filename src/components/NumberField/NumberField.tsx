import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useId,
  useState,
} from 'react';
import styles from './NumberField.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface NumberFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange'
  > {
  label?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Increment per stepper click or arrow-key press. Defaults to `1`. */
  step?: number;
  onChange?: (value: number, event?: SyntheticEvent<HTMLInputElement>) => void;
  /** Type style for the input value. Defaults to `display`. */
  textStyle?: TextStyle;
  /** Type style for the label. Defaults to `label`. */
  labelStyle?: TextStyle;
  /** Opt out of the press sound for this instance. */
  sound?: boolean;
}

function clamp(n: number, min: number | undefined, max: number | undefined): number {
  let next = n;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
}

function seed(
  defaultValue: number | undefined,
  min: number | undefined,
): number {
  if (defaultValue !== undefined) return defaultValue;
  if (min !== undefined) return min;
  return 0;
}

export function NumberField({
  label,
  className,
  id,
  value,
  defaultValue,
  min,
  max,
  step = 1,
  disabled,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  textStyle = 'display',
  labelStyle = 'label',
  sound,
  ...props
}: NumberFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const play = useArcadeSound(sound);
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState<number>(() => clamp(seed(defaultValue, min), min, max));

  const current = value !== undefined ? value : internal;
  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  const commit = (next: number, event?: SyntheticEvent<HTMLInputElement>) => {
    const clamped = clamp(next, min, max);
    if (value === undefined) {
      setInternal(clamped);
    }
    onChange?.(clamped, event);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === '' || raw === '-') {
      // Allow transient empty / negative-sign while typing; keep internal state at min/0.
      const fallback = min ?? 0;
      if (value === undefined) {
        setInternal(fallback);
      }
      onChange?.(fallback, event);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      return;
    }
    commit(parsed, event);
  };

  const bumpBy = (delta: number, event?: SyntheticEvent<HTMLInputElement>) => {
    if (disabled) return;
    commit(current + delta, event);
    play('press');
  };

  const handleIncrement = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    bumpBy(step);
  };

  const handleDecrement = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    bumpBy(-step);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        bumpBy(step, event);
        break;
      case 'ArrowDown':
        event.preventDefault();
        bumpBy(-step, event);
        break;
      case 'PageUp':
        event.preventDefault();
        bumpBy(step * 10, event);
        break;
      case 'PageDown':
        event.preventDefault();
        bumpBy(-step * 10, event);
        break;
      case 'Home':
        if (min !== undefined) {
          event.preventDefault();
          commit(min, event);
          play('press');
        }
        break;
      case 'End':
        if (max !== undefined) {
          event.preventDefault();
          commit(max, event);
          play('press');
        }
        break;
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      {label ? (
        <label
          className={[styles.label, textStyleClass(labelStyle)].join(' ')}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <div className={styles.row} data-disabled={disabled || undefined}>
        <button
          type="button"
          className={[styles.stepper, textStyleClass('display')].join(' ')}
          onClick={handleDecrement}
          disabled={disabled || atMin}
          aria-label="Decrement"
        >
          -
        </button>
        <div className={styles.field} data-focused={focused || undefined}>
          <input
            {...props}
            id={inputId}
            type="number"
            className={[styles.input, textStyleClass(textStyle)].join(' ')}
            value={current}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            inputMode="numeric"
          />
        </div>
        <button
          type="button"
          className={[styles.stepper, textStyleClass('display')].join(' ')}
          onClick={handleIncrement}
          disabled={disabled || atMax}
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
}
