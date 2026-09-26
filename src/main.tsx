import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureReferralCode } from './utils/referralCode'
import { initMetaPixel } from './utils/metaPixel'

captureReferralCode()
// Loads the Meta Pixel only if a Pixel ID is configured and the visitor has
// accepted cookies (now, or later via the cookie banner).
initMetaPixel()

// A reload should always start at the top (the hero), never at wherever the
// browser last left the page. A deep link with a #section hash is left alone.
// Old or shared links ending in #top: drop the hash (keeping any ?ref=) so the
// address stays clean; the page then starts at the top like any other load.
if (window.location.hash === '#top') {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (!window.location.hash) window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
