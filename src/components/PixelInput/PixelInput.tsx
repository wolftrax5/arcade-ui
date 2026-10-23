import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './PixelInput.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';

export interface PixelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  /** Type style for the input value. Defaults to `display`. */
  textStyle?: TextStyle;
  /** Type style for the label. Defaults to `label`. */
  labelStyle?: TextStyle;
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
  textStyle = 'display',
  labelStyle = 'label',
  ...props
}: PixelInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(String(defaultValue ?? ''));
  const [cursorLeft, setCursorLeft] = useState(8);

  const displayValue = value !== undefined ? String(value) : uncontrolled;
  const valueStyleClass = textStyleClass(textStyle);

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
        <label
          className={[styles.label, textStyleClass(labelStyle)].join(' ')}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <div className={styles.field} data-focused={focused || undefined}>
        <span
          ref={mirrorRef}
          className={[styles.mirror, valueStyleClass].join(' ')}
          aria-hidden
        >
          {displayValue}
        </span>
        <input
          {...props}
          id={inputId}
          className={[styles.input, valueStyleClass].join(' ')}
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
