# Work Tracking App - Frontend

## Project Overview

React-based frontend for a time tracking application with organization management, work session tracking, and place management.

## Tech Stack

- **Framework:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Tailwind CSS 3.4 (v4 with CSS-based config)
- **Routing:** React Router 7
- **HTTP Client:** Axios 1.6.2
- **State Management:** Zustand (authStore, themeStore, layoutStore) for UI/client state
- **Server State:** TanStack Query (React Query) for API data (caching, refetching, invalidation)
- **Forms:** React Hook Form + Zod validation
- **i18n:** i18next + react-i18next
- **Icons:** Lucide React

## Architecture Pattern

### DTO → Mapper → Model Flow

Each feature follows this data transformation pattern:

```
Backend Response (DTO)
    ↓
Mapper Function (dto → model)
    ↓
Domain Model (used in components/services)
```

## Folder Structure

```
src/
├── app/
│   ├── router.tsx                 # React Router configuration
│   ├── providers.tsx              # QueryClientProvider + app providers
│   ├── layouts/
│   │   ├── AppLayout.tsx          # Full layout (sidebar + header + content)
│   │   ├── HeaderOnlyLayout.tsx   # Header only (for select-organization)
│   │   ├── Header.tsx             # Top bar (theme, language, user menu)
│   │   ├── Sidebar.tsx            # Collapsible navigation sidebar
│   │   ├── SidebarItem.tsx        # Recursive nav item with sub-menus
│   │   ├── SidebarFooter.tsx      # Switch org + logout buttons
│   │   ├── UserMenu.tsx           # Dropdown with avatar + actions
│   │   └── navigation.config.ts   # Nav items array (routes, icons, roles)
├── features/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── request/           # LoginRequestDTO, RegisterRequestDTO
│   │   │   └── response/          # LoginResponseDTO, TokenResponseDTO
│   │   ├── models/                # User, Organization
│   │   ├── mappers/               # auth.mapper.ts
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── services/
│   │   │   └── auth.service.ts    # login(), selectOrganization()
│   │   └── validation/
│   │       └── login.schema.ts    # Zod schema
│   ├── organizations/
│   │   ├── dto/
│   │   │   └── request/
│   │   │       └── select-organization.request.dto.ts
│   │   └── pages/
│   │       └── SelectOrganizationPage.tsx
│   ├── places/
│   │   ├── dto/
│   │   │   ├── request/           # CreatePlaceRequestDTO
│   │   │   └── response/          # PlaceResponseDTO
│   │   ├── models/                # Place
│   │   ├── mappers/               # place.mapper.ts
│   │   ├── hooks/                 # usePlaces.ts (TanStack Query)
│   │   ├── components/            # PlaceCard, CreatePlaceCard
│   │   ├── pages/
│   │   │   └── PlacesPage.tsx
│   │   └── services/
│   │       └── place.service.ts   # getById, getByOrganizationId, create
│   ├── work-sessions/
│   ├── reports/
│   ├── dashboard/
│   ├── settings/
│   ├── profile/
│   └── user/                      # Scaffolded, mostly empty
└── shared/
    ├── components/
    │   ├── Input.tsx              # Reusable input with icon, label, error
    │   ├── ThemeToggle.tsx        # Sun/Moon button (uses themeStore)
    │   └── LanguageToggle.tsx     # Globe + EN/ES button
    ├── hooks/
    │   ├── useInitials.ts         # "John Doe" → "JD"
    │   └── useHasRole.ts          # Role checking against authStore
    ├── services/
    │   ├── api.ts                 # Axios instance (baseURL, no interceptors here)
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts # Attaches Bearer token to requests
    │   └── index.ts               # Barrel export
    ├── store/
    │   ├── authStore.ts           # user, token, organizations, login/logout
    │   ├── themeStore.ts          # isDark, toggleTheme, hydrateFromStorage
    │   └── layoutStore.ts         # sidebarCollapsed, sidebarMobileOpen
    ├── types/
    │   ├── api-response.type.ts   # ApiResponse<T>
    │   ├── user-organization-role.enum.ts # ADMIN, EMPLOYER, EMPLOYEE
    │   └── ...
    ├── i18n/
    │   ├── i18n.ts                # i18next configuration
    │   ├── index.ts
    │   └── locales/
    │       ├── en/
    │       │   └── auth.json        # All UI translations (single namespace)
    │       └── es/
    │           └── auth.json
    └── utils/
```

