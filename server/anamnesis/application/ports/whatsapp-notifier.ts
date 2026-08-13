import type {
  AnamnesisPayload,
  NotificationChannelResult,
} from '../../domain/model.js'

export type WhatsAppMessage = {
  /** Full text for console/logs; Cloud API uses template when configured. */
  text: string
  templateBodyParameters: [string, string, string]
}

export interface WhatsAppNotifier {
  send(
    message: WhatsAppMessage,
    payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult>
}
