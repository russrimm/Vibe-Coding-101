import playbook from '../../docs/vibe-coding-playbook.md?raw'
import MarkdownRenderer from './MarkdownRenderer'

interface PlaybookPageProps {
  onBack: () => void
  backLabel: string
  onOpenCoaching: () => void
}

export default function PlaybookPage({
  onBack,
  backLabel,
  onOpenCoaching,
}: PlaybookPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:bg-slate-700"
      >
        {backLabel}
      </button>
      <MarkdownRenderer content={playbook} headingOffset={0} />
      <aside
        aria-labelledby="playbook-coaching"
        className="mt-10 rounded-xl border border-slate-300 bg-white p-6 dark:border-slate-600 dark:bg-slate-800"
      >
        <h2 id="playbook-coaching" className="text-xl font-bold">
          Want someone beside you?
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
          Book an optional, paid 1:1 video session. We can set up your tools,
          build your first app together, or get you unstuck.
        </p>
        <button
          type="button"
          onClick={onOpenCoaching}
          className="mt-4 rounded-lg bg-cyan-700 px-5 py-3 font-bold text-white hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          See 1:1 training
        </button>
      </aside>
    </div>
  )
}
