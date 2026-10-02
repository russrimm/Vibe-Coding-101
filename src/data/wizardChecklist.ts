export type WizardStepId =
  | 'setup'
  | 'structure'
  | 'testing'
  | 'completion'
  | 'whatsnext'

export interface ChecklistItem {
  id: string
  text: string
  detail?: string
}

export interface ChecklistSection {
  stepId: WizardStepId
  title: string
  items: ChecklistItem[]
}

export const WIZARD_CHECKLIST: ChecklistSection[] = [
  {
    stepId: 'setup',
    title: 'Set up your workspace',
    items: [
      {
        id: 'setup-desktop-response',
        text: 'I received a reply in the GitHub Copilot desktop app',
        detail:
          'Use the approved desktop app, not VS Code, Copilot CLI, or GitHub Desktop. Resolve access or quota errors first.',
      },
      {
        id: 'setup-tool-versions',
        text: 'I verified Node.js, npm, and Git in my local session',
        detail:
          'Ask Copilot to run node --version, npm --version, and git --version, and record the output it shows. The lab baseline is Node.js 24 LTS.',
      },
      {
        id: 'setup-local-workspace',
        text: 'I verified the actual local session workspace',
        detail:
          'Record the path and any worktree. It is a dedicated learner project, not the portal or an unrelated folder.',
      },
      {
        id: 'setup-permissions',
        text: 'I know what I will allow and when to pause',
        detail:
          'Review each command and target. Do not blindly approve deletion, secrets access, publishing, deployment, or unrelated changes.',
      },
    ],
  },
  {
    stepId: 'structure',
    title: 'Plan and build in small steps',
    items: [
      {
        id: 'structure-small-plan',
        text: 'I agreed on one record type and four small increments',
        detail:
          'Only id, name, and status; synthetic data; list, add, update/search/filter, then browser storage. No cloud or accounts.',
      },
      {
        id: 'structure-preview',
        text: 'I opened the actual preview URL and saw the two sample records',
        detail:
          'Check the heading and New/Done statuses in the generated app. Read Vite’s Local URL; do not assume port 5173.',
      },
      {
        id: 'structure-add-validation',
        text: 'I added a valid record and verified blank/spaces-only names were rejected',
        detail:
          'Add your named test record once. Invalid submits show a useful error without increasing the record count.',
      },
      {
        id: 'structure-status-search',
        text: 'I verified status changes and combined search/filter results',
        detail:
          'Change the test record to In progress; search by lowercase name; Done gives no matches; All with cleared search restores the list.',
      },
      {
        id: 'structure-refresh',
        text: 'I refreshed and verified my saved record/status without duplicate samples',
        detail:
          'Use the same browser profile and exact origin. localStorage is not a database, secure store, or off-device backup.',
      },
    ],
  },
  {
    stepId: 'testing',
    title: 'Test, review, and save',
    items: [
      {
        id: 'testing-acceptance',
        text: 'I recorded passing results for every acceptance-table row',
        detail:
          'Samples, valid add, blank/spaces rejection, status update, search, combined filter, cleared controls, and refresh.',
      },
      {
        id: 'testing-keyboard-mobile',
        text: 'I checked keyboard controls and a narrow viewport',
        detail:
          'Visible focus, useful field errors, no keyboard trap, readable controls at 375px or a recorded approximate narrow window. Not a full accessibility audit.',
      },
      {
        id: 'testing-build-lint',
        text: 'I verified build and lint both finished with exit code 0',
        detail:
          'Ask Copilot to run npm run build and npm run lint in the actual learner workspace. Read both outputs; do not weaken checks to hide failures.',
      },
      {
        id: 'testing-reviewed-commit',
        text: 'I reviewed the files and verified an intentional local Git commit',
        detail:
          'Inspect new and changed files, exclude secrets/generated files, review the staged diff, and have Copilot show git log -1 --oneline and git status --short. No push or deployment.',
      },
    ],
  },
  {
    stepId: 'completion',
    title: 'Reflect on your local prototype',
    items: [
      {
        id: 'completion-explain',
        text: 'I explained the app and its limits (optional reflection)',
        detail:
          'Completion means learner-reported local checks, not deployment, certification, compliance, or production readiness.',
      },
      {
        id: 'completion-return',
        text: 'I recorded how to return to my saved work (optional reflection)',
        detail:
          'Keep the project/session, actual workspace, branch, commit ID, and browser origin. Preserve work before removing a worktree session.',
      },
    ],
  },
  {
    stepId: 'whatsnext',
    title: 'Optional extensions',
    items: [
      {
        id: 'whatsnext-project-rules',
        text: 'I checked project instructions and their scope (optional)',
        detail:
          'Lab 06: inspect the learner project settings, not global App instructions, and review a response against the local/fictional-data boundary.',
      },
      {
        id: 'whatsnext-skill-loaded',
        text: 'I observed beginner-review being discovered and loaded (optional)',
        detail:
          'Lab 06: record the actual SKILL.md path and load/read action. A matching opening sentence alone is not proof.',
      },
      {
        id: 'whatsnext-skill-evidence',
        text: 'I checked the skill report against real evidence (optional)',
        detail:
          'Lab 06: distinguish tool-observed and learner-reported results; missing checks remain NOT RUN.',
      },
      {
        id: 'whatsnext-mcp-citations',
        text: 'I observed MCP search/fetch and checked its citations (optional)',
        detail:
          'Lab 07: record learn-docs-practice scope, actual tool results and source URLs; check transport, authentication, cost and the private-data boundary. A manual web search is not an MCP pass.',
      },
      {
        id: 'whatsnext-mcp-removed',
        text: 'I removed or disabled only my practice MCP connection (optional)',
        detail:
          'Lab 07: inspect available tools after removal/restart. Keep other connections, project files and the working local app unchanged.',
      },
      {
        id: 'whatsnext-one-improvement',
        text: 'I planned one local improvement with a measurable test (optional)',
        detail:
          'Keep the working core commit. This extension is not required for completion.',
      },
      {
        id: 'whatsnext-recheck',
        text: 'I verified and reviewed a new local checkpoint (optional)',
        detail:
          'Repeat affected browser checks, build, and lint. Publishing or cloud integration requires a separate permissions, cost, and privacy review.',
      },
    ],
  },
]
