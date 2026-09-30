# Arcade-UI

16-bit retro React component library. Phase 1 ships cabinet controls: `ArcadeButton`, `PixelInput`, `RetroBadge`, and `InventoryChip`.

## Stack

- React 18 + TypeScript
- CSS Modules (no Tailwind)
- Storybook 8 with a dark retro theme
- `tsup` for ESM, CommonJS, and declaration output
- Ponytail + Agent Skills for component scaffolding

## Install (consumers)

```bash
pnpm add @wolftrax/arcade-ui
```

```tsx
import { ArcadeButton } from '@wolftrax/arcade-ui';

export function Start() {
  return <ArcadeButton variant="start">Press Start</ArcadeButton>;
}
```

Styles inject automatically when the package is imported. Keep `react` and `react-dom` as peer dependencies.

Consumer implementation notes: [`.mcp/consume-skill.md`](.mcp/consume-skill.md).

## Develop

```bash
pnpm install
pnpm storybook
```

Storybook: [http://localhost:6006](http://localhost:6006)

```bash
pnpm build              # library → dist (ESM + CJS + .d.ts)
pnpm build-storybook    # docs → storybook-static
pnpm scaffold PixelMeter
```

## Aesthetic rules

1. Pixel monospace type (`Press Start 2P`, `VT323`)
2. `image-rendering: pixelated` and `font-smooth: never`
3. No CSS `border` — pixel edges are layered `box-shadow`
4. Active controls press down the Y-axis and collapse the drop-shadow

Agent build rules: [`.mcp/dev-skill.json`](.mcp/dev-skill.json).

## Publish

`package.json` exposes only `dist`:

```json
"files": ["dist"],
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" },
  "./dist": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" }
}
```

```bash
pnpm build
npm publish
```

## Vercel docs

`vercel.json` builds Storybook into `storybook-static`. Import the Git repo in Vercel; the install/build/output commands are already set.
