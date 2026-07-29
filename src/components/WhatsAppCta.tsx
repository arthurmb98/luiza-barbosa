import { MessageCircle } from 'lucide-react'
import type { Profile } from '@/types/profile'
import { Button } from '@/components/ui/button'

type WhatsAppCtaProps = {
  profile: Profile
  onContact: () => void
  floating?: boolean
}

export function WhatsAppCta({
  profile,
  onContact,
  floating = false,
}: WhatsAppCtaProps) {
  if (floating) {
    return (
      <Button
        variant="whatsapp"
        size="icon"
        className="fixed bottom-5 right-5 z-40 size-14 shadow-lg transition-transform hover:scale-105"
        onClick={onContact}
        aria-label={`Falar com ${profile.name} no WhatsApp`}
      >
        <MessageCircle className="size-6" />
      </Button>
    )
  }

  return (
    <section className="border-t border-border bg-elevated/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Vamos conversar?
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Envie uma mensagem pelo WhatsApp e agende seu atendimento com{' '}
            {profile.name}.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {profile.instagram ? (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition-colors hover:text-primary"
              >
                @{profile.instagram}
              </a>
            ) : null}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="transition-colors hover:text-primary"
              >
                {profile.email}
              </a>
            ) : null}
          </div>
        </div>
        <Button variant="whatsapp" size="lg" onClick={onContact}>
          <MessageCircle className="size-5" />
          Falar no WhatsApp
        </Button>
      </div>
    </section>
  )
}
