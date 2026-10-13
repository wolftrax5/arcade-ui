---
name: release-arcade-ui
description: Releases @wolftrax/arcade-ui by bumping the version, building with tsup, publishing to npm, and updating the Storybook docs on Vercel. Use when the user asks to release, ship a version, publish to npm, push the package, update Storybook documentation, or deploy the Vercel docs site.
---

# Release Arcade-UI

Ship `@wolftrax/arcade-ui` in this order. Stop on the first failure.

Package manager is pnpm. npm is only for publish and the registry login check.

## 1. Version

If the user did not name `patch`, `minor`, or `major`, ask before editing anything.

```bash
pnpm version <patch|minor|major> --no-git-tag-version
```

That updates `package.json` only. Do not bump `.mcp/dev-skill.json`.

## 2. Check

```bash
pnpm lint && pnpm test
```

Do not build or publish if either fails.

## 3. Library build

```bash
pnpm build
```

`prepublishOnly` runs this again. Confirm `dist/index.js`, `dist/index.mjs`, and `dist/index.d.ts` exist. `files` is `["dist"]` — npm must not receive source, stories, or `storybook-static`.

## 4. npm

```bash
npm whoami
npm publish
```

`publishConfig.access` is already `public`. If `npm whoami` fails, stop and tell the user to `npm login`. Do not retry publish for a version that is already on the registry.

## 5. Storybook + Vercel

`vercel.json` is the docs deploy:

- `installCommand`: `pnpm install`
- `buildCommand`: `pnpm build-storybook`
- `outputDirectory`: `storybook-static`

Do not change those fields. Do not commit `dist/` or `storybook-static/` (both are gitignored). Vercel rebuilds Storybook from the git push.

Commit the version bump, then push the branch Vercel tracks (usually `main`):

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
release: vX.Y.Z

EOF
)"
git push
```

Use the version just written to `package.json`. Include `pnpm-lock.yaml` only if the version bump changed it. Do not force-push. Do not skip hooks.

If there is no git remote, stop. Pushing is what updates the Vercel site. Use `npx vercel --prod` only when the user says the Git integration is not connected.
