import { Analytics } from '@vercel/analytics/react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/home-page'
import { HomeRoute, ProfileRoute } from '@/app/router/routes'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/profissionais" element={<HomePage />} />
        <Route path="/:slug" element={<ProfileRoute />} />
      </Routes>
      <Analytics />
    </>
  )
}
