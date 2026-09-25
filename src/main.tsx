import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureReferralCode } from './utils/referralCode'

captureReferralCode()

// A reload should always start at the top (the hero), never at wherever the
// browser last left the page. A deep link with a #section hash is left alone.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (!window.location.hash) window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
