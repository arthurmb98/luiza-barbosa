import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '@/shared/config/site'
import type { Profile } from '@/features/profile/domain/profile'
import {
  trackAnamnesisConversion,
  trackWhatsAppConversion,
} from '@/features/ads/application/track-conversions'
import { buildWhatsAppUrl } from '@/shared/lib/utils'
import { About } from '@/features/profile/ui/About'
import { AnamnesisSheet } from '@/features/anamnesis/ui/AnamnesisSheet'
import { Hero } from '@/features/profile/ui/Hero'
import { RegistryBadge } from '@/features/profile/ui/RegistryBadge'
import { Specialties } from '@/features/profile/ui/Specialties'
import { WhatsAppCta } from '@/features/profile/ui/WhatsAppCta'

type ProfilePageProps = {
  profile: Profile
}

export function ProfilePage({ profile }: ProfilePageProps) {
  const [anamnesisOpen, setAnamnesisOpen] = useState(false)

  function openContact() {
    const url = buildWhatsAppUrl(profile.whatsapp, profile.whatsappMessage)
    trackWhatsAppConversion({
      onTracked: () => {
        window.open(url, '_blank', 'noopener,noreferrer')
      },
    })
  }

  function openAnamnesis() {
    trackAnamnesisConversion({
      onTracked: () => setAnamnesisOpen(true),
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

      <Hero
        profile={profile}
        onContact={openContact}
        onOpenAnamnesis={openAnamnesis}
      />
      <Specialties specialties={profile.specialties} />
      <About about={profile.about} />
      <RegistryBadge registry={profile.registry} />
      <WhatsAppCta
        profile={profile}
        onContact={openContact}
        onOpenAnamnesis={openAnamnesis}
      />
      <WhatsAppCta profile={profile} onContact={openContact} floating />
      <AnamnesisSheet open={anamnesisOpen} onOpenChange={setAnamnesisOpen} />
    </div>
  )
}
