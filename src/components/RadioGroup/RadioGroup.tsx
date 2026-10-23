import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './RadioGroup.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue'> {
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  /** Type style for the legend and option labels. Defaults to `label`. */
  textStyle?: TextStyle;
  /** Opt out of the select sound for this instance. */
  sound?: boolean;
}

export function RadioGroup({
  label,
  options,
  className,
  name,
  value,
  defaultValue,
  disabled,
  onChange,
  textStyle = 'label',
  sound,
  ...props
}: RadioGroupProps) {
  const groupId = useId();
  const groupName = name ?? groupId;
  const play = useArcadeSound(sound);
  const styleClass = textStyleClass(textStyle);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!disabled && !event.target.disabled) {
      play('select');
    }
    onChange?.(event);
  };

  return (
    <fieldset
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      disabled={disabled}
    >
      {label ? (
        <legend className={[styles.legend, styleClass].join(' ')}>{label}</legend>
      ) : null}
      <div className={styles.options} role="presentation">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const optionDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={styles.option}
              data-disabled={optionDisabled || undefined}
              htmlFor={optionId}
            >
              <input
                {...props}
                id={optionId}
                type="radio"
                className={styles.input}
                name={groupName}
                value={option.value}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={
                  value === undefined ? defaultValue === option.value : undefined
                }
                disabled={optionDisabled}
                onChange={handleChange}
              />
              <span className={styles.dot} aria-hidden />
              <span className={[styles.label, styleClass].join(' ')}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
