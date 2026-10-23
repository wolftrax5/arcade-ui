import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './Button.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export type ArcadeButtonVariant = 'primary' | 'danger' | 'start';

export interface ArcadeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ArcadeButtonVariant;
  children?: ReactNode;
  /** Local type style for the label. Defaults to `display`. */
  textStyle?: TextStyle;
  /** Opt out of the arcade press sound for this instance. */
  sound?: boolean;
}

const variantClass: Record<ArcadeButtonVariant, string> = {
  primary: styles.primary,
  danger: styles.danger,
  start: styles.start,
};

export function ArcadeButton({
  variant = 'primary',
  className,
  type = 'button',
  children,
  textStyle = 'display',
  sound,
  disabled,
  onClick,
  ...props
}: ArcadeButtonProps) {
  const classes = [styles.button, variantClass[variant], className]
    .filter(Boolean)
    .join(' ');

  const play = useArcadeSound(sound);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      play('press');
    }
    onClick?.(event);
  };

  return (
    <button
      {...props}
      type={type}
      className={classes}
      data-variant={variant}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className={[styles.label, textStyleClass(textStyle)].join(' ')}>
        {children}
      </span>
    </button>
  );
}
