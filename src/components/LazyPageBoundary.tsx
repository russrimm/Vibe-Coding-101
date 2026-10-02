import { Component, type ReactNode } from 'react'

interface LazyPageBoundaryProps {
  children: ReactNode
}

interface LazyPageBoundaryState {
  failed: boolean
}

/** Keeps the portal usable if a lazily loaded page cannot be downloaded. */
export default class LazyPageBoundary extends Component<
  LazyPageBoundaryProps,
  LazyPageBoundaryState
> {
  state: LazyPageBoundaryState = { failed: false }

  static getDerivedStateFromError(): LazyPageBoundaryState {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="mx-auto max-w-4xl px-4 py-10">
        <h1 tabIndex={-1} className="mb-3 text-2xl font-bold">
          This page did not load
        </h1>
        <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
          The portal may have been updated since you opened it, or your
          connection dropped. Reloading usually fixes it. Your lab progress and
          notes are not affected.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-cyan-700 px-5 py-3 font-bold text-white hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Reload the page
        </button>
      </div>
    )
  }
}
