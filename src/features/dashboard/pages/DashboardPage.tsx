import { useTranslation } from 'react-i18next'
import { Users, MapPin } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useCurrentWorkSession } from '@/features/work-sessions/hooks/useWorkSessions'
import { usePlaces } from '@/features/places/hooks/usePlaces'
import { ActivityCard } from '../components/ActivityCard'
import { WeekSummaryCard } from '../components/WeekSummaryCard'
import { StatCard } from '../components/StatCard'
import { RecentActivityList } from '../components/RecentActivityList'
import { useOrganizationDetail } from '../hooks/useOrganizationDetail'
import { useDashboardSummary } from '../hooks/useDashboardSummary'
import { useRecentActivity } from '../hooks/useRecentActivity'
import { useMemo } from 'react'

export function DashboardPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)

  const { data: currentSession } = useCurrentWorkSession()
  const { data: weeklySummary } = useDashboardSummary(selectedOrganizationId)
  const { data: memberCount } = useOrganizationDetail(selectedOrganizationId)
  const { data: places } = usePlaces(selectedOrganizationId || '')
  const { data: recentDetail } = useRecentActivity(selectedOrganizationId)

  const weeklyTotalMinutes = useMemo(() => {
    if (!weeklySummary?.summaryBlocks) return 0
    return weeklySummary.summaryBlocks.reduce((sum, b) => sum + b.totalMinutes, 0)
  }, [weeklySummary])

  const placesCount = places?.length ?? 0
  const recentSessions = recentDetail?.sessions ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.welcome', { orgName: currentSession?.place.name || t('dashboard.yourOrganization') })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityCard currentSession={currentSession} />
        </div>
        <WeekSummaryCard weeklyTotalMinutes={weeklyTotalMinutes} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={Users}
          iconColorClass="bg-primary/10 text-primary"
          label={t('dashboard.activeMembers')}
          value={memberCount !== null ? `${memberCount} ${t('dashboard.members')}` : '—'}
        />
        <StatCard
          icon={MapPin}
          iconColorClass="bg-emerald-500/10 text-emerald-500"
          label={t('dashboard.locationsTracking')}
          value={`${placesCount} ${t('dashboard.places')}`}
        />
      </div>

      <RecentActivityList sessions={recentSessions} />
    </div>
  )
}
