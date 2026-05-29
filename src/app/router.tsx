import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AppLayout } from './layouts/AppLayout'
import { HeaderOnlyLayout } from './layouts/HeaderOnlyLayout'
import { SelectOrganizationPage } from '@/features/organizations/pages/SelectOrganizationPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { WorkSessionsPage } from '@/features/work-sessions/pages/WorkSessionsPage'
import { ActiveTimerPage } from '@/features/work-sessions/pages/ActiveTimerPage'
import { ManualEntryPage } from '@/features/work-sessions/pages/ManualEntryPage'
import { PlacesPage } from '@/features/places/pages/PlacesPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<HeaderOnlyLayout />}>
          <Route
            path="/select-organization"
            element={<SelectOrganizationPage />}
          />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/work-sessions" element={<WorkSessionsPage />} />
          <Route path="/work-sessions/timer" element={<ActiveTimerPage />} />
          <Route
            path="/work-sessions/manual"
            element={<ManualEntryPage />}
          />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
