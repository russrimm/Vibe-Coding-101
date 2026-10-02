import overview from '../../docs/learning-path.md?raw'
import specs from '../../docs/lab-08-specs-and-context.md?raw'
import tests from '../../docs/lab-09-tests-as-guardrails.md?raw'
import debugging from '../../docs/lab-10-debug-and-recover.md?raw'
import pullRequests from '../../docs/lab-11-branches-prs-and-review.md?raw'
import autopilot from '../../docs/lab-12-autopilot-and-parallel-sessions.md?raw'
import agents from '../../docs/lab-13-custom-agents-and-automations.md?raw'
import { pathModuleMeta, type PathModuleMeta } from './learningPathModules'

export { pathHref } from './learningPathModules'

export interface PathModule extends PathModuleMeta {
  content: string
}

const contents: Record<string, string> = {
  'lab-08': specs,
  'lab-09': tests,
  'lab-10': debugging,
  'lab-11': pullRequests,
  'lab-12': autopilot,
  'lab-13': agents,
}

export const learningPathOverview = overview

export const pathModules: readonly PathModule[] = pathModuleMeta.map((meta) => {
  const content = contents[meta.id]
  if (content === undefined)
    throw new Error(`Learning path module ${meta.id} has no content.`)
  return { ...meta, content }
})

export function pathModuleFromSearch(search: string): PathModule | undefined {
  const id = new URLSearchParams(search).get('module')
  return pathModules.find((module) => module.id === id)
}
