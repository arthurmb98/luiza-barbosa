/**
 * Branch-specific site settings.
 * Keep the rest of the app identical across branches; only change this file
 * when a branch should open a specific professional on `/`.
 *
 * - `null` → `/` shows the professionals directory (typical on `master`)
 * - `'slug'` → `/` opens that profile (typical on `feature/<slug>`)
 */
export const siteConfig = {
  homeProfileSlug: 'luiza-barbosa' as string | null,
}
