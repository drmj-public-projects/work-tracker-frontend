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
import { AnalyticsPage } from '@/features/reports/pages/AnalyticsPage'
import { CalendarPage } from '@/features/reports/pages/CalendarPage'
import { HistoryPage } from '@/features/reports/pages/HistoryPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { InvitationCodesPage } from '@/features/memberships/pages/InvitationCodesPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { EditProfilePage } from '@/features/profile/pages/EditProfilePage'
import { ProtectedRoute, RoleGuard } from './guards'

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

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/work-sessions" element={<WorkSessionsPage />} />
            <Route path="/work-sessions/timer" element={<ActiveTimerPage />} />
            <Route
              path="/work-sessions/manual"
              element={<ManualEntryPage />}
            />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/reports/analytics" element={<AnalyticsPage />} />
            <Route path="/reports/calendar" element={<CalendarPage />} />
            <Route path="/reports/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />

            <Route element={<RoleGuard allowedRoles={['ADMIN', 'EMPLOYER']} />}>
              <Route
                path="/memberships/invitation-codes"
                element={<InvitationCodesPage />}
              />
            </Route>

            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
