# Repository Guidelines

## Project Structure & Module Organization

- `server/`: MCP server (Express + MCP SDK). Source in `server/src/`, tests in `server/tests/`.
- `widgets/`: React widget bundle and Storybook. Source in `widgets/src/`; widget entry points live in `widgets/src/widgets/*.tsx`.
- `assets/`: Build artifacts for widgets (generated, do not hand-edit).
- `scripts/`: Shared build tooling (e.g., parallel widget builds).
- `docker/`: Container build and compose files.

## Build, Test, and Development Commands

- `npm run dev`: Run server and widget dev servers concurrently.
- `npm run dev:server`: MCP server with `tsx watch` (hot reload).
- `npm run dev:widgets`: Vite dev server for widgets.
- `npm run build`: Build widgets then server for production.
- `npm test`: Run all Vitest suites across workspaces.
- `npm run lint`: ESLint across the repo.
- `npm run format`: Prettier formatting for TS/TSX/JSON/MD.
- `npm run inspect`: Open MCP Inspector against `http://localhost:8080/mcp`.

## Coding Style & Naming Conventions

- TypeScript (ES2023) and React. Prefer strict types; avoid `any` unless necessary.
- Prettier is the source of truth: 2-space indentation, single quotes, semicolons.
- ESLint enforces React hooks and a11y rules; unused variables must be prefixed with `_`.
- Widget entry files use kebab-case names (e.g., `wish-box.tsx`) and map to `ui://wish-box`.

## Testing Guidelines

- Framework: Vitest (server + widgets). Widget tests may use Testing Library and jsdom.
- Name tests `*.test.ts`/`*.test.tsx` and place them near their module (`server/tests/`, `widgets/src/**`).
- Run targeted tests with `npm run test:server` or `npm run test:widgets` as needed.

## Commit & Pull Request Guidelines

- Commit messages follow a conventional style seen in history: `feat:`, `fix:`, `chore:` plus a short summary.
- PRs should include a clear description, how to test, and screenshots for widget/UI changes.
- Link related issues if applicable and call out any config or env changes.

## Configuration & Security Tips

- Copy `.env.example` to `.env` for local configuration (server port, log level, CORS).
- Avoid committing secrets or generated assets; `assets/` should be built via scripts.
