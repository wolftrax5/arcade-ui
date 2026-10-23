import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './InventoryChip.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';
import { useArcadeSound } from '../../theme/ThemeProvider';

export interface InventoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  qty?: number;
  selected?: boolean;
  /** Local type style for chip text. Defaults to `caption`. */
  textStyle?: TextStyle;
  /** Opt out of the arcade press sound for this instance. */
  sound?: boolean;
}

export function InventoryChip({
  label,
  icon,
  qty,
  selected = false,
  className,
  type = 'button',
  textStyle = 'caption',
  sound,
  disabled,
  onClick,
  ...props
}: InventoryChipProps) {
  const classes = [
    styles.chip,
    selected ? styles.selected : undefined,
    textStyleClass(textStyle),
    className,
  ]
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
      data-selected={selected || undefined}
      aria-pressed={selected}
      disabled={disabled}
      onClick={handleClick}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{label}</span>
      {qty !== undefined ? <span className={styles.qty}>x{qty}</span> : null}
    </button>
  );
}
