import type {
  AnamnesisPayload,
  NotificationChannelResult,
} from '../../domain/model.js'
import type {
  WhatsAppMessage,
  WhatsAppNotifier,
} from '../../application/ports/whatsapp-notifier.js'

export class ConsoleWhatsAppNotifier implements WhatsAppNotifier {
  async send(
    message: WhatsAppMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    console.info('[anamnesis:whatsapp:console]', {
      textPreview: message.text.slice(0, 280),
      length: message.text.length,
      templateBodyParameters: message.templateBodyParameters,
    })
    return 'logged'
  }
}
