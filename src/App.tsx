import { useEffect, useRef, useState, type MouseEvent } from 'react'
import IndustrySelector from './components/IndustrySelector'
import LabWizard from './components/LabWizard'
import ThemeToggle from './components/ThemeToggle'
import GlossaryModal from './components/GlossaryModal'
import AboutModal from './components/AboutModal'
import PlaybookPage from './components/PlaybookPage'
import CoachingPage from './components/CoachingPage'
import { industries } from './types/industry'
import { useTheme } from './hooks/useTheme'
import { useLabProgress } from './hooks/useLabProgress'
import { sitePageHref, useSitePage, type SitePage } from './hooks/useSitePage'
import { emptyIndustryProgress } from './lib/labProgress'
import { auxiliaryReaderHref, followLessonLink } from './lib/readerNavigation'

const navButtonClass =
  'rounded-lg px-2 py-3 text-sm font-semibold hover:bg-slate-100 sm:px-3 dark:hover:bg-slate-700'

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function App() {
  const { theme, toggleTheme, warning: themeWarning } = useTheme()
  const { data, warning, navigate, updateIndustry, resetIndustry } =
    useLabProgress()
  const { page, openPage, syncPage } = useSitePage()
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const industry = industries.find((item) => item.id === data.activeIndustry)
  const progress = industry
    ? (data.byIndustry[industry.id] ?? emptyIndustryProgress())
    : null
  const routeKey = `${page ?? ''}:${industry?.id ?? ''}:${progress?.currentStep ?? ''}`
  const previousRoute = useRef(window.location.hash ? '' : routeKey)
  const backLabel = industry ? 'Back to your lab' : 'Back to home'

  const pageLink = (target: SitePage, label: string) => (
    <a
      href={sitePageHref(target)}
      aria-current={page === target ? 'page' : undefined}
      onClick={(event) => {
        if (isModifiedClick(event)) return
        event.preventDefault()
        openPage(target)
      }}
      className={`${navButtonClass} ${page === target ? 'text-cyan-800 underline dark:text-cyan-300' : ''}`}
    >
      {label}
    </a>
  )

  useEffect(() => {
    if (previousRoute.current === routeKey) return
    previousRoute.current = routeKey
    const lesson = document.getElementById(window.location.hash.slice(1))
    if (lesson && mainRef.current?.contains(lesson)) {
      lesson.focus()
      lesson.scrollIntoView()
    } else {
      mainRef.current?.querySelector('h1')?.focus()
      window.scrollTo({ top: 0 })
    }
  }, [routeKey])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <a
        href={auxiliaryReaderHref(
          'main-content',
          progress?.reading?.[progress.currentStep]
        )}
        onClick={(event) => {
          followLessonLink(event)
          if (event.defaultPrevented) {
            mainRef.current?.focus()
            mainRef.current?.scrollIntoView()
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:text-slate-900"
      >
        Skip to lab content
      </a>
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <a
            href="?"
            onClick={(event) => {
              if (isModifiedClick(event)) return
              event.preventDefault()
              navigate(null)
              syncPage()
            }}
            className="font-bold hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            Vibe Coding Lab
          </a>
          <nav
            aria-label="Site"
            className="flex flex-wrap items-center gap-1 sm:gap-2"
          >
            {pageLink('playbook', 'Playbook')}
            {pageLink('coaching', '1:1 training')}
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className={navButtonClass}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              className={navButtonClass}
            >
              Glossary
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </nav>
        </div>
      </header>

      {(warning || themeWarning) && (
        <div
          role="alert"
          className="mx-auto max-w-7xl p-4 text-amber-900 dark:text-amber-200"
        >
          {warning || themeWarning}
        </div>
      )}

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {page === 'playbook' ? (
          <PlaybookPage
            backLabel={backLabel}
            onBack={() => openPage(null)}
            onOpenCoaching={() => openPage('coaching')}
          />
        ) : page === 'coaching' ? (
          <CoachingPage
            backLabel={backLabel}
            onBack={() => openPage(null)}
            onOpenPlaybook={() => openPage('playbook')}
          />
        ) : industry && progress ? (
          <LabWizard
            industry={industry}
            progress={progress}
            onReset={() => navigate(null)}
            onNavigate={(step) => navigate(industry.id, step)}
            onUpdate={(update) => updateIndustry(industry.id, update)}
            onClearProgress={() => resetIndustry(industry.id)}
          />
        ) : (
          <IndustrySelector
            onSelectIndustry={(selected) => navigate(selected.id)}
            onOpenPage={openPage}
            savedProgress={data.byIndustry}
          />
        )}
      </main>

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  )
}

export default App
