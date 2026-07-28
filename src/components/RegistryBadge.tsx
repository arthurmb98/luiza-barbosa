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
    <section className="mx-auto max-w-5xl px-5 pt-14 pb-6 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Registro profissional
      </h2>
      <p className="mt-2 text-muted-foreground">
        Credencial que garante segurança e transparência no atendimento.
      </p>

      <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-baseline gap-3 border-b border-primary/30 pb-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {label}
          </span>
          <span className="font-display text-2xl text-foreground sm:text-3xl">
            {registry.number}
          </span>
        </div>

        {registry.qrCode ? (
          <figure className="flex -translate-y-2 flex-col items-center gap-2 self-end sm:self-auto">
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
      </div>
    </section>
  )
}
