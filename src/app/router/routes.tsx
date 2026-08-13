import { Navigate, useParams } from 'react-router-dom'
import { siteConfig } from '@/shared/config/site'
import { getProfileBySlug } from '@/features/profile/data'
import { HomePage } from '@/pages/home-page'
import { ProfilePage } from '@/pages/profile-page'

export function HomeRoute() {
  if (siteConfig.homeProfileSlug) {
    const profile = getProfileBySlug(siteConfig.homeProfileSlug)
    if (profile) {
      return <ProfilePage profile={profile} />
    }
  }

  return <HomePage />
}

export function ProfileRoute() {
  const { slug } = useParams<{ slug: string }>()
  const profile = slug ? getProfileBySlug(slug) : undefined

  if (!profile) {
    return <Navigate to="/" replace />
  }

  return <ProfilePage profile={profile} />
}
