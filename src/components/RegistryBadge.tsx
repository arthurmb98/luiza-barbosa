import type { ProfessionalRegistry } from '@/types/profile'

type RegistryBadgeProps = {
  registry: ProfessionalRegistry
}

export function RegistryBadge({ registry }: RegistryBadgeProps) {
  const label = registry.label ?? registry.type
  const qrLabel =
    registry.qrCodeLabel ??
    (registry.type === 'RNTP'
      ? 'Validação RNTP'
      : `Validação ${registry.type}`)

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
      <div className="min-w-0">
        <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Registro profissional
        </h2>
        <p className="mt-1.5 text-muted-foreground">
          Credencial que garante segurança e transparência no atendimento.
        </p>

        <div className="mt-3 inline-flex items-baseline gap-3 border-b border-primary/30 pb-2">
          <span className="font-sans text-base font-semibold uppercase tracking-wider text-primary sm:text-lg">
            {label}:
          </span>
          <span className="font-sans text-base font-semibold tracking-wide text-primary tabular-nums">
            {registry.number}
          </span>
        </div>
      </div>

      {registry.qrCode ? (
        <figure className="flex flex-col items-center gap-2 self-end sm:self-auto">
          <figcaption className="text-center text-xs font-semibold uppercase tracking-wider text-primary">
            {qrLabel}
          </figcaption>
          <img
            src={registry.qrCode}
            alt={qrLabel}
            width={128}
            height={124}
            className="size-28 object-contain sm:size-32"
          />
        </figure>
      ) : null}
    </section>
  )
}
