import type { ProfessionalRegistry } from '@/types/profile'

type RegistryBadgeProps = {
  registry: ProfessionalRegistry
}

export function RegistryBadge({ registry }: RegistryBadgeProps) {
  const label = registry.label ?? registry.type

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Registro profissional
      </h2>
      <p className="mt-2 text-muted-foreground">
        Credencial que garante segurança e transparência no atendimento.
      </p>
      <div className="mt-8 inline-flex items-baseline gap-3 border-b border-primary/30 pb-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          {label}
        </span>
        <span className="font-display text-2xl text-foreground sm:text-3xl">
          {registry.number}
        </span>
      </div>
    </section>
  )
}
