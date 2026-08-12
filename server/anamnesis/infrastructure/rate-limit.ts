type RateLimitEntry = {
  count: number
  resetAt: number
}

const hits = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 8

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const current = hits.get(ip)

  if (!current || current.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1
  hits.set(ip, current)
  return current.count > MAX_REQUESTS
}
