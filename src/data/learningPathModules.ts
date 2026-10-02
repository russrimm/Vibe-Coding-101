export type PathLevel = 'Intermediate' | 'Advanced'

export interface PathModuleMeta {
  /** Matches the module's lesson-outline ID, for example `lab-08`. */
  id: string
  file: string
  level: PathLevel
  title: string
}

/** Kept free of `?raw` imports so Node-based tests can read it too. */
export const pathModuleMeta: readonly PathModuleMeta[] = [
  {
    id: 'lab-08',
    file: 'lab-08-specs-and-context.md',
    level: 'Intermediate',
    title: 'Write a spec and manage context',
  },
  {
    id: 'lab-09',
    file: 'lab-09-tests-as-guardrails.md',
    level: 'Intermediate',
    title: 'Use tests as guardrails',
  },
  {
    id: 'lab-10',
    file: 'lab-10-debug-and-recover.md',
    level: 'Intermediate',
    title: 'Debug and recover',
  },
  {
    id: 'lab-11',
    file: 'lab-11-branches-prs-and-review.md',
    level: 'Advanced',
    title: 'Branches, pull requests, and AI review',
  },
  {
    id: 'lab-12',
    file: 'lab-12-autopilot-and-parallel-sessions.md',
    level: 'Advanced',
    title: 'Autopilot, parallel sessions, and sandboxing',
  },
  {
    id: 'lab-13',
    file: 'lab-13-custom-agents-and-automations.md',
    level: 'Advanced',
    title: 'Custom agents, automations, and your capstone',
  },
]

/** Learning-path links keep the active lab so "Back to your lab" still works. */
export function pathHref(moduleId?: string, anchor?: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('page', 'path')
  if (moduleId) url.searchParams.set('module', moduleId)
  else url.searchParams.delete('module')
  url.hash = anchor ?? ''
  return `${url.pathname}${url.search}${url.hash}`
}
