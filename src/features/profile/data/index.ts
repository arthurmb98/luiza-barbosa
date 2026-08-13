import { luizaBarbosa } from './luiza-barbosa'
import type { Profile } from '@/features/profile/domain/profile'

export const profiles: Profile[] = [luizaBarbosa]

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug)
}
