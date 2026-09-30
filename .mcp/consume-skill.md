# Arcade-UI consume skill

Use this skill when adding Arcade-UI to an app, wiring 16-bit components, or matching the cabinet aesthetic from a consumer project.

## Install

```bash
pnpm add arcade-ui
```

Peer dependencies: `react` and `react-dom` >= 18.

Arcade-UI injects its CSS Modules at import time (`tsup` `injectStyle: true`). Do not copy component CSS into the host app.

## Import only the public barrel

```tsx
import {
  ArcadeButton,
  PixelInput,
  RetroBadge,
  InventoryChip,
} from 'arcade-ui';
```

Do not import from `arcade-ui/src`. The package `exports` map exposes `.` and `./dist` only.

## Fonts

Load pixel fonts once in the host document (or rely on the injected theme `@import`):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=block"
  rel="stylesheet"
/>
```

## Component map

| Component | Role |
| --- | --- |
| `ArcadeButton` | Cabinet button. Variants: `primary`, `danger`, `start`. |
| `PixelInput` | Rigid field with a blinking block cursor. |
| `RetroBadge` | Status lamp. Statuses: `idle`, `ok`, `warn`, `alert`. |
| `InventoryChip` | Selectable item chip. Optional `icon` and `qty`. |

## Aesthetic contract

Host apps should not restyle these components with utility CSS. If a wrapper is required, keep pixel edges intact:

- No `border` or blur shadows on Arcade-UI nodes
- Preserve `image-rendering: pixelated`
- Let `:active` translate on the Y-axis

## Example

```tsx
import { ArcadeButton, InventoryChip, PixelInput, RetroBadge } from 'arcade-ui';

export function ContinueScreen() {
  return (
    <section>
      <RetroBadge status="ok">Ready</RetroBadge>
      <PixelInput label="Initials" placeholder="AAA" maxLength={3} />
      <InventoryChip label="Coin" qty={12} />
      <ArcadeButton variant="start">Press Start</ArcadeButton>
    </section>
  );
}
```
