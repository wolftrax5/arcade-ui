import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export function Checkbox({
  label,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

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
      />
      <span className={styles.box} aria-hidden />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
}
