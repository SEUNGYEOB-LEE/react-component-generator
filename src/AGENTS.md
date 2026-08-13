# src/AGENTS.md

## Module Context

React 19 + TypeScript frontend (Vite). Single-page prompt-to-component workbench: collects a prompt and provider/API key, calls the backend (`fetch('/api/generate')`, `fetch('/api/config')`), and renders the result via `LivePreview`/`CodeView`.

## Tech Stack & Constraints

- Styling is plain CSS only (`App.css`, `index.css` with `:root` custom properties as design tokens). No CSS-in-JS, no Tailwind, no CSS modules — keep new components on the same pattern.
- Live rendering goes through `react-live` (`LivePreview.tsx`) in `noInline` mode — see the hard constraint below.

## Implementation Patterns

- Data/network logic is centralized in `hooks/useComponentGenerator.ts`; components under `components/` stay presentation-focused and receive callbacks/state as props (see `App.tsx` wiring `PromptInput`/`ComponentCard`).
- Shared design tokens (colors, fonts, radii) are defined once in `index.css` `:root` and consumed via `var(--token-name)` in `App.css` — add new tokens there rather than hardcoding values in component CSS.

## Testing Strategy

- Vitest + `@testing-library/react` + jsdom, configured via `test/setup.ts`.
- Run with `bun run test` / `bun run test:watch`.
- `components/PromptInput.test.tsx` is currently the only test in this folder — follow its structure (render + `@testing-library/user-event`) for new component tests.

## Local Golden Rules

- **Asymmetry** — `PromptInput` has a co-located test (`PromptInput.test.tsx`); `ComponentCard`, `LivePreview`, `CodeView`, and `useComponentGenerator` do not. When adding meaningful interaction logic to one of these, add a matching test file rather than leaving the gap wider.
- **Hard constraint** — Any code string handed to `LivePreview`'s `code` prop is executed by `react-live` in `noInline` mode and must contain a `render(...)` call or nothing appears (enforced today server-side by `ensureRenderCall`). If this module ever transforms code client-side before rendering, preserve that guarantee.
- **Security boundary** — The API key typed into `App.tsx`'s `apiKey` state is sent only in the `fetch('/api/generate')` request body to the local backend. It is also persisted to `localStorage` (`lib/storage.ts`) so the field survives a reload — this is a deliberate product decision (see `lib/storage.test.ts`), not an oversight. Do not add any further transmission of it (e.g. logging, analytics, a third-party request).
