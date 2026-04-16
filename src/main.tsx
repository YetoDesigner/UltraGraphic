import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registramos el Service Worker para que la PWA se pueda instalar
const updateSW = registerSW({
  onNeedRefresh() {
    // Aquí puedes preguntar al usuario si quiere recargar porque hay nueva versión
  },
  onOfflineReady() {
    // Listo para usarse sin conexión
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
