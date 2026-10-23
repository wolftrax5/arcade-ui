import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './Checkbox.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  /** Type style for the label. Defaults to `label`. */
  textStyle?: TextStyle;
  /** Opt out of the toggle sound for this instance. */
  sound?: boolean;
}

export function Checkbox({
  label,
  className,
  id,
  disabled,
  textStyle = 'label',
  sound,
  onChange,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const play = useArcadeSound(sound);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      play('toggle');
    }
    onChange?.(event);
  };

  return (
    <label
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      htmlFor={inputId}
    >
      <input
        {...props}
        id={inputId}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={styles.box} aria-hidden />
      {label ? (
        <span className={[styles.label, textStyleClass(textStyle)].join(' ')}>
          {label}
        </span>
      ) : null}
    </label>
  );
}