## Design System

### CSS Custom Properties (src/index.css)

All colors, typography, spacing, shadows are defined as CSS custom properties in `:root` (light) and `.dark` (dark).

**Key variables:**
- `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--input`, `--ring`
- `--primary-hover`, `--primary-active`, `--overlay`, `--disabled-opacity`
- `--font-sans`, `--font-mono`
- `--text-xs` through `--text-3xl`
- `--space-1` through `--space-12`
- `--shadow-xs` through `--shadow-xl`
- `--z-base` through `--z-tooltip`
- `--input-height-sm/md/lg`, `--button-height-sm/md/lg`
- `--max-width-xs/sm/md/lg/xl`

### Tailwind Config (tailwind.config.ts)

Maps CSS variables to Tailwind utilities. Use `bg-background`, `text-foreground`, `shadow-md`, etc.

### Reusable Components

**Do NOT duplicate inline input/button styles.** Use shared components:

```tsx
// Input with icon, label, error message
<Input
  label="Email"
  icon={<Mail className="w-5 h-5" />}
  error={errors.email?.message}
  {...register('email')}
/>

<ThemeToggle />

<LanguageToggle />
```

## Backend Integration

- **Backend URL:** http://localhost:8080
- **API Base:** /api
- **Full API URL:** http://localhost:8080/api
- **Authentication:** JWT with RS256, stored in localStorage as `work_tracker_token`
- **Selected Org:** stored as `work_tracker_selected_org`
- **User:** stored as `work_tracker_user`

## API Service Layer Pattern

- Services in `features/{feature}/services/*.service.ts`
- Use `apiService` from `shared/services/api.ts` (Axios instance)
- **Interceptor** (`shared/services/interceptors/auth.interceptor.ts`) automatically attaches `Authorization: Bearer <token>` to every request
- DTOs imported from `features/{feature}/dto/*`

## Auth Flow

```
LoginPage (/login)
    ↓
authStore.login({ email, password })
    ↓
POST /api/auth/login → saves token + user + organizations
    ↓
redirect to /select-organization
    ↓
SelectOrganizationPage (HeaderOnlyLayout, no sidebar)
    ↓
User selects org → authStore.selectOrganization({ organizationId })
    ↓
POST /api/auth/select-organization → saves new token with org context
    ↓
redirect to /dashboard
    ↓
Dashboard (AppLayout with sidebar + header)
```

## Layout System

| Route | Layout | Sidebar? |
|---|---|---|
| `/login` | None (standalone) | No |
| `/select-organization` | HeaderOnlyLayout | No |
| `/dashboard`, `/work-sessions`, etc. | AppLayout | Yes |

## State Management

### Zustand (UI / Client State)

| Store | State | Actions |
|---|---|---|
| **authStore** | `user`, `token`, `organizations`, `selectedOrganizationId`, `role`, `isAuthenticated` | `login()`, `selectOrganization()`, `logout()`, `hydrateFromStorage()` |
| **themeStore** | `isDark` | `toggleTheme()`, `setTheme()`, `hydrateFromStorage()` |
| **layoutStore** | `sidebarCollapsed`, `sidebarMobileOpen` | `toggleSidebar()`, `toggleMobileSidebar()`, `closeMobileSidebar()` |

**Theme persistence:** localStorage key `work_tracker_theme`

### TanStack Query (Server State)

Used for all API data fetching — caching, background refetching, and cache invalidation.

**When to use what:**
- **TanStack Query:** Any data that comes from the backend (places, work sessions, reports)
- **Zustand:** UI-only state (sidebar open, theme, auth credentials)

**Pattern — Custom hooks in `features/{feature}/hooks/`:**

