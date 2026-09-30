import type { HTMLAttributes, ReactNode } from 'react';
import styles from './{{name}}.module.css';

export interface {{name}}Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function {{name}}({ className, children, ...props }: {{name}}Props) {
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
