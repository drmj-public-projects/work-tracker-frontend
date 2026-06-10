import type { ReportRange } from '../store/reportsStore'
import type { SummaryBlock, WorkSessionSummary } from '../models/work-session-summary.model'
import type { TrendDataPoint, BreakdownDataPoint, ComparisonDataPoint } from '../types'

export function getCompareRange(range: ReportRange): ReportRange | null {
  switch (range) {
    case 'THIS_WEEK':
      return 'LAST_WEEK'
    case 'THIS_MONTH':
      return 'LAST_MONTH'
    default:
      return null
  }
}

export function buildTrendsData(blocks: SummaryBlock[]): TrendDataPoint[] {
  return blocks.map((block) => ({
    periodLabel: block.periodLabel,
    earnings: block.totalPay,
    hours: +(block.totalMinutes / 60).toFixed(2),
  }))
}

export function buildBreakdownData(
  totals: {
    timerPay: number
    manualPay: number
    pay: number
  } | null,
  t: (key: string) => string
): BreakdownDataPoint[] {
  if (!totals) return []
  return [
    {
      name: t('analytics.timerEntry'),
      value: totals.timerPay,
      color: 'var(--primary)',
    },
    {
      name: t('analytics.manualEntry'),
      value: totals.manualPay,
      color: 'var(--chart-3)',
    },
  ]
}

export function buildComparisonData(
  base: WorkSessionSummary | undefined,
  compare: WorkSessionSummary | undefined
): ComparisonDataPoint[] {
  if (!base?.summaryBlocks || !compare?.summaryBlocks) return []

  const baseMap = new Map(base.summaryBlocks.map((b) => [b.periodLabel, b.totalPay]))
  const compareMap = new Map(compare.summaryBlocks.map((b) => [b.periodLabel, b.totalPay]))

  const allLabels = Array.from(new Set([...baseMap.keys(), ...compareMap.keys()])).sort()

  return allLabels.map((label) => ({
    periodLabel: label,
    current: baseMap.get(label) || 0,
    previous: compareMap.get(label) || 0,
  }))
}
