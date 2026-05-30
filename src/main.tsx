import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n'
import { useAuthStore } from './shared/store/authStore'
import { useThemeStore } from './shared/store/themeStore'
import { setupAuthInterceptor } from './shared/services'
import { Providers } from './app/providers'
import App from './App.tsx'

// Hydrate stores from localStorage before rendering
useAuthStore.getState().hydrateFromStorage()
useThemeStore.getState().hydrateFromStorage()
setupAuthInterceptor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
