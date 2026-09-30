---
name: scaffold-arcade-component
description: Scaffold a new Arcade-UI React component with TypeScript, CSS Modules, Storybook stories, and 16-bit pixel CSS rules. Use when adding a component to Arcade-UI, running Ponytail scaffolding, or extending the library.
---

# Scaffold Arcade-UI components

## When to use

Use this skill whenever the user asks to add, generate, or scaffold a component in Arcade-UI.

## Command

Prefer the Ponytail scaffolder:

```bash
pnpm scaffold ComponentName
```

That command creates:

- `src/components/{Name}/{Name}.tsx`
- `src/components/{Name}/{Name}.module.css`
- `src/components/{Name}/{Name}.stories.tsx`

and appends public exports to `src/index.ts`.

## After scaffolding

1. Replace the placeholder root markup with the real component API.
2. Keep styles in the sibling CSS Module. No Tailwind.
3. Follow `.mcp/dev-skill.json`:
   - pixel font tokens
   - `image-rendering: pixelated` and `font-smooth: never`
   - `box-shadow` pixel borders, never CSS `border`
   - active Y-axis press that reduces the drop-shadow
4. Add Storybook stories under `Arcade-UI/{Name}` with `autodocs`.
5. Re-export props types from `src/index.ts` if the scaffolder type name is wrong.

## Templates

Source templates live in `templates/component/`. Edit those files when the default component shape should change for every future scaffold.
