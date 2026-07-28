import { MessageCircle } from 'lucide-react'
import type { Profile } from '@/types/profile'
import { Button } from '@/components/ui/button'

type HeroProps = {
  profile: Profile
  onContact: () => void
}

export function Hero({ profile, onContact }: HeroProps) {
  return (
    <section className="relative isolate min-h-[88dvh] overflow-hidden">
      <img
        src={profile.photo}
        alt={profile.name}
        className="absolute inset-0 size-full object-cover object-top animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[88dvh] max-w-5xl flex-col justify-end px-5 pb-12 pt-24 sm:px-8">
        <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.18em] text-accent [animation-delay:80ms]">
          {profile.profession}
        </p>
        <h1 className="mt-3 max-w-2xl animate-fade-up font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl md:text-7xl [animation-delay:160ms]">
          {profile.name}
        </h1>
        {profile.tagline ? (
          <p className="mt-4 max-w-md animate-fade-up text-base text-muted-foreground sm:text-lg [animation-delay:240ms]">
            {profile.tagline}
          </p>
        ) : null}
        <div className="mt-8 animate-fade-up [animation-delay:320ms]">
          <Button variant="whatsapp" size="lg" onClick={onContact}>
            <MessageCircle className="size-5" />
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}
