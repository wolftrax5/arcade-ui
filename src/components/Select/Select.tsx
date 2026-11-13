import {
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
  useState,
} from 'react';
import styles from './Select.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  /** Type style for the selected value. Defaults to `display`. */
  textStyle?: TextStyle;
  /** Type style for the label. Defaults to `label`. */
  labelStyle?: TextStyle;
  /** Opt out of the select sound for this instance. */
  sound?: boolean;
}

export function Select({
  label,
  options,
  placeholder,
  className,
  id,
  value,
  defaultValue,
  disabled,
  onChange,
  onFocus,
  onBlur,
  textStyle = 'display',
  labelStyle = 'label',
  sound,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const play = useArcadeSound(sound);
  const [focused, setFocused] = useState(false);

  // Track whether the current value is the placeholder so the muted color can apply.
  const isPlaceholder =
    placeholder !== undefined &&
    (value === '' || (value === undefined && (defaultValue === '' || defaultValue === undefined)));

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!disabled) {
      play('select');
    }
    onChange?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLSelectElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLSelectElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      {label ? (
        <label
          className={[styles.label, textStyleClass(labelStyle)].join(' ')}
          htmlFor={selectId}
        >
          {label}
        </label>
      ) : null}
      <div
        className={styles.field}
        data-focused={focused || undefined}
        data-disabled={disabled || undefined}
      >
        <select
          {...props}
          id={selectId}
          className={[
            styles.select,
            textStyleClass(textStyle),
            isPlaceholder ? styles.placeholder : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          value={value}
          defaultValue={defaultValue ?? (placeholder !== undefined ? '' : undefined)}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {placeholder !== undefined ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.caret} aria-hidden />
      </div>
    </div>
  );
}
