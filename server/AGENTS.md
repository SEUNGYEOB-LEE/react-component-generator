# server/AGENTS.md

## Module Context

Bun HTTP API proxy (`Bun.serve`, `server/index.ts`) exposing `/api/config` and `/api/generate`. Forwards prompts to the Anthropic or Google Generative Language APIs and normalizes the response into code `react-live` can execute.

## Tech Stack & Constraints

- `Bun.serve` only — no Express/Hono/Fastify. Port is hardcoded to `3002` (`index.ts:139`).
- Outbound provider calls use native `fetch` directly against the REST endpoints (`index.ts:69`, `index.ts:99`) — no provider SDK is installed.

## Implementation Patterns

- Pure, side-effect-free logic (`stripCodeFences`, `ensureRenderCall` in `generator.ts`; `withModelFallback` in `fallback.ts`) is kept separate from `index.ts` specifically so it can be unit-tested without spinning up `Bun.serve`.
- `index.ts` stays a thin HTTP-glue layer: parse request, resolve API key, call provider, run the response through the pure normalizers, map errors to status codes.

## Testing Strategy

- `generator.test.ts` and `fallback.test.ts` cover the pure functions via Vitest (`bun run test`).
- `index.ts` itself has no test coverage — keep new normalization/parsing logic in `generator.ts`/`fallback.ts` rather than adding it inline here, so it stays testable.

## Local Golden Rules

- **Asymmetry** — `callGoogle` retries across `GOOGLE_MODELS` via `withModelFallback` (`index.ts:134-136`); `callAnthropic` has no retry or fallback (`index.ts:68-96`). Mirror the fallback behavior if you extend one provider's resilience, or explain in a comment why it stays one-sided.
- **Hard constraint** — `SYSTEM_PROMPT` (`index.ts:7-49`) forbids `import` statements and TypeScript syntax in generated code, because the client executes the response with only `React` available as a global (no bundler, no TS transform). Do not loosen this without also changing how `src/components/LivePreview.tsx` executes the code.
- **Security boundary** — `GET /api/config` must only return boolean flags (`envKeys.anthropic`, `envKeys.google`), never `ENV_KEYS` values themselves (`index.ts:147-157`). Any new route reading `process.env` must preserve this.
- **Double defense** — Provider output is normalized through two independent steps before it reaches the client: `stripCodeFences` then `ensureRenderCall` (`index.ts:188`). Each catches a different failure mode (stray code fences vs. a missing `render()` call) — keep both, don't collapse them into one.
