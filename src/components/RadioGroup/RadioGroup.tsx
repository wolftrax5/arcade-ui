import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './RadioGroup.module.css';

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
  ...props
}: RadioGroupProps) {
  const groupId = useId();
  const groupName = name ?? groupId;

  return (
    <fieldset
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      disabled={disabled}
    >
      {label ? <legend className={styles.legend}>{label}</legend> : null}
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
                onChange={onChange}
              />
              <span className={styles.dot} aria-hidden />
              <span className={styles.label}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
