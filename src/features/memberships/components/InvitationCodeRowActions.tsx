import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, Copy, Check, Ban } from 'lucide-react'

interface InvitationCodeRowActionsProps {
  code: string
  codeId: string
  onRevoke: (codeId: string) => void
  disabled?: boolean
}

export function InvitationCodeRowActions({
  code,
  codeId,
  onRevoke,
  disabled = false,
}: InvitationCodeRowActionsProps) {
  const { t } = useTranslation('auth')
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
    setMenuOpen(false)
  }

  const handleRevoke = () => {
    onRevoke(codeId)
    setMenuOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        disabled={disabled}
        className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={t('invitationCodes.actions')}
      >
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
              {copied ? t('invitationCodes.copied') : t('invitationCodes.copy')}
            </button>
            <div className="border-t border-border" />
            <button
              type="button"
              onClick={handleRevoke}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Ban className="w-4 h-4" />
              {t('invitationCodes.revoke')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
