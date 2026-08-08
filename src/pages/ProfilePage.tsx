import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import type { Profile } from '@/types/profile'
import { trackWhatsAppConversion } from '@/lib/ads'
import { buildWhatsAppUrl } from '@/lib/utils'
import { About } from '@/components/About'
import { Hero } from '@/components/Hero'
import { RegistryBadge } from '@/components/RegistryBadge'
import { Specialties } from '@/components/Specialties'
import { WhatsAppCta } from '@/components/WhatsAppCta'

type ProfilePageProps = {
  profile: Profile
}

export function ProfilePage({ profile }: ProfilePageProps) {
  function openContact() {
    const url = buildWhatsAppUrl(profile.whatsapp, profile.whatsappMessage)
    trackWhatsAppConversion({
      onTracked: () => {
        window.open(url, '_blank', 'noopener,noreferrer')
      },
    })
  }

  return (
    <div className="pb-8">
      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          {siteConfig.homeProfileSlug ? (
            <span aria-hidden className="w-12" />
          ) : (
            <Link
              to="/profissionais"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Perfis
            </Link>
          )}
          <span className="rounded-full bg-elevated/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary backdrop-blur">
            {profile.registry.type}
          </span>
        </div>
      </header>

      <Hero profile={profile} onContact={openContact} />
      <Specialties specialties={profile.specialties} />
      <About about={profile.about} />
      <RegistryBadge registry={profile.registry} />
      <WhatsAppCta profile={profile} onContact={openContact} />
      <WhatsAppCta profile={profile} onContact={openContact} floating />
    </div>
  )
}
