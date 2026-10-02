import { useEffect, useRef, useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import {
  learningPathOverview,
  pathHref,
  pathModuleFromSearch,
  pathModules,
} from '../data/learningPath'
import {
  followLessonLink,
  subscribeToReaderLocation,
} from '../lib/readerNavigation'

interface PathPageProps {
  onBack: () => void
  backLabel: string
}

const navLinkClass =
  'flex-1 rounded-lg border border-slate-400 p-4 hover:border-cyan-600 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-600 dark:hover:border-cyan-400 dark:hover:bg-slate-700'

export default function PathPage({ onBack, backLabel }: PathPageProps) {
  const [module, setModule] = useState(() =>
    pathModuleFromSearch(window.location.search)
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const previousModule = useRef(module?.id)

  // This page loads lazily, so the app's route focus may run before it exists.
  useEffect(() => {
    const container = containerRef.current
    if (!container || container.contains(document.activeElement)) return
    const target = document.getElementById(window.location.hash.slice(1))
    if (target && container.contains(target)) {
      target.focus()
      target.scrollIntoView()
    } else {
      container.querySelector('h1')?.focus()
    }
  }, [])

  useEffect(
    () =>
      subscribeToReaderLocation(() =>
        setModule(pathModuleFromSearch(window.location.search))
      ),
    []
  )

  useEffect(() => {
    if (previousModule.current === module?.id) return
    previousModule.current = module?.id
    const target = document.getElementById(window.location.hash.slice(1))
    if (target && containerRef.current?.contains(target)) {
      target.focus()
      target.scrollIntoView()
    } else {
      containerRef.current?.querySelector('h1')?.focus()
      window.scrollTo({ top: 0 })
    }
  }, [module?.id])

  const index = module ? pathModules.indexOf(module) : -1
  const previous = index > 0 ? pathModules[index - 1] : undefined
  const next = index >= 0 ? pathModules[index + 1] : undefined

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:bg-slate-700"
        >
          {backLabel}
        </button>
        {module && (
          <a
            href={pathHref()}
            onClick={followLessonLink}
            className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:bg-slate-700"
          >
            All levels
          </a>
        )}
      </div>
      {module && (
        <p className="mb-2 text-sm font-semibold text-cyan-800 dark:text-cyan-300">
          {module.level} level · step {index + 1} of {pathModules.length} after
          the core lab
        </p>
      )}
      <MarkdownRenderer
        key={module?.id ?? 'overview'}
        content={module?.content ?? learningPathOverview}
        headingOffset={0}
      />
      {module && (
        <nav
          aria-label="Learning path modules"
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          {previous ? (
            <a
              href={pathHref(previous.id)}
              onClick={followLessonLink}
              className={navLinkClass}
            >
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                Previous
              </span>
              <span className="font-bold">{previous.title}</span>
            </a>
          ) : (
            <a
              href={pathHref()}
              onClick={followLessonLink}
              className={navLinkClass}
            >
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                Previous
              </span>
              <span className="font-bold">Learning path overview</span>
            </a>
          )}
          {next && (
            <a
              href={pathHref(next.id)}
              onClick={followLessonLink}
              className={`${navLinkClass} sm:text-right`}
            >
              <span className="block text-sm text-slate-600 dark:text-slate-300">
                Next
              </span>
              <span className="font-bold">{next.title}</span>
            </a>
          )}
        </nav>
      )}
    </div>
  )
}
