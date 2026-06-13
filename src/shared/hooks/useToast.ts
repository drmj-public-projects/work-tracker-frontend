import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function useToast() {
  const { t } = useTranslation('auth')

  const toastSuccess = (key: string) => {
    const message = t(key)
    toast.success(message)
  }

  const toastError = (errorCode?: string, fallbackMessage?: string) => {
    const message = errorCode
      ? t(`errorCodes.${errorCode}`, {
          defaultValue: fallbackMessage || t('errorCodes.GENERIC'),
        })
      : fallbackMessage || t('errorCodes.GENERIC')
    toast.error(message)
  }

  const toastLoading = (key: string) => {
    return toast.loading(t(key))
  }

  const toastDismiss = (id: string | number) => {
    toast.dismiss(id)
  }

  const toastPromise = <T,>(
    promise: Promise<T>,
    loadingKey: string,
    successKey: string,
    errorKey?: string
  ) => {
    return toast.promise(promise, {
      loading: t(loadingKey),
      success: () => t(successKey),
      error: errorKey ? t(errorKey) : undefined,
    })
  }

  return {
    toastSuccess,
    toastError,
    toastLoading,
    toastDismiss,
    toastPromise,
  }
}
