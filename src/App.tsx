import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { getProfileBySlug } from '@/data/profiles'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'

function HomeRoute() {
  if (siteConfig.homeProfileSlug) {
    const profile = getProfileBySlug(siteConfig.homeProfileSlug)
    if (profile) {
      return <ProfilePage profile={profile} />
    }
  }

  return <HomePage />
}

function ProfileRoute() {
  const { slug } = useParams<{ slug: string }>()
  const profile = slug ? getProfileBySlug(slug) : undefined

  if (!profile) {
    return <Navigate to="/" replace />
  }

  return <ProfilePage profile={profile} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/profissionais" element={<HomePage />} />
      <Route path="/:slug" element={<ProfileRoute />} />
    </Routes>
  )
}
