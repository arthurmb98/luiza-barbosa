import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { profiles } from '@/features/profile/data'
import { leadService } from '@/features/leads'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const [showLeads, setShowLeads] = useState(false)
  const leads = useMemo(
    () => (showLeads ? leadService.list() : []),
    [showLeads],
  )

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Perfil Saúde
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
        Profissionais
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Escolha um perfil para ver a página de divulgação. Cada profissional é um
        arquivo de dados reutilizável.
      </p>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {profiles.map((profile) => (
          <li key={profile.slug}>
            <Link
              to={`/${profile.slug}`}
              className="group block overflow-hidden rounded-3xl border border-border bg-elevated transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted-surface">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-medium text-accent">{profile.profession}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {profile.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile.registry.type} {profile.registry.number}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {import.meta.env.DEV ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-elevated/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Leads (dev)</h2>
              <p className="text-sm text-muted-foreground">
                Dados salvos no localStorage deste navegador.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLeads((value) => !value)}
            >
              {showLeads ? 'Ocultar' : 'Ver leads'}
            </Button>
          </div>
          {showLeads ? (
            leads.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nenhum lead capturado ainda.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {leads.map((lead) => (
                  <li
                    key={lead.id}
                    className="rounded-2xl bg-muted-surface px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-foreground">
                      {lead.name} · {lead.phone}
                    </p>
                    <p className="text-muted-foreground">
                      {lead.profileSlug} ·{' '}
                      {new Date(lead.createdAt).toLocaleString('pt-BR')}
                    </p>
                    {lead.note ? (
                      <p className="mt-1 text-muted-foreground">{lead.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
