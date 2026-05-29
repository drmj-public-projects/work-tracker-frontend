import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n'
import { useThemeStore } from './shared/store/themeStore'
import App from './App.tsx'

// Hydrate theme before rendering
useThemeStore.getState().hydrateFromStorage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
