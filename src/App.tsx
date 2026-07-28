import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { getProfileBySlug } from '@/data/profiles'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'

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
      <Route path="/" element={<HomePage />} />
      <Route path="/:slug" element={<ProfileRoute />} />
    </Routes>
  )
}
