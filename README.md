# Vaidyuti Design System

The design system for **Vaidyuti** — accelerating the decentralization of renewable
energy. *Energy by the people, for the people, of the people.*

A shadcn-compatible component registry: 70 React components, a hand-tuned token
layer with light + dark themes, colour-vision-deficiency modes, and a live
documentation site.

> Built as a shadcn-compatible component registry with a hand-tuned token
> layer, full accessibility work, and a rebrand-in-one-edit architecture,
> retuned for the Vaidyuti brand and the energy domain.

## Quick start

```bash
npx shadcn@latest add button --registry https://ui.vaidyuti.in
```

Or register it once in `components.json`:

```json
{
  "registries": {
    "vaidyuti": "https://ui.vaidyuti.in"
  }
}
```

```bash
npx shadcn@latest add vaidyuti:button
```

## Brand

### Colour — electric lime

The primary ramp is **hand-tuned, not aliased to a Tailwind palette**. The
wordmark colour `#EEFF41` is anchored at step **400**.

| Step | Hex | Role |
|------|-----|------|
| 50–300 | tints | tinted surfaces, subtle fills |
| **400** | **`#EEFF41`** | **brand anchor** — the wordmark colour; `--primary` in dark |
| 500–700 | mid | desaturated; legible *as text* on light |
| **800** | shade | `--primary` in light — lime is too bright to sit under white text |

The ramp lives in the `@theme` block at the top of `src/index.css` as
`--color-brand-50…950`, and `--primary-*` aliases it exactly the same way.
To rebrand, change those eleven values and nothing else.

Why a custom scale rather than Tailwind's: Tailwind `lime` sits at hue 128.9
(too green) and `yellow` at 91.9 (too orange) — the wordmark is 114.8. The ramp
therefore keeps Tailwind lime's lightness/chroma curve and rotates the hue onto
the brand, anchoring step 400 to `#EEFF41` exactly.

Semantic mapping: `--primary` is step **800** in light and step **400** in
dark. Measured contrast — light link 6.1:1, light button text 6.0:1, dark
link 17.9:1, dark button text 13.3:1.

Grounds use a neutral scale, untouched.

### Type

- **Display / headings** — Comfortaa (the wordmark face), 700
- **Body / UI** — Inter

```
font-display   →  Comfortaa
font-sans      →  Inter            (body, UI, prose)
font-mono      →  JetBrains Mono   (code, IDs, telemetry — where alignment matters)
```

### Shape & elevation

`--radius: 0.625rem` (10px), the full derived scale (`--radius-sm` …
`--radius-3xl`), squircle utilities (`rounded-squircle-lg`) where
`corner-shape` is supported, and an inset-shadow depth model on buttons.

Change `--radius` in `src/index.css` to reshape the whole system in one edit.

## Development

```bash
pnpm install
pnpm dev               # docs site
pnpm build             # typecheck + bundle
pnpm build:registry    # regenerate public/registry/vaidyuti/**
pnpm registry:validate
```

Regenerate brand assets from the real Comfortaa outlines (no font dependency at
runtime — the SVGs contain paths):

```bash
python3 scripts/generate-wordmark.py
```

Produces `public/vaidyuti-logo-{light,dark,mark}.svg` plus a `currentColor`
variant at `vaidyuti-logo.svg`.

## Deployment

Cloudflare Workers, serving `./dist` at **ui.vaidyuti.in**.

```bash
pnpm build && pnpm build:registry && npx wrangler deploy
```

## Architecture

```
src/
  index.css              # the whole token layer — start here
  components/ui/         # 70 registry components
  components/blocks/     # composed page blocks
  lib/registry/          # per-component docs, demos, code samples
  lib/component-names.ts # sidebar labels
scripts/
  generate-registry.ts   # components -> shadcn registry JSON
  generate-wordmark.py   # Comfortaa outlines -> logo SVGs
public/registry/vaidyuti # generated registry (committed)
```

To add a component: drop it in `src/components/ui/`, add a JSDoc block
(`@name` / `@description` / `@dependencies`), register a doc in
`src/lib/registry/`, add its label to `component-names.ts`, then
`pnpm build:registry`.

## Licence

MIT
