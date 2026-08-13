import type {
  AnamnesisPayload,
  NotificationChannelResult,
} from '../../domain/model.js'
import type {
  EmailMessage,
  EmailNotifier,
} from '../../application/ports/email-notifier.js'

export class ConsoleEmailNotifier implements EmailNotifier {
  async send(
    message: EmailMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    console.info('[anamnesis:email:console]', {
      subject: message.subject,
      textPreview: message.text.slice(0, 280),
      attachments: (message.attachments ?? []).map((item) => ({
        filename: item.filename,
        bytesApprox: Math.round((item.contentBase64.length * 3) / 4),
      })),
    })
    return 'logged'
  }
}
