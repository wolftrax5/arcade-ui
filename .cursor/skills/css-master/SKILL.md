---
name: css-master
description: Build Arcade-UI components CSS-first with thin TypeScript wrappers. Use when creating or editing React UI components, CSS Modules, visual states, variants, animations, or when the user asks for CSS-driven styling with minimal TS.
---

# CSS Master (Arcade-UI)

Prefer CSS for look and interaction. Keep TypeScript thin: props, composition, and a11y only.

For new files, still run `pnpm scaffold ComponentName` first (see `scaffold-arcade-component`).

## Rules

1. **Styles live in CSS Modules** — sibling `*.module.css` only. No Tailwind, CSS-in-JS, or utility frameworks.
2. **TS does not style** — no inline `style={{}}` except rare measured layout values. No style maps beyond class name lookup.
3. **States in CSS** — hover, active, focus, disabled, selected via `:hover`, `:active`, `:focus-visible`, `:disabled`, and `[data-*]` selectors.
4. **Variants via classes or `data-*`** — prefer `data-variant="danger"` + CSS over branching JSX trees.
5. **Motion in CSS** — transitions/animations with `steps()` timing, not JS timers or spring libs.
6. **Tokens first** — use `src/styles/retro-theme.css` (`--arcade-*`). Do not hardcode palette hex values in components.

## TypeScript budget

Allowed:
- Prop types and defaults
- Spreading native element attributes
- Composing class names from the CSS Module
- Wiring `aria-*`, `htmlFor`, `id`, refs
- Conditional render of *structure* (icon present? label present?) — not visual style

Not allowed:
- Computing colors, shadows, sizes, or transforms in TS
- `useEffect` / state for hover, press, or focus visuals (use CSS / `:focus-within`)
- Large className ternary trees when a `data-*` attribute would do

## Pixel CSS (required)

From `.mcp/dev-skill.json`:

- Fonts: `--arcade-font-display` (controls), `--arcade-font-body` (copy)
- Anti-alias: `image-rendering: pixelated`; `-webkit-font-smoothing: none`; `font-smooth: never`
- Borders: never CSS `border` / soft `border-radius` / blur shadows — use `box-shadow` with `--arcade-pixel-border` and `--arcade-drop-shadow`
- Press: active state `translateY` down and collapse drop-shadow; `steps()` timing only

## Pattern

```tsx
// Thin wrapper — classes + data attrs, markup only
export function ArcadeButton({ variant = 'primary', className, children, ...props }: Props) {
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      data-variant={variant}
      {...props}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
}
```

```css
.button {
  /* tokens, pixel border, steps() transition */
  box-shadow: var(--arcade-pixel-border), var(--arcade-drop-shadow);
}

.button[data-variant='danger'] {
  background: var(--arcade-red);
}

.button:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: var(--arcade-pixel-border);
}
```

## Checklist before done

- [ ] Visual behavior is expressible without reading the `.tsx` logic
- [ ] No Tailwind / inline style sprawl
- [ ] Variants/states use CSS selectors
- [ ] Pixel border + press motion correct
- [ ] Storybook story covers the visual variants
