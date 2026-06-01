import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/shared/components/DataTable'
import { InvitationCodeStatusBadge, type InvitationCodeStatus } from './InvitationCodeStatusBadge'
import { UsageProgressBar } from './UsageProgressBar'
import { InvitationCodeRowActions } from './InvitationCodeRowActions'
import type { InvitationCode } from '../models/invitation-code.model'

interface InvitationCodesTableProps {
  codes: InvitationCode[]
  onRevoke: (codeId: string) => void
  isRevoking?: boolean
}

export function InvitationCodesTable({
  codes,
  onRevoke,
  isRevoking = false,
}: InvitationCodesTableProps) {
  const { t } = useTranslation('auth')

  const getStatus = (code: InvitationCode): InvitationCodeStatus => {
    if (!code.isActive || code.currentUses >= code.maxUses) return 'exhausted'
    if (code.expiresAt && code.expiresAt < new Date()) return 'expired'
    return 'active'
  }

  const columns: ColumnDef<InvitationCode>[] = [
    {
      key: 'code',
      header: t('invitationCodes.colCode'),
      cell: (row) => <CodeCell code={row.code} />,
    },
    {
      key: 'createdAt',
      header: t('invitationCodes.colCreated'),
      cell: (row) => (
        <span className="text-foreground">
          {row.createdAt.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: t('invitationCodes.colExpiration'),
      cell: (row) => (
        <span className="text-foreground">
          {row.expiresAt
            ? row.expiresAt.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : t('invitationCodes.expirationNever')}
        </span>
      ),
    },
    {
      key: 'usage',
      header: t('invitationCodes.colUsage'),
      cell: (row) => <UsageProgressBar currentUses={row.currentUses} maxUses={row.maxUses} />,
    },
    {
      key: 'status',
      header: t('invitationCodes.colStatus'),
      cell: (row) => <InvitationCodeStatusBadge status={getStatus(row)} />,
    },
    {
      key: 'actions',
      header: t('invitationCodes.colActions'),
      className: 'w-12',
      cell: (row) => (
        <InvitationCodeRowActions
          code={row.code}
          codeId={row.id}
          onRevoke={onRevoke}
          disabled={isRevoking}
        />
      ),
    },
  ]

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <DataTable
        columns={columns}
        data={codes}
        emptyMessage={t('invitationCodes.noCodes')}
        keyExtractor={(row) => row.id}
      />
    </div>
  )
}

function CodeCell({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted font-mono text-sm text-foreground hover:bg-muted-foreground/10 transition-colors cursor-pointer"
      title="Copy to clipboard"
    >
      <span>{code}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </button>
  )
}
