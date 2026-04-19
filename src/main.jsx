import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/Common/Button.css'
import App from './App.jsx'
import { initLenis } from './utils/lenis.js'

// Initialise Lenis smooth scroll (no-op on touch / reduced-motion devices)
initLenis();

const isStandalone =
  window.matchMedia?.('(display-mode: standalone)')?.matches || window.navigator.standalone === true;

if (isStandalone) {
  document.documentElement.classList.add('app-standalone');
  document.body.classList.add('app-standalone');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
