import type { HTMLAttributes, ReactNode } from 'react';
import styles from './RetroBadge.module.css';

export type RetroBadgeStatus = 'idle' | 'ok' | 'warn' | 'alert';

export interface RetroBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: RetroBadgeStatus;
  children?: ReactNode;
}

const statusClass: Record<RetroBadgeStatus, string> = {
  idle: styles.idle,
  ok: styles.ok,
  warn: styles.warn,
  alert: styles.alert,
};

export function RetroBadge({
  status = 'idle',
  className,
  children,
  ...props
}: RetroBadgeProps) {
  const classes = [styles.badge, statusClass[status], className].filter(Boolean).join(' ');

  return (
    <span className={classes} data-status={status} {...props}>
      <span className={styles.lamp} aria-hidden />
      <span className={styles.text}>{children}</span>
    </span>
  );
}
