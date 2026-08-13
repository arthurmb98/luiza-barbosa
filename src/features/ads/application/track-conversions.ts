const DEFAULT_ADS_ID = 'AW-18358820072'
/** Rótulo da ação "Clique WhatsApp" — pode sobrescrever via VITE_GOOGLE_ADS_CONVERSION_LABEL */
const DEFAULT_CONVERSION_LABEL = '6yxSCLasnN4cEOi5lbJE'
/**
 * Rótulo da ação "Clique Anamnese" (categoria: Enviar formulário de lead).
 * Defina via VITE_GOOGLE_ADS_ANAMNESIS_CONVERSION_LABEL ou aqui após criar no Ads.
 */
const DEFAULT_ANAMNESIS_CONVERSION_LABEL = ''

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

function resolveSendTo(label: string) {
  const trimmed = label.trim()
  if (!trimmed) return ''
  if (trimmed.includes('/')) return trimmed
  return `${getAdsId()}/${trimmed}`
}

function getConversionSendTo() {
  return resolveSendTo(
    import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL?.trim() ||
      DEFAULT_CONVERSION_LABEL,
  )
}

function getAnamnesisConversionSendTo() {
  return resolveSendTo(
    import.meta.env.VITE_GOOGLE_ADS_ANAMNESIS_CONVERSION_LABEL?.trim() ||
      DEFAULT_ANAMNESIS_CONVERSION_LABEL,
  )
}

type TrackOptions = {
  /** Called after the conversion ping (or immediately if gtag is missing). */
  onTracked?: () => void
}

function trackConversionEvent(options: {
  sendTo: string
  engagementEvent: string
  engagementLabel: string
  onTracked?: () => void
}) {
  const { sendTo, engagementEvent, engagementLabel, onTracked } = options
  const gtag = window.gtag

  let done = false
  const finish = () => {
    if (done) return
    done = true
    onTracked?.()
  }

  if (!gtag) {
    finish()
    return
  }

  if (sendTo) {
    gtag('event', 'conversion', {
      send_to: sendTo,
      event_callback: finish,
    })
  } else {
    finish()
  }

  gtag('event', engagementEvent, {
    event_category: 'engagement',
    event_label: engagementLabel,
  })

  // Fallback if event_callback never runs (ad blockers / slow network)
  window.setTimeout(finish, 1500)
}

/**
 * Fires Google Ads conversion for WhatsApp CTA (matches Ads event snippet).
 * Prefer passing onTracked so navigation waits for the conversion hit.
 */
export function trackWhatsAppConversion(options: TrackOptions = {}) {
  trackConversionEvent({
    sendTo: getConversionSendTo(),
    engagementEvent: 'whatsapp_click',
    engagementLabel: 'whatsapp_cta',
    onTracked: options.onTracked,
  })
}

/**
 * Fires Google Ads conversion for Anamnese CTA (lead form category).
 * Prefer passing onTracked so the sheet opens after the conversion hit.
 */
export function trackAnamnesisConversion(options: TrackOptions = {}) {
  trackConversionEvent({
    sendTo: getAnamnesisConversionSendTo(),
    engagementEvent: 'anamnesis_click',
    engagementLabel: 'anamnesis_cta',
    onTracked: options.onTracked,
  })
}
