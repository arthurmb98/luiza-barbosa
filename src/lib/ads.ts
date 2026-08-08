const DEFAULT_ADS_ID = 'AW-18358820072'
/** Rótulo da ação "Clique WhatsApp" — pode sobrescrever via VITE_GOOGLE_ADS_CONVERSION_LABEL */
const DEFAULT_CONVERSION_LABEL = '6yxSCLasnN4cEOi5lbJE'

type GtagFunction = (
  command: 'config' | 'event' | 'js' | 'set',
  targetOrAction: string | Date,
  params?: Record<string, unknown>,
) => void

declare global {
  interface Window {
    gtag?: GtagFunction
    dataLayer?: unknown[]
  }
}

function getAdsId() {
  return import.meta.env.VITE_GOOGLE_ADS_ID?.trim() || DEFAULT_ADS_ID
}

function getConversionSendTo() {
  const label =
    import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL?.trim() ||
    DEFAULT_CONVERSION_LABEL
  if (label.includes('/')) return label
  return `${getAdsId()}/${label}`
}

type TrackOptions = {
  /** Called after the conversion ping (or immediately if gtag is missing). */
  onTracked?: () => void
}

/**
 * Fires Google Ads conversion for WhatsApp CTA (matches Ads event snippet).
 * Prefer passing onTracked so navigation waits for the conversion hit.
 */
export function trackWhatsAppConversion(options: TrackOptions = {}) {
  const { onTracked } = options
  const gtag = window.gtag
  const sendTo = getConversionSendTo()

  let done = false
  const finish = () => {
    if (done) return
    done = true
    onTracked?.()
  }

  if (!gtag || !sendTo) {
    finish()
    return
  }

  gtag('event', 'conversion', {
    send_to: sendTo,
    event_callback: finish,
  })

  gtag('event', 'whatsapp_click', {
    event_category: 'engagement',
    event_label: 'whatsapp_cta',
  })

  // Fallback if event_callback never runs (ad blockers / slow network)
  window.setTimeout(finish, 1500)
}
