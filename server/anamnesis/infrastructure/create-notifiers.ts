import type { EmailNotifier, WhatsAppNotifier } from '../application/ports'
import { ConsoleEmailNotifier, ConsoleWhatsAppNotifier } from './console-notifiers'
import { ResendEmailNotifier } from './resend-email-notifier'
import { WhatsAppCloudNotifier } from './whatsapp-cloud-notifier'

export type NotifierBundle = {
  emailNotifier: EmailNotifier
  whatsappNotifier: WhatsAppNotifier
}

export function createNotifiers(env: NodeJS.ProcessEnv = process.env): NotifierBundle {
  const emailTo =
    env.ANAMNESIS_TO_EMAIL?.trim() || 'luizatinoco2606@gmail.com'
  const whatsappTo =
    env.ANAMNESIS_TO_WHATSAPP?.trim() || '5598981263501'

  const resendKey = env.RESEND_API_KEY?.trim()
  const resendFrom =
    env.RESEND_FROM_EMAIL?.trim() || 'Anamnese <onboarding@resend.dev>'

  const emailNotifier = resendKey
    ? new ResendEmailNotifier({
        apiKey: resendKey,
        from: resendFrom,
        to: emailTo,
      })
    : new ConsoleEmailNotifier()

  const waToken = env.WHATSAPP_TOKEN?.trim()
  const waPhoneId = env.WHATSAPP_PHONE_NUMBER_ID?.trim()

  const whatsappNotifier =
    waToken && waPhoneId
      ? new WhatsAppCloudNotifier({
          token: waToken,
          phoneNumberId: waPhoneId,
          toPhone: whatsappTo,
        })
      : new ConsoleWhatsAppNotifier()

  return { emailNotifier, whatsappNotifier }
}
