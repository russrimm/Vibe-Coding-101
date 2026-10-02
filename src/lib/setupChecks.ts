export type SetupTool = 'node' | 'npm' | 'git'

export interface SetupCheck {
  matches: boolean
  message: string
}

/** Interpret pasted output, never execute it or claim access to the learner's PC. */
export function checkToolVersion(tool: SetupTool, output: string): SetupCheck {
  const value = output.trim()
  if (!value)
    return {
      matches: false,
      message:
        'Ask Copilot to run the command and paste its output, not the command itself.',
    }
  if (tool === 'node') {
    const match = /^v(\d+)\.\d+\.\d+$/.exec(value)
    if (!match)
      return {
        matches: false,
        message:
          'Expected a Node version such as v24.19.0. If the command failed, restart the Copilot app after installing Node.js and ask it to check again.',
      }
    if (Number(match[1]) !== 24)
      return {
        matches: false,
        message:
          'This is not the Node.js 24 LTS lab baseline. Use the approved 24.x LTS installer, or ask your facilitator to rehearse your version first.',
      }
    return {
      matches: true,
      message:
        'Matches the Node.js 24 LTS major-version baseline. This does not check whether your patch is current.',
    }
  }
  if (tool === 'npm') {
    return /^\d+\.\d+\.\d+$/.test(value)
      ? {
          matches: true,
          message:
            'Looks like npm version output. Verify npm also works inside the Copilot session.',
        }
      : {
          matches: false,
          message:
            'Expected only a version number, such as 11.17.0. On Windows, if npm.ps1 is blocked, ask Copilot to use npm.cmd --version; do not weaken execution policy.',
        }
  }
  return /^git version \d+\.\d+(?:\.\d+)?(?:\.windows\.\d+| \(Apple Git-[\d.]+\))?$/.test(
    value
  )
    ? {
        matches: true,
        message:
          'Looks like Git version output. It does not confirm a GitHub sign-in or a saved commit.',
      }
    : {
        matches: false,
        message:
          'Expected output starting with git version, such as git version 2.50.1. Restart the Copilot app after the approved Git installation and ask it to check again.',
      }
}
