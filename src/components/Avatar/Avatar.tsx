import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useState,
} from 'react';
import styles from './Avatar.module.css';
import { textStyleClass, type TextStyle } from '../../theme/tokens';

export type AvatarVariant = 'square' | 'rounded' | 'circular';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  srcSet?: string;
  alt?: string;
  children?: ReactNode;
  /** Shape. Defaults to `square`. */
  variant?: AvatarVariant;
  /** Edge length in pixels. Defaults to `40`. */
  size?: number;
  /** Type style for letter fallbacks. Defaults to `label`. */
  textStyle?: TextStyle;
}

/** Tiny pixel silhouette used when there is no src, no children, and no alt. */
function GenericAvatarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path
        fill="currentColor"
        d="M6 3h4v1h1v3h-1v1H6V7H5V4h1V3zM4 10h8v1h1v3H3v-3h1v-1z"
      />
    </svg>
  );
}

export function Avatar({
  src,
  srcSet,
  alt,
  children,
  variant = 'square',
  size = 40,
  textStyle = 'label',
  className,
  style,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const canShowImage = Boolean(src || srcSet) && !imageFailed;

  let content: ReactNode;
  if (canShowImage) {
    content = (
      <img
        className={styles.image}
        src={src}
        srcSet={srcSet}
        alt={alt ?? ''}
        onError={() => setImageFailed(true)}
      />
    );
  } else if (children !== undefined && children !== null && children !== false) {
    content = <span className={styles.letter}>{children}</span>;
  } else if (alt && alt.trim().length > 0) {
    content = (
      <span className={[styles.letter, textStyleClass(textStyle)].join(' ')}>
        {alt.trim().charAt(0).toUpperCase()}
      </span>
    );
  } else {
    content = (
      <span className={styles.icon}>
        <GenericAvatarIcon />
      </span>
    );
  }

  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ['--arcade-avatar-size' as string]: `${size}px`,
  };

  return (
    <div
      {...props}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-variant={variant}
      style={mergedStyle}
      aria-label={!canShowImage && !children ? alt || undefined : undefined}
    >
      <div className={styles.frame}>{content}</div>
    </div>
  );
}
