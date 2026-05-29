import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n'
import { useThemeStore } from './shared/store/themeStore'
import { setupAuthInterceptor } from './shared/services'
import App from './App.tsx'

// Setup interceptors before rendering
useThemeStore.getState().hydrateFromStorage()
setupAuthInterceptor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