```typescript
// features/places/hooks/usePlaces.ts
export function usePlaces(organizationId: string | null) {
  return useQuery({
    queryKey: ['places', organizationId],
    queryFn: () => placeService.getByOrganizationId(organizationId!).then(r => r.data.data.map(mapPlaceResponseToPlace)),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

**Cache invalidation on mutations:**

```typescript
// After create/update/delete, invalidate related queries
queryClient.invalidateQueries({ queryKey: ['places', organizationId] })
```

**Global QueryClient config** (`app/providers.tsx`):
- `staleTime: 5 * 60 * 1000` (5 minutes)
- `refetchOnWindowFocus: true`
- `retry: 1`

## i18n

Two languages supported: **English (en)** and **Spanish (es)**.

Auto-detects browser language on first visit. Stores preference in localStorage.

All UI text must use `const { t } = useTranslation('auth')` and translation keys from `shared/i18n/locales/*/auth.json`.

## Roadmap Status

### ✅ Completed
1. Project Setup (React + Vite + Tailwind)
2. Dependencies installed (all planned deps)
3. Folder structure created
4. API layer (Axios instance + auth interceptor)
5. Auth types, DTOs, models, mappers
6. Auth service (login, selectOrganization)
7. Zustand authStore (with role persistence)
8. Zustand themeStore + ThemeToggle component
9. Zustand layoutStore
10. React Router setup with layouts
11. Login Page (UI + form validation + API integration)
12. Select Organization Page (UI + API integration)
13. AppLayout with Sidebar, Header, UserMenu, SidebarFooter
14. i18n (English + Spanish)
15. Design system (CSS variables + Tailwind config)
16. Shared components: Input, ThemeToggle, LanguageToggle
17. TanStack Query setup (providers, stale time, caching)
18. Role-based access: `useHasRole` hook + navigation gating
19. Places Module — list view, cards, service, hooks, mapper/model/DTO
20. Google Maps links on place coordinates

### 🚧 In Progress / Partial
- Places Module — create/edit forms not wired up yet (UI placeholders exist)

### 🚧 Next Steps (Priority TBD by user)
1. Work Session Module (CORE) — timer, manual entry, session history
2. Dashboard — summary cards, recent activity
3. Reports
4. Settings (ADMIN only)
5. Profile pages

## Code Guidelines

### DRY — Don't Repeat Yourself

**BAD — Duplicating inline styles:**
```tsx
// Don't do this in multiple pages:
<button className="w-full h-[var(--button-height-md)] bg-primary text-primary-foreground rounded-lg ...">
```

**GOOD — Use shared components:**
```tsx
// Create a Button component or reuse existing shared ones
<Input ... />
<ThemeToggle />
```

### Current Shared Components (reuse these)

| Component | Location | Purpose |
|---|---|---|
| `Input` | `shared/components/Input.tsx` | Form input with icon, label, error |
| `ThemeToggle` | `shared/components/ThemeToggle.tsx` | Dark/light mode toggle |
| `LanguageToggle` | `shared/components/LanguageToggle.tsx` | EN/ES language switch |

### Current Shared Hooks (reuse these)

| Hook | Location | Purpose |
|---|---|---|
| `useInitials` | `shared/hooks/useInitials.ts` | "John Doe" → "JD" |
| `useHasRole` | `shared/hooks/useHasRole.ts` | Check if user has any of given roles |

### When to Create a New Shared Component

Create one when:
- The same UI pattern appears in **3+ places**
- It's a **form control** (input, select, checkbox)
- It's an **app-wide control** (theme, language)

Don't create one when:
- It's only used in **one feature**
- It's a **simple wrapper** with no reusable logic

### Theme Management

**Never use direct DOM manipulation for theme:**
```tsx
// ❌ BAD
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
}
```

**Always use themeStore:**
```tsx
// ✅ GOOD
const { isDark, toggleTheme } = useThemeStore()
```

### Role-Based Access Control

Use the `useHasRole` hook to gate UI elements (buttons, actions, menu items):

```tsx
import { useHasRole } from '@/shared/hooks/useHasRole'

const canManage = useHasRole('ADMIN', 'EMPLOYER')

// Show create button only for admins/employers
{canManage && (
  <button onClick={openCreateModal}>Create Place</button>
)}
```

**Roles:** `ADMIN`, `EMPLOYER`, `EMPLOYEE`

**Role is stored in:** `authStore.role` (persisted to localStorage as `work_tracker_role`)

**Navigation items are also role-gated** via `roles?: UserOrganizationRole[]` in `navigation.config.ts`.

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

## Must Do

- Validate org ownership where required
- Filter deleted data (backend handles this, but frontend should handle empty states)
- Use shared components instead of inline duplicated JSX
- Add translation keys for ALL user-facing text
- Keep interceptors in `shared/services/interceptors/`, not in components
- **Clear TanStack Query cache on logout** (`queryClient.clear()`) to prevent data leakage between users on shared computers

## Avoid

- Logic in components that should be in stores
- Returning entities (always use DTOs → Models)
- Hardcoded errors (use i18n keys)
- Duplicated inline Tailwind classes
- Direct DOM manipulation (use React state + refs)
