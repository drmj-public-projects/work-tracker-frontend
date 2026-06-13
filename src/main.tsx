import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n'
import { useAuthStore } from './shared/store/authStore'
import { useThemeStore } from './shared/store/themeStore'
import { Providers } from './app/providers'
import App from './App.tsx'
import { setupAuthInterceptor, setupErrorInterceptor } from './shared/services'

// Hydrate stores from localStorage before rendering
useAuthStore.getState().hydrateFromStorage()
useThemeStore.getState().hydrateFromStorage()
setupAuthInterceptor()
setupErrorInterceptor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
