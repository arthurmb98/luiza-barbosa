import { anaCosta } from './ana-costa'
import { luizaBarbosa } from './luiza-barbosa'
import type { Profile } from '@/types/profile'

export const profiles: Profile[] = [luizaBarbosa, anaCosta]

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug)
}
