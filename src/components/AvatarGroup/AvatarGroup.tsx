import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from 'react';
import styles from './AvatarGroup.module.css';
import { Avatar, type AvatarProps, type AvatarVariant } from '../Avatar/Avatar';
import { textStyleClass } from '../../theme/tokens';

export type AvatarGroupSpacing = 'medium' | 'small' | number;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to render before showing the surplus avatar. Defaults to `5`. */
  max?: number;
  /**
   * Total number of avatars (including hidden ones). Drives the surplus number
   * shown when `total > max`. When omitted, the surplus falls back to the
   * number of children beyond `max - 1`.
   */
  total?: number;
  /** Overlap distance between neighbouring avatars. */
  spacing?: AvatarGroupSpacing;
  /** Custom renderer for the surplus avatar. */
  renderSurplus?: (surplus: number) => ReactNode;
  /** Variant propagated to every child Avatar that does not set its own. Defaults to `circular` (matches MUI). */
  variant?: AvatarVariant;
  /** Size propagated to every child Avatar that does not set its own. */
  size?: number;
}

const spacingPreset: Record<Exclude<AvatarGroupSpacing, number>, number> = {
  medium: 10,
  small: 4,
};

function resolveSpacing(spacing: AvatarGroupSpacing | undefined): number {
  if (spacing === undefined) return spacingPreset.medium;
  if (typeof spacing === 'number') return spacing;
  return spacingPreset[spacing];
}

function isAvatarElement(node: ReactNode): node is ReactElement<AvatarProps> {
  return isValidElement(node);
}

export function AvatarGroup({
  max = 5,
  total,
  spacing,
  renderSurplus,
  variant = 'circular',
  size,
  className,
  style,
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(isAvatarElement);
  const effectiveTotal = total ?? avatars.length;
  const hasSurplus = effectiveTotal > max;
  const visibleCount = hasSurplus ? Math.max(0, max - 1) : avatars.length;
  const surplus = hasSurplus ? effectiveTotal - visibleCount : 0;

  // MUI semantic: the FIRST child in source order should render on TOP of
  // the stack with the surplus on the LEFT. We take the first `visibleCount`
  // children, then render them right-to-left (reversed) along with the
  // surplus at the front — so later-in-DOM elements naturally paint on top.
  const visible = avatars.slice(0, visibleCount).slice().reverse();

  const overlapStyle: CSSProperties = {
    ...(style ?? {}),
    ['--arcade-avatar-overlap' as string]: `${resolveSpacing(spacing)}px`,
  };

  const propagate = (child: ReactElement<AvatarProps>): ReactElement<AvatarProps> => {
    const existing = child.props;
    const next: Partial<AvatarProps> = {};
    if (existing.variant === undefined) next.variant = variant;
    if (existing.size === undefined && size !== undefined) next.size = size;
    if (Object.keys(next).length === 0) return child;
    return cloneElement(child, next);
  };

  const surplusNode = hasSurplus
    ? renderSurplus
      ? renderSurplus(surplus)
      : (
          <Avatar variant={variant} size={size} aria-label={`+${surplus} more`}>
            <span className={[styles.surplus, textStyleClass('caption')].join(' ')}>
              +{surplus}
            </span>
          </Avatar>
        )
    : null;

  return (
    <div
      {...props}
      className={[styles.group, className].filter(Boolean).join(' ')}
      style={overlapStyle}
    >
      {/* Surplus is painted first (bottom), so it sits on the LEFT visually. */}
      {surplusNode ? <div>{surplusNode}</div> : null}
      {visible.map((child, index) => (
        <div key={child.key ?? index}>{propagate(child)}</div>
      ))}
    </div>
  );
}
