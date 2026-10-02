import setup from '../../docs/lab-00-prerequisites.md?raw'
import plan from '../../docs/lab-01-plan.md?raw'
import build from '../../docs/lab-02-build.md?raw'
import testing from '../../docs/lab-03-test-and-save.md?raw'
import completion from '../../docs/lab-04-completion.md?raw'
import nextSteps from '../../docs/lab-05-next-steps.md?raw'
import skills from '../../docs/lab-06-instructions-and-skills.md?raw'
import mcp from '../../docs/lab-07-mcp.md?raw'
import { industries, type Industry } from '../types/industry'

export const curriculumModules = {
  setup,
  structure: `${plan}\n\n---\n\n${build}`,
  testing,
  completion,
  whatsnext: `${nextSteps}\n\n---\n\n${skills}\n\n---\n\n${mcp}`,
}

/** Keep standalone Retail instructions readable while personalizing the portal. */
export function personalizeCurriculum(content: string, industry: Industry) {
  const retail = industries.find((candidate) => candidate.id === 'retail')
  if (!retail)
    throw new Error('The default Retail curriculum definition is missing.')

  const replacements: [string, string][] = [
    [retail.scopeNote, industry.scopeNote],
    [retail.sampleApp.name, industry.sampleApp.name],
    [retail.sampleNames[0], industry.sampleNames[0]],
    [retail.sampleNames[1], industry.sampleNames[1]],
    [retail.newRecordName, industry.newRecordName],
    ['vibe-practice-retail-v1', `vibe-practice-${industry.id}-v1`],
    ['stock items', `${industry.recordLabel}s`],
    ['stock item', industry.recordLabel],
    [
      'The recommended first app is',
      industry.recommended
        ? 'The recommended first app is'
        : 'Your selected app is',
    ],
  ]

  return content
    .split('\n')
    .map((line) =>
      // Screenshots and their captions show the Retail rehearsal, so keep them literal.
      /^\s*(?:!\[|\*Retail example:)/.test(line)
        ? line
        : replacements.reduce(
            (result, [original, replacement]) =>
              result.split(original).join(replacement),
            line
          )
    )
    .join('\n')
}
