import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react'
import { Input } from '@/shared/components/Input'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { LanguageToggle } from '@/shared/components/LanguageToggle'
import { useAuthStore } from '@/shared/store/authStore'
import { useToast } from '@/shared/hooks/useToast'
import { isAxiosError } from '@/shared/services'
import { loginSchema, type LoginFormData } from '../validation/login.schema'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { toastError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password })
      navigate('/select-organization')
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data as { errorCode?: string; message?: string }
        toastError(apiError.errorCode, apiError.message)
      } else {
        toastError()
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-card border border-border">
          <LanguageToggle />
        </div>
        <div className="p-2 rounded-lg bg-card border border-border">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('app.name')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('app.tagline')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[420px] bg-card rounded-2xl shadow-lg border border-border p-8"
      >
        <div className="mb-5">
          <Input
            label={t('login.emailLabel')}
            icon={<Mail className="w-5 h-5" />}
            type="email"
            placeholder={t('login.emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              {t('login.passwordLabel')}
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              {t('login.forgotPassword')}
            </button>
          </div>
          <Input
            icon={<Lock className="w-5 h-5" />}
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
            {...register('rememberMe')}
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm text-muted-foreground"
          >
            {t('login.rememberMe')}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[var(--button-height-md)] bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : t('login.signInButton')}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('login.orDivider')}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          className="w-full h-[var(--button-height-md)] bg-secondary text-secondary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all border border-border"
        >
          <Building2 className="w-5 h-5" />
          {t('login.ssoButton')}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <button
          type="button"
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          {t('login.registerLink')}
        </button>
      </p>
    </div>
  )
}
