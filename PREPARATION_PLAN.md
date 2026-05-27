# 🛠 Frontend Preparation Plan

## Phase 1: Tooling & Configuration
1. **Install & configure Tailwind CSS v4**
2. **Configure path aliases** (`@/` → `./src/`) in `vite.config.ts` + `tsconfig.app.json`
3. **Initialize shadcn/ui** (standard CLI setup)
4. **Configure ESLint & Prettier** (extend Vite's ESLint setup, add Prettier config, ignore files)

## Phase 2: Core Dependencies
5. **Install runtime deps:** `axios`, `react-router-dom`, `zustand`, `@tanstack/react-query`, `lucide-react`, `date-fns`, `react-hook-form`, `@hookform/resolvers`, `zod`, `clsx`, `tailwind-merge`
6. **Install dev deps:** `tailwindcss`, `@tailwindcss/vite`, `@types/node`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react`, `eslint-plugin-import`

## Phase 3: Project Structure
7. **Create folder tree** per AGENTS.md:
   - `src/app/` (router, layouts, providers)
   - `src/features/` (auth, organizations, work-sessions, places, dashboard) → each with: `dto/request`, `dto/response`, `models`, `mappers`, `components`, `pages`, `services`
   - `src/shared/` (components, hooks, services, types, store, utils)

## Phase 4: Base Infrastructure
8. **Set up `.env`** with `VITE_API_URL=http://localhost:8080/api`
9. **Set up shared API service** (`src/shared/services/api.ts`) — Axios with interceptors
10. **Create base shell files:** `router.tsx`, `providers.tsx`, clean up `App.tsx`/`main.tsx`
11. **Create placeholder store directory** (`src/shared/store/`)

---

> **Note:** This plan should be executed sequentially. Each phase builds on the previous one.
> Created on: 2026-05-25

opencode -s ses_1a1bd109dffeaijsL3AcAADcPz
