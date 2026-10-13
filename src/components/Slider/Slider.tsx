import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import styles from './Slider.module.css';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Slider({
  label,
  className,
  id,
  disabled,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
    >
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        id={inputId}
        type="range"
        className={styles.input}
        disabled={disabled}
      />
    </div>
  );
}
