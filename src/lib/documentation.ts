import { type DocumentationPage } from "@/lib/types";

export const documentationPages: Record<string, DocumentationPage> = {
  "get-started": {
    id: "get-started",
    title: "Get Started",
    description:
      "Install Vaidyuti in a React + Tailwind v4 project. Components are added on demand through the shadcn CLI — you own the source, nothing is published as a runtime dependency.",
    content: {
      sections: [
        {
          title: "Prerequisites",
          content:
            "Vaidyuti targets React 19, TypeScript, and Tailwind CSS v4. Initialise shadcn once in your project — this writes components.json, sets up the @/ import alias, and wires Tailwind's CSS variables. Pick the neutral base colour to match the Vaidyuti palette.",
          code: `# In your React + Tailwind v4 project
npx shadcn@latest init`,
        },
        {
          title: "Add a component",
          content:
            "Every Vaidyuti component is published as a shadcn-compatible registry entry at https://ui.vaidyuti.in/registry/vaidyuti/<name>/<name>.json. Pass the URL directly to the CLI — files land in @/components/ui/ and any required dependencies are installed automatically.",
          code: `# Add a single component
npx shadcn@latest add https://ui.vaidyuti.in/registry/vaidyuti/button/button.json

# Add several at once
npx shadcn@latest add \\
  https://ui.vaidyuti.in/registry/vaidyuti/button/button.json \\
  https://ui.vaidyuti.in/registry/vaidyuti/input/input.json \\
  https://ui.vaidyuti.in/registry/vaidyuti/card/card.json

# pnpm / yarn / bun work too
pnpm dlx shadcn@latest add https://ui.vaidyuti.in/registry/vaidyuti/button/button.json
bunx shadcn@latest add https://ui.vaidyuti.in/registry/vaidyuti/button/button.json`,
        },
        {
          title: "Tailwind v4 setup",
          content:
            "Vaidyuti uses Tailwind v4's CSS-first configuration — there is no tailwind.config.js. Import Tailwind from your root stylesheet and the design tokens shadcn writes will be picked up automatically.",
          code: `/* src/index.css */
@import "tailwindcss";

/* shadcn init writes the @theme block and CSS variables
   for colors, radius, and typography here. */`,
        },
        {
          title: "Use it in your app",
          content:
            "Components are imported from the @/components/ui/ alias and composed with regular Tailwind classes. They are fully typed, support dark mode out of the box, and follow the Vaidyuti heading and spacing rhythm documented under Typography.",
          code: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignInForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@vaidyuti.in" />
      </div>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  )
}`,
        },
        {
          title: "What you get",
          content:
            "Source you own (no runtime dependency on Vaidyuti), full TypeScript types and Radix accessibility primitives, the Vaidyuti theme tokens (light, dark, protanopia, tritanopia, high-contrast), and the typography + spacing system tuned for operational density. Browse the rest of the docs — Typography, Colors, Foundations, Accessibility — for the design conventions every component is built against.",
        },
      ],
    },
  },
  "docs-typography": {
    id: "docs-typography",
    title: "Typography",
    description:
      "The Vaidyuti type system — sizes, line heights, letter spacing, and vertical rhythm aligned to Tailwind v4 and shadcn/ui conventions.",
    content: { sections: [] },
  },
  colors: {
    id: "colors",
    title: "Colors",
    description:
      "The Vaidyuti color system — semantic tokens, theme modes (light, dark, protanopia, tritanopia, high-contrast), contrast pairings and usage rules.",
    content: { sections: [] },
  },
  foundations: {
    id: "foundations",
    title: "Foundations",
    description:
      "Spacing, elevation, borders & radius, and the layout shell — every value sourced from src/index.css and the live components.",
    content: { sections: [] },
  },
  accessibility: {
    id: "accessibility",
    title: "Accessibility",
    description:
      "Vaidyuti targets WCAG 2.2 AA across every theme — what the system gives you for free, and the author checklist for everything else.",
    content: { sections: [] },
  },
  contributing: {
    id: "contributing",
    title: "Contributing",
    description:
      "How to add or modify a Vaidyuti component — the three-file workflow, pnpm scripts, and the quality bar every change is held to.",
    content: { sections: [] },
  },
};
