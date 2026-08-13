# AGENTS.md

## Operational Commands

- Install: `bun install`
- Run dev (API server + frontend together): `bun run dev`
- Run only the API server: `bun run server` (Bun `--watch`, port 3002)
- Build: `bun run build` (`tsc -b && vite build`)
- Lint: `bun run lint`
- Test: `bun run test` (Vitest, single run) / `bun run test:watch`
- Package manager is fixed to **bun**. Do not use npm, yarn, or pnpm, and do not generate a `package-lock.json` or `yarn.lock`.

## Golden Rules

### Immutable

- Never commit `.env` or hardcode `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY`. `.env` is gitignored; keys are read only from `process.env` on the server (`server/index.ts:59-62`).
- `GET /api/config` must only ever return boolean flags (`envKeys.anthropic`, `envKeys.google`), never the raw key value (`server/index.ts:147-157`). Any new endpoint that exposes env-derived data must preserve this boundary.

### Do's & Don'ts

- Always use the official Anthropic/Google REST endpoints directly via `fetch` (`server/index.ts:69`, `server/index.ts:99`) — do not introduce an SDK dependency without updating both provider paths consistently.
- Do not add new response-normalization logic inline in `server/index.ts`. Put it in `server/generator.ts` (or a new pure module next to it) so it stays unit-testable, following the existing split.

### Team-specific rules (evidence-based)

- **Asymmetry** — `callGoogle` retries across `GOOGLE_MODELS` via `withModelFallback` (`server/index.ts:134-136`), but `callAnthropic` has no fallback or retry at all (`server/index.ts:68-96`). If you touch provider call logic, either mirror the fallback behavior across both providers or leave a comment explaining why one provider intentionally has none — don't let the two paths silently drift further apart.
- **Test boundary** — `server/generator.ts` and `server/fallback.ts` are pure functions with matching `*.test.ts` files; `server/index.ts` (the `Bun.serve` handler) has zero tests. New parsing/normalization logic belongs in the pure modules, not inline in the HTTP handler.
- **Hard constraint** — `LivePreview` (`src/components/LivePreview.tsx`) runs generated code through `react-live` in `noInline` mode, which requires an explicit `render(...)` call or the preview silently renders nothing. `ensureRenderCall` (`server/generator.ts:16-24`) exists solely to guarantee this. Don't remove or bypass it without providing an equivalent guarantee.
- **Hard constraint** — `SYSTEM_PROMPT` (`server/index.ts:7-49`) explicitly forbids `import` statements and TypeScript syntax in generated code, because the client executes the response with only `React` in scope as a global (no module system, no TS transform). Don't relax this prompt without also changing how `LivePreview` executes code.
- **Double defense** — AI output passes through two independent normalization steps before reaching the client: `stripCodeFences` then `ensureRenderCall` (`server/index.ts:188`). Each guards a different failure mode of the model's output (stray markdown fences vs. a missing `render()` call) — keep both.

## Project Context

React 컴포넌트 생성기: 프롬프트를 입력하면 AI(Anthropic Claude 또는 Google Gemini)가 React 컴포넌트를 생성하고, `react-live`로 즉시 미리보기와 코드를 함께 보여준다.

Tech stack: React 19, TypeScript, Vite, Bun (`Bun.serve` API proxy), react-live, Vitest + Testing Library.

## Standards & References

- Project overview, setup, and feature list: see `README.md`.
- Commit convention: Korean commit messages, `feat/fix/refactor/chore: 요약` format, one logical change per commit — enforced by the `commit` skill (`.claude/skills/commit/SKILL.md`).
- Maintenance policy: if a rule here no longer matches the code, propose an update to this file rather than silently working around it.

## Context Map

- **[프론트엔드 작업 (React/Vite)](./src/AGENTS.md)** — UI 컴포넌트, 훅, 스타일 작업 시.
- **[백엔드 작업 (Bun API 서버)](./server/AGENTS.md)** — API 라우트, 프로바이더 연동, 응답 정규화 작업 시.
