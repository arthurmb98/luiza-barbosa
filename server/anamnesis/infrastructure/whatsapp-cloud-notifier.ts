import type { AnamnesisPayload, NotificationChannelResult } from '../domain/types'
import { AnamnesisNotificationError } from '../domain/errors'
import type { WhatsAppMessage, WhatsAppNotifier } from '../application/ports'

type WhatsAppCloudConfig = {
  token: string
  phoneNumberId: string
  toPhone: string
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export class WhatsAppCloudNotifier implements WhatsAppNotifier {
  private readonly config: WhatsAppCloudConfig

  constructor(config: WhatsAppCloudConfig) {
    this.config = config
  }

  async send(
    message: WhatsAppMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    const url = `https://graph.facebook.com/v21.0/${this.config.phoneNumberId}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: digitsOnly(this.config.toPhone),
        type: 'text',
        text: {
          preview_url: false,
          body: message.text,
        },
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AnamnesisNotificationError(
        `WhatsApp Cloud API falhou (${response.status}): ${detail.slice(0, 200)}`,
      )
    }

    return 'sent'
  }
}
