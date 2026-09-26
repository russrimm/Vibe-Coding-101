import { ExternalLink } from 'lucide-react'
import { coachingConfig, type CoachingConfig } from '../data/coaching'

interface CoachingPageProps {
  onBack: () => void
  backLabel: string
  onOpenPlaybook: () => void
  config?: CoachingConfig
}

const goodFor = [
  'Installing the tools and signing in for the first time',
  'Building your first small app together, one step at a time',
  'Getting unstuck when the AI goes in circles or an error will not go away',
  'Reviewing an app you already started and planning the next change',
  'Preparing to teach this lab to your own team',
]

const linkClass =
  'font-semibold text-cyan-800 underline hover:text-cyan-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200'

export default function CoachingPage({
  onBack,
  backLabel,
  onOpenPlaybook,
  config = coachingConfig,
}: CoachingPageProps) {
  const { bookingUrl, priceLabel, durationMinutes, contactUrl } = config

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:bg-slate-700"
      >
        {backLabel}
      </button>

      <p className="mb-3 text-sm font-semibold text-cyan-800 dark:text-cyan-300">
        Optional paid coaching
      </p>
      <h1 tabIndex={-1} className="mb-4 text-4xl font-bold">
        Book a 1:1 vibe coding session
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        Everything else on this site is free. If you would like a guide beside
        you, book a private video call with Russ Rimmerman. You share your
        screen, and we work on your computer at your pace. No coding experience
        is needed.
      </p>

      <section
        aria-labelledby="coaching-offer"
        className="mb-10 rounded-xl border border-slate-300 bg-white p-6 dark:border-slate-600 dark:bg-slate-800"
      >
        <h2 id="coaching-offer" className="text-2xl font-bold">
          {durationMinutes}-minute private session
        </h2>
        <p className="mt-2 text-lg font-semibold">
          {priceLabel ?? 'The price is shown before you pay.'}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Online video call. Times are shown in your own time zone.
        </p>
        {bookingUrl ? (
          <>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-bold text-white hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Choose a time and pay
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Booking and payment happen on a secure scheduling page. This
              portal never sees your card details.
            </p>
          </>
        ) : (
          <div
            role="status"
            className="mt-5 rounded-lg border border-amber-600 bg-amber-50 p-4 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"
          >
            <p className="font-semibold">Online booking is not open yet.</p>
            <p className="mt-1">
              To ask about times now,{' '}
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                message Russ on LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="coaching-good-for" className="mb-10">
        <h2 id="coaching-good-for" className="mb-3 text-2xl font-bold">
          What we can work on
        </h2>
        <ul className="ml-6 list-disc space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
          {goodFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="coaching-how" className="mb-10">
        <h2 id="coaching-how" className="mb-3 text-2xl font-bold">
          How booking works
        </h2>
        <ol className="ml-6 list-decimal space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            Select <strong>Choose a time and pay</strong>. A scheduling page
            opens in a new tab.
          </li>
          <li>
            Pick a time that works for you. Read the rescheduling and refund
            terms on that page, then pay.
          </li>
          <li>
            Check your email. You will get a confirmation with a calendar
            invitation and a video-call link.
          </li>
          <li>
            Optional: skim{' '}
            <button
              type="button"
              onClick={onOpenPlaybook}
              className={linkClass}
            >
              the vibe coding playbook
            </button>{' '}
            before the call. It is fine if nothing is installed yet. We can do
            setup together.
          </li>
        </ol>
      </section>

      <section aria-labelledby="coaching-before" className="mb-10">
        <h2 id="coaching-before" className="mb-3 text-2xl font-bold">
          Before you book
        </h2>
        <ul className="ml-6 list-disc space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Bring:</strong> a Windows or Mac computer you can install
            software on, a GitHub account, and a GitHub Copilot plan. If you do
            not have these yet, we can start with setup.
          </li>
          <li>
            <strong>Keep it safe:</strong> use made-up data. Close anything
            private before you share your screen. Never show passwords, keys, or
            customer information.
          </li>
          <li>
            <strong>Work computers:</strong> your company may block installs or
            Copilot features. Coaching cannot get around those rules. Check with
            your IT team first.
          </li>
          <li>
            <strong>What to expect:</strong> this is teaching and hands-on help.
            It is not a promise that an app will be finished, secure, or ready
            for real customers.
          </li>
        </ul>
      </section>

      <section aria-labelledby="coaching-faq">
        <h2 id="coaching-faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h2>
        <h3 className="mt-4 text-lg font-bold">
          Do I need to finish the free lab first?
        </h3>
        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
          No. Many people book because they want help starting it.
        </p>
        <h3 className="mt-4 text-lg font-bold">
          Will the free course stay free?
        </h3>
        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
          Yes. Coaching is optional. Every lesson on this site works without it.
        </p>
        <h3 className="mt-4 text-lg font-bold">Can I bring my own idea?</h3>
        <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
          Yes. We will shrink it to one small first version you can build and
          check in a single session.
        </p>
      </section>
    </div>
  )
}
