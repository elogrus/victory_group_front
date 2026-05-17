# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

Note: This project uses pnpm as the package manager.

## Project Overview

A Next.js 16 project with React 19 for a project management dashboard (Kanban-style). The app features drag-and-drop task management, project maps, and admin functionality.

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages
- `entity/` - Domain entities with Redux slices and React providers
- `features/` - Feature modules with UI components
- `widgets/` - Complex composed widgets
- `shared/` - Shared utilities and UI components

### Routes
- `/` - Landing page
- `/auth` - Authentication page
- `/d` - Dashboard (main project view)
- `/d/[projectId]` - Project details
- `/d/[projectId]/[pipelineId]` - Pipeline view
- `/map` - Project map (flow diagram)
- `/admin` - Admin panel
- `/profile` - User profile
- `/onboarding` - Onboarding flow

### State Management
Redux Toolkit is used for global state. Each entity has:
- A slice at `entity/[Entity]/slice.ts`
- A provider at `entity/[Entity]/provider.tsx`
- Type definitions at `entity/[Entity]/index.ts`

Available entities: Project, Task, Pipeline, User, Role, Me, Token, Notification, Column, AutomationRule.

Access Redux state via `shared/hooks/reduxHooks.ts`.

### Data Fetching
HTTP requests use `ky` (from `shared/lib/myFetch.ts`). API base URL defaults to localhost:8000.

### UI Components
shadcn/ui-style components in `shared/ui/`. Use `class-variance-authority` for variant handling. Forms use react-hook-form with Zod schemas in `shared/schemes/`.

### Key Technologies
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Redux Toolkit
- @dnd-kit for drag-and-drop
- @xyflow/react for flow diagrams
- Zod for form validation