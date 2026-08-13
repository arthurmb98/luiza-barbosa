import { Badge } from '@/shared/ui/badge'

type SpecialtiesProps = {
  specialties: string[]
}

export function Specialties({ specialties }: SpecialtiesProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Especializações
      </h2>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Áreas de atuação e abordagens do atendimento.
      </p>
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {specialties.map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>
    </section>
  )
}
