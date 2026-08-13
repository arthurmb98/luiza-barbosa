import type {
  AnamnesisPayload,
  NotificationChannelResult,
  SubmitAnamnesisResult,
} from '../../domain/model.js'
import { AnamnesisNotificationError } from '../../domain/errors.js'
import type { EmailNotifier } from '../ports/email-notifier.js'
import type { WhatsAppNotifier } from '../ports/whatsapp-notifier.js'
import {
  buildAnamnesisPdf,
  bytesToBase64,
} from '../services/build-anamnesis-pdf.js'
import {
  formatEmailMessage,
  formatWhatsAppMessage,
} from '../services/format-message.js'
import { parseAndValidateAnamnesisPayload } from '../services/validate-payload.js'

type Dependencies = {
  emailNotifier: EmailNotifier
  whatsappNotifier: WhatsAppNotifier
}

export function createSubmitAnamnesisUseCase(deps: Dependencies) {
  return {
    async execute(input: unknown): Promise<SubmitAnamnesisResult> {
      const payload: AnamnesisPayload = parseAndValidateAnamnesisPayload(input)
      const emailMessage = formatEmailMessage(payload)
      const whatsappMessage = formatWhatsAppMessage(payload)
      const pdf = await buildAnamnesisPdf(payload)

      emailMessage.attachments = [
        {
          filename: pdf.filename,
          contentBase64: bytesToBase64(pdf.bytes),
          contentType: 'application/pdf',
        },
      ]

      const [emailOutcome, whatsappOutcome] = await Promise.allSettled([
        deps.emailNotifier.send(emailMessage, payload),
        deps.whatsappNotifier.send(whatsappMessage, payload),
      ])

      const email = channelResult(emailOutcome, 'email')
      const whatsapp = channelResult(whatsappOutcome, 'whatsapp')

      if (email === 'failed' && whatsapp === 'failed') {
        throw new AnamnesisNotificationError(
          'Falha ao notificar e-mail e WhatsApp.',
        )
      }

      return { email, whatsapp }
    },
  }
}

function channelResult(
  outcome: PromiseSettledResult<NotificationChannelResult>,
  channel: 'email' | 'whatsapp',
): NotificationChannelResult {
  if (outcome.status === 'fulfilled') {
    return outcome.value
  }
  const message =
    outcome.reason instanceof Error
      ? outcome.reason.message
      : String(outcome.reason)
  console.error(`[anamnesis:submit] ${channel} failed`, message)
  return 'failed'
}

export type SubmitAnamnesisUseCase = ReturnType<
  typeof createSubmitAnamnesisUseCase
>
