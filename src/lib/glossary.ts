import glossaryData from '../data/glossary.json' with { type: 'json' }

export interface GlossaryEntry {
  term: string
  emoji: string
  definition: string
  example?: string
  learnMore?: string
}

export const glossary: Readonly<Record<string, GlossaryEntry>> = glossaryData

const aliases: Record<string, keyof typeof glossaryData> = {
  'vibe coding': 'vibeCoding',
  'GitHub Copilot desktop app': 'copilotDesktop',
  'Copilot desktop app': 'copilotDesktop',
  'Node.js': 'nodejs',
  npm: 'npm',
  LTS: 'lts',
  Git: 'git',
  GitHub: 'github',
  terminal: 'terminal',
  terminals: 'terminal',
  prompt: 'prompt',
  prompts: 'prompt',
  worktree: 'worktree',
  worktrees: 'worktree',
  workspace: 'workspace',
  'working directory': 'workspace',
  scaffold: 'scaffold',
  scaffolding: 'scaffold',
  dependency: 'dependency',
  dependencies: 'dependency',
  lockfile: 'lockfile',
  React: 'react',
  TypeScript: 'typescript',
  Vite: 'vite',
  localhost: 'localhost',
  localStorage: 'localStorage',
  origin: 'origin',
  'exit code': 'exitCode',
  'acceptance criterion': 'acceptanceCriteria',
  'acceptance criteria': 'acceptanceCriteria',
  'synthetic data': 'syntheticData',
  diff: 'diff',
  commit: 'commit',
  commits: 'commit',
  repository: 'repo',
  repo: 'repo',
  branch: 'branch',
  Markdown: 'markdown',
  JSON: 'json',
  'instruction file': 'instructionFiles',
  'instruction files': 'instructionFiles',
  skill: 'skills',
  skills: 'skills',
  MCP: 'mcpServers',
  'MCP server': 'mcpServers',
  'MCP servers': 'mcpServers',
  'pull request': 'pullRequest',
  'pull requests': 'pullRequest',
  Autopilot: 'autopilot',
  'local sandbox': 'sandbox',
  'cloud sandbox': 'sandbox',
  sandboxing: 'sandbox',
  'custom agent': 'customAgent',
  'custom agents': 'customAgent',
  'context window': 'contextWindow',
  spec: 'spec',
  specs: 'spec',
  regression: 'regression',
  'unit test': 'unitTests',
  'unit tests': 'unitTests',
}

const lookup = new Map(
  Object.entries(aliases).map(([alias, key]) => [alias.toLowerCase(), key])
)
const pattern = new RegExp(
  `\\b(?:${Object.keys(aliases)
    .sort((a, b) => b.length - a.length)
    .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})\\b`,
  'gi'
)

/** Annotate prose only; commands, links, and file contents must stay verbatim. */
export function glossarySegments(text: string) {
  const segments: { text: string; term?: string }[] = []
  const seen = new Set<string>()
  let end = 0
  for (const match of text.matchAll(pattern)) {
    const term = lookup.get(match[0].toLowerCase())
    if (!term || seen.has(term)) continue
    segments.push({ text: text.slice(end, match.index) })
    segments.push({ text: match[0], term })
    seen.add(term)
    end = match.index + match[0].length
  }
  segments.push({ text: text.slice(end) })
  return segments
}
