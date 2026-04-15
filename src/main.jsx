import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/Common/Button.css'
import App from './App.jsx'
import { initLenis } from './utils/lenis.js'

// Initialise Lenis smooth scroll (no-op on touch / reduced-motion devices)
initLenis();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
