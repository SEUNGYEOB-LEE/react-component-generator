# Project Instructions

## Operational Commands

- Install dependencies: `bun install`
- Run API server and Vite: `bun run dev`
- Run tests once: `bun run test`
- Build production assets: `bun run build`
- Run lint: `bun run lint`
- Use Bun for dependency management and project scripts.

## Project Context

This is a React 19 and TypeScript training app. Vite serves the frontend on
`http://localhost:5173`, and Bun serves the local API proxy on port 3002.
The `mcp-start` branch is a recovery checkpoint for the browser-verification
lab. Treat all data entered into the app as disposable training data.

## Golden Rules

- Never use a real API key in tests, prompts, logs, screenshots, or browser
  verification. Use `test-key-not-a-secret` for the lab.
- Browser verification must not call Anthropic, Google, or any other external
  model API. Do not submit the component-generation form during the audit.
- After changes to user-visible frontend behavior, browser storage, navigation,
  or frontend network flows, ensure `bun run dev` is reachable and proactively
  delegate verification to `browser-verifier`.
- Skip browser verification for documentation-only or backend-only changes and
  state why it was skipped.
- The browser verifier is an independent, read-only observer. It must not edit
  code or start the development server.
- Do not report completion until relevant automated tests and the verifier's
  PASS/FAIL evidence have both been reviewed. Report a blocked verifier as a
  blocker, not as a pass.

## Engineering Standards

- Add or update a failing test before fixing observable behavior.
- Keep provider values aligned with the `Provider` type in `src/types/index.ts`.
- Keep browser-storage behavior explicit and covered by tests.
- Make the smallest change that satisfies the verified requirement.
- Never commit `.env`, credentials, generated build output, or browser profiles.

## Maintenance

Update this file when project commands, ports, verification triggers, or
security boundaries change.
