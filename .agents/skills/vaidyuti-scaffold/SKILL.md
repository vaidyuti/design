---
name: vaidyuti-scaffold
description: Use when starting a Next.js app on the Vaidyuti design system. Wires the ui.vaidyuti.in shadcn registry, the electric-lime theme (Comfortaa + Inter, Vaidyuti token layer), and globals.css.
---

# Scaffolding a Vaidyuti project

Use this skill when the user wants to start a **new** project (typically a Next.js
App Router app) that uses the [Vaidyuti](https://ui.vaidyuti.in) design system —
the shadcn-based component registry maintained by [ohcnetwork](https://github.com/vaidyuti/design).

Vaidyuti is distributed as a shadcn registry, **not** an npm package. Components are
copied into the repo (into `src/components/vaidyuti/`) and owned by the project, exactly
like plain shadcn/ui. This skill captures the registry wiring, the theme port, and the
sharp edges that are easy to get wrong.

Supporting templates live next to this file in `templates/`. Read them with the paths
shown below and copy them into the new project (adjusting only where noted).

## When to use

- "Set up a new project with Vaidyuti / ui.vaidyuti.in"
- "Add the Vaidyuti design system to this app"
- "Configure the @vaidyuti shadcn registry"
- "Port the Vaidyuti theme (fonts, tokens, squircle) into globals.css"

## Prerequisites

- `pnpm` (the registry helper script uses `pnpm dlx`; commands below assume pnpm).
- Node 20+.
- Network access to `ui.vaidyuti.in` (the shadcn CLI fetches components at build time).

## Target stack

The reference stack is:

- Next.js 16 (App Router, `src/` dir, Turbopack, React Compiler)
- React 19
- Tailwind CSS 4 (via `@tailwindcss/postcss`, CSS-first config — no `tailwind.config`)
- shadcn CLI (v4+) with the Vaidyuti registry
- Comfortaa (display/headings) + Inter (body/UI) + JetBrains Mono (code only),
  all from `@fontsource-variable/*`

Vaidyuti components import `radix-ui` (the unified package), `class-variance-authority`,
`lucide-react` icons, and the local `cn` helper from `@/lib/utils`.

## Step-by-step

### 1. Create the Next.js app

Scaffold a Next.js App Router app with `src/`, TypeScript, and Tailwind 4. For example:

```bash
pnpm create next-app@latest <app-name> --ts --app --src-dir --tailwind --eslint --use-pnpm
```

> If the project pins a specific Next.js version, prefer that. Note: recent Next.js
> ships its own docs under `node_modules/next/dist/docs/` and may have breaking changes
> from older training data — consult those docs before writing App Router / config code.

### 2. Install dependencies

Runtime deps used by Vaidyuti components and the theme:

```bash
pnpm add radix-ui class-variance-authority clsx tailwind-merge lucide-react \
  @fontsource-variable/figtree @fontsource-variable/geist-mono \
  tw-animate-css shadcn sonner next-themes
```

Dev deps for Tailwind 4:

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

Add more component-specific deps as the registry requires them (e.g. `cmdk` for
`command`, `vaul` for `drawer`, `react-day-picker` for `calendar`,
`react-hook-form @hookform/resolvers zod` for `form`). The registry index lists each
component's `dependencies` — see step 6.

### 3. Configure `components.json`

Copy `templates/components.json` to the project root. The key parts are:

- `"style": "base-nova"` and `cssVariables: true`
- the `@vaidyuti` registry entry pointing at
  `https://ui.vaidyuti.in/registry/vaidyuti/{name}/{name}.json`
- aliases: `ui` → `@/components/ui`, but Vaidyuti components target
  `components/vaidyuti/` via each registry item's `target` field, so they land in
  `src/components/vaidyuti/` regardless.

### 4. Add the `vaidyuti:add` helper script (important)

Do **not** rely on the `@vaidyuti/<name>` shorthand with the shadcn CLI. The registry
serves items at `.../{name}/{name}.json` but the CLI only substitutes the **first**
`{name}` placeholder, so the shorthand 404s. Instead:

1. Copy `templates/add-vaidyuti.sh` to `scripts/add-vaidyuti.sh`.
2. Add the script to `package.json`:
   ```json
   "scripts": {
     "vaidyuti:add": "sh scripts/add-vaidyuti.sh"
   }
   ```
3. Install components by name:
   ```bash
   pnpm vaidyuti:add button input field card badge sonner
   ```

The script expands each name into a direct item URL
(`https://ui.vaidyuti.in/registry/vaidyuti/<name>/<name>.json`) and runs
`pnpm dlx shadcn@latest add --yes --overwrite <urls...>`. Cross-component
`registryDependencies` resolve automatically because Vaidyuti publishes them as
absolute URLs.

### 5. Port the theme into `globals.css`

Vaidyuti's theme is not an npm import — it is ported into the app's global stylesheet.
Copy `templates/globals.css` to `src/app/globals.css`. It provides:

- Tailwind 4 imports plus `tw-animate-css`, `shadcn/tailwind.css`, and the two font packages.
- Full light/dark token sets (`--background`, `--foreground`, `--primary`, `--border`,
  `--sidebar-*`, `--chart-*`, etc.) mapped through `@theme inline`.
- An **electric-lime brand ramp** declared as `--color-brand-50…950` in the
  `@theme` block, which `--primary-*` then aliases (the same way Vaidyuti UI aliases
  its own scale). Step 400 is the wordmark colour `#EEFF41`. Semantics are Vaidyuti
  UI's: `--primary` is step 800 in light, step 400 in dark. To rebrand, change
  the eleven `--color-brand-*` values and nothing else.
- Accessibility color-scheme variants (`[data-theme="protanopia"]`,
  `[data-theme="tritanopia"]`, `.high-contrast`).
- `Inter Variable` as `--font-sans` (body/UI), `JetBrains Mono Variable` as
  `--font-mono` (code, IDs, telemetry only), and `Comfortaa Variable` as
  `--font-display`, applied to h1–h4 in the base layer.
- `--radius: 0.625rem` (10px) with the full derived scale, and
  `rounded-squircle-*` superellipse utilities — mirrored from Vaidyuti UI unchanged.
  Change `--radius` to reshape the whole system in one edit.
- Hit-area utilities and named keyframe animations.

Copy `templates/postcss.config.mjs` to the project root (Tailwind 4 uses the
`@tailwindcss/postcss` plugin; there is no `tailwind.config.js`).

### 6. Add the `cn` util and base components

- Copy `templates/utils.ts` to `src/lib/utils.ts` (`cn` = `twMerge(clsx(...))`).
- Install a starter set of components, then mount the toaster:
  ```bash
  pnpm vaidyuti:add button input field label card badge dialog select sheet sonner \
    table tabs tooltip skeleton dropdown-menu checkbox separator
  ```
- Mount `<Toaster />` once at the root. Copy `templates/providers.tsx` to
  `src/components/providers.tsx` and render `<Providers>` in `src/app/layout.tsx`
  (import `./globals.css` there too). Add your `QueryClientProvider` /
  `next-themes` `ThemeProvider` inside `Providers` as needed.

Browse the full catalog at [ui.vaidyuti.in](https://ui.vaidyuti.in) or
`curl https://ui.vaidyuti.in/registry.json` for the machine-readable index (each
entry lists `dependencies` and `registryDependencies`).

## Known sharp edges (call these out to the user)

- **Registry drift.** The deployed registry can be ahead of or behind
  `vaidyuti/design@main`. Some items (historically `dialog`, `select`, `sheet`) shipped
  a Base-UI-style `render` prop that does **not** compile against `radix-ui`. If a freshly
  added component fails to type-check, compare it against the component source on `main`
  and rewrite imports to `@/components/vaidyuti/*`. Run `pnpm exec tsc --noEmit` after adding
  components to catch this early.
- **Badge variants.** Vaidyuti's `badge` does **not** have `danger` or `outline` variants.
  Use `destructive`, `neutral`, `primary`, `success`, `warning`, `info`, or the named color
  variants (`red`, `blue`, ...). It also supports `solid`, `counter`, `dot`, `onClose`, and
  `size` props.
- **`radix-ui` unified package.** Components import from the single `radix-ui` package
  (e.g. `import { Slot } from "radix-ui"`), not the per-primitive `@radix-ui/react-*` packages.
- **Turbopack + monorepo.** If the app lives in a pnpm workspace and resolves sibling
  packages, set `turbopack.root` to the workspace root in `next.config.ts` so module
  resolution follows the `node_modules` symlinks.

## Validate

After scaffolding, run:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

`tsc` is the fastest way to surface registry-drift compile errors in freshly added
components.

## Template files

| Template | Copy to | Notes |
| --- | --- | --- |
| `templates/components.json` | `components.json` | shadcn + `@vaidyuti` registry config |
| `templates/add-vaidyuti.sh` | `scripts/add-vaidyuti.sh` | component installer (works around CLI `{name}` bug) |
| `templates/globals.css` | `src/app/globals.css` | full ported theme; swap the primary palette to re-brand |
| `templates/postcss.config.mjs` | `postcss.config.mjs` | Tailwind 4 plugin |
| `templates/utils.ts` | `src/lib/utils.ts` | `cn` helper |
| `templates/providers.tsx` | `src/components/providers.tsx` | mounts `<Toaster />`; extend with your providers |
