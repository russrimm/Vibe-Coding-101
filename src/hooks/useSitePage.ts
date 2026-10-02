import { useEffect, useState } from 'react'
import { subscribeToReaderLocation } from '../lib/readerNavigation'

export const SITE_PAGES = ['path', 'playbook', 'coaching'] as const
export type SitePage = (typeof SITE_PAGES)[number]

export function pageFromSearch(search: string): SitePage | null {
  const page = new URLSearchParams(search).get('page')
  return SITE_PAGES.find((candidate) => candidate === page) ?? null
}

export function sitePageHref(page: SitePage | null): string {
  const url = new URL(window.location.href)
  if (page) url.searchParams.set('page', page)
  else url.searchParams.delete('page')
  url.searchParams.delete('module')
  url.hash = ''
  return `${url.pathname}${url.search}`
}

/** Standalone pages keep the active lab in the URL so "Back" returns to it. */
export function useSitePage() {
  const [page, setPage] = useState(() => pageFromSearch(window.location.search))

  useEffect(
    () =>
      subscribeToReaderLocation(() =>
        setPage(pageFromSearch(window.location.search))
      ),
    []
  )

  const openPage = (next: SitePage | null) => {
    const href = sitePageHref(next)
    if (href !== `${window.location.pathname}${window.location.search}`) {
      window.history.pushState(null, '', href)
      // The learning path reads its module from the URL; announce the change.
      if (next === 'path') window.dispatchEvent(new PopStateEvent('popstate'))
    }
    setPage(next)
  }

  const syncPage = () => setPage(pageFromSearch(window.location.search))

  return { page, openPage, syncPage }
}
