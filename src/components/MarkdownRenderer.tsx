import { Children, isValidElement, memo, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import GlossaryTooltip from './GlossaryTooltip'
import { glossarySegments } from '../lib/glossary'
import {
  headingSlug,
  lessonOutline,
  type LessonHeading,
} from '../lib/lessonOutline'
import { followLessonLink, readingMode } from '../lib/readerNavigation'
import { pathHref, pathModuleMeta } from '../data/learningPathModules'
import { sitePageHref } from '../hooks/useSitePage'

/** Screenshots live beside the Markdown in docs/images so GitHub renders them too. */
const docImages = import.meta.glob<string>('../../docs/images/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

function resolveImage(src: string | undefined): string | undefined {
  const match = src ? /^(?:\.\/)?images\/([\w.-]+\.png)$/.exec(src) : null
  return match ? docImages[`../../docs/images/${match[1]}`] : src
}

interface MarkdownRendererProps {
  content: string
  className?: string
  explainTerms?: boolean
  headings?: LessonHeading[]
  /** Levels added to Markdown headings. Lessons use 1 because the page owns the h1. */
  headingOffset?: 0 | 1
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

function headingTag(level: number, offset: number): HeadingTag {
  return `h${Math.min(level + offset, 6)}` as HeadingTag
}

const lessonLinks: Record<string, { step: string; anchor: string }> = {
  'lab-00-prerequisites.md': { step: 'setup', anchor: 'lab-00' },
  'lab-01-plan.md': { step: 'structure', anchor: 'lab-01' },
  'lab-02-build.md': { step: 'structure', anchor: 'lab-02' },
  'lab-03-test-and-save.md': { step: 'testing', anchor: 'lab-03' },
  'lab-04-completion.md': { step: 'completion', anchor: 'lab-04' },
  'lab-05-next-steps.md': { step: 'whatsnext', anchor: 'lab-05' },
  'lab-06-instructions-and-skills.md': { step: 'whatsnext', anchor: 'lab-06' },
  'lab-07-mcp.md': { step: 'whatsnext', anchor: 'lab-07' },
}

function resolveLessonLink(href: string | undefined): string | undefined {
  if (!href || /^[a-z][a-z0-9+.-]*:|^#/i.test(href)) return href
  const [file, fragment] = href.split('#')
  const lesson = file ? lessonLinks[file] : undefined
  const pathModule = pathModuleMeta.find((module) => module.file === file)
  if (pathModule)
    return pathHref(
      pathModule.id,
      fragment ? `${pathModule.id}-${headingSlug(fragment)}` : undefined
    )
  if (file === 'learning-path.md') return pathHref()
  if (file === 'vibe-coding-playbook.md') return sitePageHref('playbook')
  // Standalone pages such as the playbook link into the recommended Retail lab.
  const industry =
    new URLSearchParams(window.location.search).get('industry') ?? 'retail'
  if (lesson) {
    const anchor = fragment
      ? `${lesson.anchor}-${headingSlug(fragment)}`
      : lesson.anchor
    const reader =
      readingMode(window.location.search) === 'guided' ? '&reader=guided' : ''
    return `?industry=${encodeURIComponent(industry)}&step=${lesson.step}${reader}#${anchor}`
  }
  return href.includes('.md')
    ? new URL(
        href,
        'https://github.com/russrimm/Vibe-Coding-101/blob/main/docs/'
      ).href
    : href
}

export function MarkdownRenderer({
  content,
  className = '',
  explainTerms = true,
  headings,
  headingOffset = 1,
}: MarkdownRendererProps) {
  const outline = headings ?? lessonOutline(content)
  const H1 = headingTag(1, headingOffset)
  const H2 = headingTag(2, headingOffset)
  const H3 = headingTag(3, headingOffset)
  const H4 = headingTag(4, headingOffset)
  const explain = (children: ReactNode) =>
    Children.map(children, (child) =>
      typeof child === 'string' && explainTerms
        ? glossarySegments(child).map((segment, index) =>
            segment.term ? (
              <GlossaryTooltip key={index} term={segment.term}>
                {segment.text}
              </GlossaryTooltip>
            ) : (
              segment.text
            )
          )
        : child
    )
  return (
    <div
      className={`min-w-0 break-words text-slate-800 dark:text-slate-200 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const block = Children.toArray(children)[0]
            if (
              isValidElement<{ children?: ReactNode; className?: string }>(
                block
              )
            ) {
              const language =
                block.props.className?.replace('language-', '') ?? 'text'
              return (
                <CodeBlock
                  code={String(block.props.children ?? '').replace(/\n$/, '')}
                  language={language}
                />
              )
            }
            return (
              <pre className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-slate-100">
                {children}
              </pre>
            )
          },
          code({ children }) {
            return (
              <code className="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-900 dark:bg-slate-700 dark:text-slate-100">
                {children}
              </code>
            )
          },
          h1({ children, node }) {
            return (
              <H1
                id={
                  outline.find(
                    (item) => item.line === node?.position?.start.line
                  )?.id
                }
                tabIndex={-1}
                className="mb-5 mt-4 text-3xl font-bold"
              >
                {children}
              </H1>
            )
          },
          h2({ children, node }) {
            return (
              <H2
                id={
                  outline.find(
                    (item) => item.line === node?.position?.start.line
                  )?.id
                }
                tabIndex={-1}
                className="mb-3 mt-8 border-b border-slate-300 pb-2 text-2xl font-bold dark:border-slate-600"
              >
                {children}
              </H2>
            )
          },
          h3({ children, node }) {
            return (
              <H3
                id={
                  outline.find(
                    (item) => item.line === node?.position?.start.line
                  )?.id
                }
                tabIndex={-1}
                className="mb-3 mt-6 text-xl font-bold"
              >
                {children}
              </H3>
            )
          },
          h4({ children }) {
            return <H4 className="mb-2 mt-4 text-lg font-bold">{children}</H4>
          },
          p({ children }) {
            return <p className="mb-4 leading-relaxed">{explain(children)}</p>
          },
          strong({ children }) {
            return <strong>{explain(children)}</strong>
          },
          em({ children }) {
            return <em>{explain(children)}</em>
          },
          a({ href, children }) {
            const target = resolveLessonLink(href)
            const external =
              target?.startsWith('https://') || target?.startsWith('http://')
            return (
              <a
                href={target}
                onClick={
                  target?.startsWith('?industry=') ||
                  /[?&]page=/.test(target ?? '')
                    ? followLessonLink
                    : undefined
                }
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="text-cyan-800 underline underline-offset-2 hover:text-cyan-950 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                {children}
              </a>
            )
          },
          ul({ children }) {
            return (
              <ul className="mb-4 ml-6 list-outside list-disc space-y-2">
                {children}
              </ul>
            )
          },
          ol({ children, start }) {
            return (
              <ol
                start={start}
                className="mb-4 ml-6 list-outside list-decimal space-y-3"
              >
                {children}
              </ol>
            )
          },
          li({ children }) {
            return <li className="pl-1 leading-relaxed">{explain(children)}</li>
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 rounded-r-lg border-l-4 border-cyan-700 bg-cyan-50 p-4 dark:bg-slate-700">
                {children}
              </blockquote>
            )
          },
          table({ children }) {
            return (
              <div className="my-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  {children}
                </table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="border border-slate-400 bg-slate-100 p-3 font-semibold dark:bg-slate-800">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="border border-slate-400 p-3 align-top">
                {explain(children)}
              </td>
            )
          },
          hr() {
            return (
              <hr className="my-6 border-slate-300 dark:border-slate-600" />
            )
          },
          img({ src, alt, title }) {
            return (
              <img
                src={resolveImage(typeof src === 'string' ? src : undefined)}
                alt={alt ?? ''}
                title={title}
                loading="lazy"
                className="my-2 block h-auto max-w-full rounded-lg border border-slate-300 shadow-sm dark:border-slate-600"
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownRenderer)
