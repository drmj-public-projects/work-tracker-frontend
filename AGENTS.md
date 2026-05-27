# Work Tracking App - Frontend
## Project Overview
React-based frontend for a time tracking application with organization management, 
work session tracking, and place management.
## Tech Stack
- **Framework:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 7
- **HTTP Client:** Axios 1.6.2
- **State Management:** Zustand (planned)
- **Icons:** Lucide React (planned)
## Architecture Pattern
### DTO → Mapper → Model Flow
Each feature follows this data transformation pattern:
Backend Response (DTO) 
    ↓
Mapper Function (dto → model)
    ↓
Domain Model (used in components/services)
### Folder Structure
src/
├── app/
│   ├── router.tsx
│   ├── layouts/
│   └── providers/
├── features/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── request/      # Backend request DTOs
│   │   │   └── response/     # Backend response DTOs
│   │   ├── models/           # Domain models
│   │   ├── mappers/          # DTO → Model mappers
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── organizations/
│   ├── work-sessions/
│   ├── places/
│   └── dashboard/
└── shared/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    ├── store/
    └── utils/
## Backend Integration
- **Backend URL:** http://localhost:8080
- **API Base:** /api
- **Full API URL:** http://localhost:8080/api
- **Authentication:** JWT with RS256, stored in localStorage
## API Service Layer Pattern
- Services in `features/{feature}/services/*.service.ts`
- Use centralized Axios instance from `shared/services/api.ts`
- DTOs imported from `features/{feature}/dto/*`
## Roadmap Status
### ✅ Completed
1. Project Setup (React + Vite + Tailwind)
2. Dependencies installed
3. Folder structure created
4. API layer (Axios instance with interceptors)
5. Auth types and service (with known issues)
### 🚧 Next Steps
1. **Step 7:** State Management (Zustand auth store)
2. **Step 8:** Routing Setup (react-router-dom)
3. **Step 9:** Auth UI Pages (Login/Register)
4. **Step 10:** App Initialization Flow
5. **Step 11:** Organization Module
6. **Step 12:** Work Session Module (CORE)
7. **Step 13:** Places Module
8. **Step 14:** Dashboard
## Known Issues to Fix
1. **API URL mismatch:** Frontend points to :3000, Backend runs on :8080
   - Fix: Update `VITE_API_URL` in environment variables
2. **Import paths:** auth.service.ts has broken import paths
3. **Missing DTO:** RegisterRequestDTO referenced but doesn't exist
## Planned Dependencies
### High Priority
- `zustand` - State management
### Medium Priority
- `@tanstack/react-query` - Server state caching
- `react-hook-form` + `@hookform/resolvers` + `zod` - Form handling
- `date-fns` - Date utilities
- `lucide-react` - Icons
### Low Priority
- `clsx` + `tailwind-merge` - Class name utilities
## Design Decisions
- **Token Storage:** localStorage (consider httpOnly cookies later)
- **State Management:** Zustand for UI state, TanStack Query for server state (planned)
- **Forms:** React Hook Form + Zod validation (planned)
- **UI Components:** Plain Tailwind (no component library yet)
- **Date Handling:** date-fns (planned)
## Environment Variables
Create `.env` file:
VITE_API_URL=http://localhost:8080/api
## How to Continue
1. Review this AGENTS.md
2. Fix known issues (API URL, imports)
3. Install `zustand`
4. Follow roadmap sequentially
5. For each new endpoint: Check backend DTO → Create DTO files → Create Mapper → Create Model
❓ Questions Before Creating
1. 
Should I include the backend API endpoint table (from Context.txt) for reference?
2. 
Any specific coding conventions you want documented (naming, imports, etc.)?
3. 
Should I add a "Common Tasks" section with examples of the DTO→Mapper→Model pattern?