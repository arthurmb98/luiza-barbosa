export class AnamnesisValidationError extends Error {
  readonly fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super('Dados da anamnese inválidos.')
    this.name = 'AnamnesisValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class AnamnesisNotificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnamnesisNotificationError'
  }
}
