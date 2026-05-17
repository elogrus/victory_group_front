# Agent Instructions for victory_group_front

## What this repository is
- A frontend Next.js 16 application using the App Router.
- Built with React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, and shadcn-style UI components.
- Contains a project management dashboard with Kanban boards, task lists, project maps, and admin pages.
- Uses `pnpm` as the package manager.

## Key commands
- `pnpm dev` — start the development server.
- `pnpm build` — build the production app.
- `pnpm start` — run the production server.

> Note: `README.md` and `CLAUDE.md` contain additional project-level guidance.

## Important structure
- `app/` — Next.js route components and page layouts.
- `entity/` — domain entities with Redux slices and provider patterns.
- `features/` — feature-specific logic, providers, and UI components.
- `widgets/` — composed reusable widgets (e.g. Kanban board, project map).
- `shared/` — shared utilities, hooks, Redux store, schemas, and UI primitives.

## Conventions to follow
- Preserve Next.js App Router semantics: `use client` is required at the top of client components.
- Keep TypeScript types and interfaces aligned with the `entity/*` model conventions.
- Use `shared/hooks/reduxHooks.ts` for Redux state access and typical `entity/.../slice.ts` patterns.
- Use `shared/ui/*` components for consistent styling and UI patterns.
- Data fetching is currently centralized in `shared/lib/myFetch.ts` using `ky`.
- Validation schemas live in `shared/schemes/` and use Zod.

## What agents should avoid
- Do not assume a backend implementation beyond the existing frontend code.
- Do not add unrelated framework tooling or languages; this repository is focused on Next.js/React frontend.
- Do not remove or overwrite existing documentation in `README.md` or `CLAUDE.md` unless updating it for accuracy.

## Helpful docs
- `README.md` — starter project information and route structure.
- `CLAUDE.md` — custom project overview, architecture, and tech stack.

## Recommended editing behavior
- When adding or updating features, keep routing and component structure consistent with `app/` and the `entity/`/`features/` separation.
- Prefer small, incremental fixes and keep files focused.
- Use the existing UI primitives in `shared/ui/` instead of introducing new custom button/field components unless necessary.
