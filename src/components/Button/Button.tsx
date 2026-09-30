import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ArcadeButtonVariant = 'primary' | 'danger' | 'start';

export interface ArcadeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ArcadeButtonVariant;
  children?: ReactNode;
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
  ...props
}: ArcadeButtonProps) {
  const classes = [styles.button, variantClass[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} data-variant={variant} {...props}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
