import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './PixelInput.module.css';

export interface PixelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
}

export function PixelInput({
  label,
  className,
  id,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  ...props
}: PixelInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(String(defaultValue ?? ''));
  const [cursorLeft, setCursorLeft] = useState(8);

  const displayValue = value !== undefined ? String(value) : uncontrolled;

  useLayoutEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) {
      return;
    }
    setCursorLeft(Math.max(8, Math.min(mirror.offsetWidth + 8, 280)));
  }, [displayValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setUncontrolled(event.target.value);
    }
    onChange?.(event);
  };

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className={styles.field} data-focused={focused || undefined}>
        <span ref={mirrorRef} className={styles.mirror} aria-hidden>
          {displayValue}
        </span>
        <input
          {...props}
          id={inputId}
          className={styles.input}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        {focused ? (
          <span
            className={styles.cursor}
            style={{ left: cursorLeft }}
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
