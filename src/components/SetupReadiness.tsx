import { useState, type FormEvent } from 'react'
import { checkToolVersion, type SetupTool } from '../lib/setupChecks'

const tools: {
  id: SetupTool
  label: string
  command: string
  example: string
}[] = [
  {
    id: 'node',
    label: 'Node.js output',
    command: 'node --version',
    example: 'v24.19.0',
  },
  {
    id: 'npm',
    label: 'npm output',
    command: 'npm --version',
    example: '11.17.0',
  },
  {
    id: 'git',
    label: 'Git output',
    command: 'git --version',
    example: 'git version 2.50.1',
  },
]

export default function SetupReadiness() {
  const [values, setValues] = useState<Record<SetupTool, string>>({
    node: '',
    npm: '',
    git: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const allMatch = tools.every(
    (tool) => checkToolVersion(tool.id, values[tool.id]).matches
  )

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const firstFailure = tools.find(
      (tool) => !checkToolVersion(tool.id, values[tool.id]).matches
    )
    if (firstFailure)
      document.getElementById(`version-${firstFailure.id}`)?.focus()
  }

  return (
    <details
      id="tool-output-helper"
      className="mb-6 rounded-xl border border-slate-400 p-4"
    >
      <summary className="cursor-pointer py-2 font-semibold hover:text-cyan-700 dark:hover:text-cyan-300">
        Optional: help me understand my tool output
      </summary>
      <p id="tool-helper-description" className="my-3 text-sm leading-relaxed">
        Ask Copilot to run these commands for you (Lab 00 Step 5), then paste
        just the version output it shows. This helper checks text in this
        browser only: it cannot inspect your computer, execute commands, verify
        installation, or complete checkpoints. Values are not saved or sent
        anywhere. Copy real results into your evidence notes below.
      </p>
      <form
        onSubmit={onSubmit}
        aria-describedby="tool-helper-description"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {tools.map((tool) => {
            const result = checkToolVersion(tool.id, values[tool.id])
            return (
              <div key={tool.id} className="min-w-0">
                <label
                  htmlFor={`version-${tool.id}`}
                  className="block text-sm font-semibold"
                >
                  {tool.label}
                </label>
                <p className="my-2 text-sm">
                  <code>{tool.command}</code>
                </p>
                <input
                  id={`version-${tool.id}`}
                  name={`version-${tool.id}`}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={`Example: ${tool.example}`}
                  value={values[tool.id]}
                  onChange={(event) => {
                    setValues((previous) => ({
                      ...previous,
                      [tool.id]: event.target.value,
                    }))
                    setSubmitted(false)
                  }}
                  aria-invalid={submitted && !result.matches}
                  aria-describedby={submitted ? `result-${tool.id}` : undefined}
                  className="w-full rounded border border-slate-400 bg-white p-3 text-sm dark:bg-slate-900"
                />
                {submitted && (
                  <p
                    id={`result-${tool.id}`}
                    className="mt-2 text-sm leading-relaxed"
                  >
                    <strong>
                      {result.matches ? 'Recognized: ' : 'Needs attention: '}
                    </strong>
                    {result.message}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-cyan-800 px-4 py-3 font-semibold text-white hover:bg-cyan-900"
        >
          Explain these outputs
        </button>
        <p role="status" className="mt-3 text-sm">
          {submitted
            ? allMatch
              ? 'All three pasted outputs look right. Now verify them in your local Copilot session; no checkpoints were changed.'
              : 'Some outputs need attention. Follow the field guidance before continuing.'
            : ''}
        </p>
      </form>
    </details>
  )
}
