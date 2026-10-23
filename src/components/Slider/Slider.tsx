import type {
  InputHTMLAttributes,
  KeyboardEvent,
  PointerEvent,
} from 'react';
import { useId } from 'react';
import styles from './Slider.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  /** Type style for the label. Defaults to `label`. */
  textStyle?: TextStyle;
  /** Opt out of the release sound for this instance. */
  sound?: boolean;
}

export function Slider({
  label,
  className,
  id,
  disabled,
  textStyle = 'label',
  sound,
  onPointerUp,
  onKeyUp,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const play = useArcadeSound(sound);

  const handlePointerUp = (event: PointerEvent<HTMLInputElement>) => {
    if (!disabled) {
      play('release');
    }
    onPointerUp?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    // Only play on keys that actually move the thumb.
    if (!disabled && isSliderKey(event.key)) {
      play('release');
    }
    onKeyUp?.(event);
  };

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
    >
      {label ? (
        <label
          className={[styles.label, textStyleClass(textStyle)].join(' ')}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <input
        {...props}
        id={inputId}
        type="range"
        className={styles.input}
        disabled={disabled}
        onPointerUp={handlePointerUp}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}

const sliderKeys = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

function isSliderKey(key: string): boolean {
  return sliderKeys.has(key);
}
