import { useEffect, useRef, useState } from 'react'

interface CodeBlockProps {
  code: string
  language: string
}

const destinations: Record<string, string> = {
  prompt: 'Copilot chat - send this request',
  terminal: 'Terminal - run one line at a time',
  powershell: 'PowerShell - run one line at a time',
  bash: 'macOS/Linux terminal - run one line at a time',
  markdown: 'File content - save at the path in this step',
  json: 'Configuration - review before saving',
  output: 'Example output - do not run',
  text: 'Text to copy',
  diagram: 'Diagram - read only, nothing to run',
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  )
  const resetTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== undefined) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const setTemporaryCopyState = (state: 'copied' | 'error'): void => {
    setCopyState(state)
    if (resetTimerRef.current !== undefined) {
      window.clearTimeout(resetTimerRef.current)
    }
    if (state === 'copied') {
      resetTimerRef.current = window.setTimeout(() => {
        setCopyState('idle')
      }, 1500)
    }
  }

  const copyWithFallback = async (text: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }

    const previousFocus = document.activeElement
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      if (!document.execCommand('copy')) {
        throw new Error('execCommand copy failed')
      }
    } finally {
      textarea.remove()
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }

  const handleCopy = async (): Promise<void> => {
    try {
      await copyWithFallback(code)
      setTemporaryCopyState('copied')
    } catch {
      setTemporaryCopyState('error')
    }
  }

  return (
    <div className="my-4 min-w-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between gap-3 border-b border-slate-600 px-4 py-2">
        <span className="text-xs font-semibold">
          {destinations[language] ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-cyan-800 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          title={
            copyState === 'copied'
              ? 'Copied to clipboard'
              : copyState === 'error'
                ? 'Copy failed'
                : 'Copy to clipboard'
          }
        >
          <span aria-live="polite">
            {copyState === 'copied'
              ? 'Copied!'
              : copyState === 'error'
                ? 'Copy failed'
                : 'Copy'}
          </span>
        </button>
      </div>
      <pre
        tabIndex={0}
        aria-label={`${language} content`}
        className={`overflow-x-auto p-4 text-sm leading-relaxed ${
          language === 'prompt' ? 'whitespace-pre-wrap break-words' : ''
        }`}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {copyState === 'error' && (
        <p role="alert" className="px-4 pb-3 text-sm text-amber-200">
          Clipboard access was blocked. Select the text above and copy it
          manually.
        </p>
      )}
    </div>
  )
}
