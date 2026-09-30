import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './InventoryChip.module.css';

export interface InventoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  qty?: number;
  selected?: boolean;
}

export function InventoryChip({
  label,
  icon,
  qty,
  selected = false,
  className,
  type = 'button',
  ...props
}: InventoryChipProps) {
  const classes = [styles.chip, selected ? styles.selected : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      data-selected={selected || undefined}
      aria-pressed={selected}
      {...props}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{label}</span>
      {qty !== undefined ? <span className={styles.qty}>x{qty}</span> : null}
    </button>
  );
}
