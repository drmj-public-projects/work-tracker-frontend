import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings, MapPin, FilePlus, PenLine, Building2, Copy, Check, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useOrganizationSettings } from '@/features/organizations/hooks/useOrganizationSettings'
import { useSaveOrganizationSettings } from '@/features/organizations/hooks/useSaveOrganizationSettings'

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-input'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function SettingsPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const selectedOrganizationName = useAuthStore((s) => s.selectedOrganizationName)
  const setOrganizationSettings = useAuthStore((s) => s.setOrganizationSettings)


  const { data: currentSettings, isLoading: isLoadingSettings } =
    useOrganizationSettings(selectedOrganizationId)

  const saveMutation = useSaveOrganizationSettings(selectedOrganizationId)

  const [requireLocation, setRequireLocation] = useState(false)
  const [allowManualEntries, setAllowManualEntries] = useState(true)
  const [allowEditAfterSubmit, setAllowEditAfterSubmit] = useState(true)
  const [copied, setCopied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync local state with fetched settings
  useEffect(() => {
    if (currentSettings) {
      setRequireLocation(currentSettings.requireLocation)
      setAllowManualEntries(currentSettings.allowManualEntries)
      setAllowEditAfterSubmit(currentSettings.allowEditAfterSubmit)
      setHasChanges(false)
    }
  }, [currentSettings])

  // Track changes from initial fetched state
  useEffect(() => {
    if (!currentSettings) return
    const changed =
      requireLocation !== currentSettings.requireLocation ||
      allowManualEntries !== currentSettings.allowManualEntries ||
      allowEditAfterSubmit !== currentSettings.allowEditAfterSubmit
    setHasChanges(changed)
  }, [requireLocation, allowManualEntries, allowEditAfterSubmit, currentSettings])

  const handleSave = () => {
    if (!selectedOrganizationId) return
    saveMutation.mutate(
      {
        requireLocation,
        allowManualEntries,
        allowEditAfterSubmit,
      },
      {
        onSuccess: (saved) => {
          setOrganizationSettings(saved)
          setHasChanges(false)
        },
      }
    )
  }

  const handleCancel = () => {
    if (currentSettings) {
      setRequireLocation(currentSettings.requireLocation)
      setAllowManualEntries(currentSettings.allowManualEntries)
      setAllowEditAfterSubmit(currentSettings.allowEditAfterSubmit)
    }
    setHasChanges(false)
  }

  const handleCopyId = async () => {
    if (!selectedOrganizationId) return
    try {
      await navigator.clipboard.writeText(selectedOrganizationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  const settingsItems = [
    {
      id: 'requireLocation',
      icon: MapPin,
      label: t('settings.requireLocation'),
      description: t('settings.requireLocationDesc'),
      value: requireLocation,
      onChange: setRequireLocation,
    },
    {
      id: 'allowManualEntries',
      icon: FilePlus,
      label: t('settings.allowManualEntries'),
      description: t('settings.allowManualEntriesDesc'),
      value: allowManualEntries,
      onChange: setAllowManualEntries,
    },
    {
      id: 'allowEditAfterSubmit',
      icon: PenLine,
      label: t('settings.allowEditAfterSubmit'),
      description: t('settings.allowEditAfterSubmitDesc'),
      value: allowEditAfterSubmit,
      onChange: setAllowEditAfterSubmit,
    },
  ]

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">{t('settings.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      {/* Organization Identity */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {t('settings.identity')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {t('settings.orgName')}
            </label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium">
                {selectedOrganizationName ?? t('settings.unknownOrg')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {t('settings.orgId')}
            </label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <code className="text-xs font-mono text-foreground truncate flex-1">
                {selectedOrganizationId ?? t('settings.unknownOrg')}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="shrink-0 p-1.5 rounded-md hover:bg-muted-foreground/10 transition-colors"
                title={t('settings.copy')}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{t('settings.orgIdDesc')}</p>
          </div>
        </div>
      </div>

      {/* General Configuration */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {t('settings.general')}
          </h2>
        </div>

        <div className="space-y-6">
          {settingsItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 py-2"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
              <div className="shrink-0 pt-1">
                <ToggleSwitch
                  checked={item.value}
                  onChange={item.onChange}
                  disabled={saveMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {saveMutation.isError && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {t('settings.error')}
        </div>
      )}

      {/* Success */}
      {saveMutation.isSuccess && !hasChanges && !saveMutation.isPending && (
        <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
          {t('settings.savedSuccess')}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!hasChanges || saveMutation.isPending}
          className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('settings.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || saveMutation.isPending}
          className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('settings.save')}
        </button>
      </div>
    </div>
  )
}
