import { expect, test } from '@playwright/test'
import axe from 'axe-core'
import { glossarySegments } from '../src/lib/glossary'
import { lessonOutline } from '../src/lib/lessonOutline'
import { checkToolVersion } from '../src/lib/setupChecks'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('glossary matches whole terms, longest aliases and preserves literal text', () => {
  const text =
    'GitHub Copilot desktop app uses Node.js, Git and npm; Git is not GitHub.'
  const segments = glossarySegments(text)
  expect(segments.map((segment) => segment.text).join('')).toBe(text)
  expect(
    segments.filter((segment) => segment.term).map((segment) => segment.term)
  ).toEqual(['copilotDesktop', 'nodejs', 'git', 'npm', 'github'])
  expect(glossarySegments('digital originator npmrc')).toEqual([
    { text: 'digital originator npmrc' },
  ])
})

test('lesson outline ignores fenced file headings and handles Windows line endings', () => {
  const markdown =
    '# Lab 06: Skills\r\n\r\n## Step 1: Make a file\r\n   ```markdown\r\n# Not a lesson\r\n   ```\r\n## Step 1: Make a file\r\n# Lab 07: MCP\r\n## Step 1: Make a file'
  expect(lessonOutline(markdown).map((heading) => heading.id)).toEqual([
    'lab-06',
    'lab-06-step-1-make-a-file',
    'lab-06-step-1-make-a-file-1',
    'lab-07',
    'lab-07-step-1-make-a-file',
  ])
})

test('version helper distinguishes output from commands, errors and unsupported versions', () => {
  expect(checkToolVersion('node', 'v24.19.0').matches).toBe(true)
  for (const value of [
    '',
    'node --version',
    'not recognized',
    'v20.19.0',
    'v26.0.0',
    'v24.1.0-rc.1',
    'v24.19.0\nERROR',
  ]) {
    expect(checkToolVersion('node', value).matches).toBe(false)
  }
  expect(checkToolVersion('npm', '11.17.0').matches).toBe(true)
  expect(checkToolVersion('npm', 'npm.ps1 cannot be loaded').matches).toBe(
    false
  )
  for (const value of [
    'git version 2.50.1',
    'git version 2.50.1.windows.1',
    'git version 2.39.5 (Apple Git-154)',
  ]) {
    expect(checkToolVersion('git', value).matches).toBe(true)
  }
  expect(checkToolVersion('git', '2.50.1').matches).toBe(false)
})

test('documented skill metadata and MCP configuration are valid and narrowly scoped', () => {
  const skillDoc = readFileSync(
    resolve('docs', 'lab-06-instructions-and-skills.md'),
    'utf8'
  )
  const skill = /```markdown\r?\n\s*---([\s\S]*?)```/.exec(skillDoc)?.[1]
  expect(skill).toContain('name: beginner-review')
  expect(skill).toMatch(/description: .+beginner review/)
  expect(skill).toContain('NOT RUN')
  expect(skill).not.toContain('allowed-tools')

  const mcpDoc = readFileSync(resolve('docs', 'lab-07-mcp.md'), 'utf8')
  const json = /```json\r?\n([\s\S]*?)```/.exec(mcpDoc)?.[1]
  expect(json).toBeTruthy()
  expect(JSON.parse(json!)).toEqual({
    mcpServers: {
      'learn-docs-practice': {
        type: 'http',
        url: 'https://learn.microsoft.com/api/mcp',
        tools: ['microsoft_docs_search', 'microsoft_docs_fetch'],
      },
    },
  })
})

test('optional skills and MCP lessons are readable, linked, saved and exported without claiming core completion', async ({
  page,
}) => {
  await page.goto('/?industry=retail&step=whatsnext')
  await page.locator('a[href$="step=whatsnext#lab-06"]').first().click()
  await expect(page.locator('#lab-06')).toBeVisible()
  await expect(page.getByRole('main')).toContainText('/skills reload')
  await page.locator('a[href$="step=whatsnext#lab-07"]').first().click()
  await expect(page.locator('#lab-07')).toBeVisible()
  await expect(page.getByRole('main')).toContainText('microsoft_docs_fetch')
  await expect(
    page.locator('nav[aria-label="Lab steps"] a[href$="step=completion"]')
  ).toHaveCount(0)
  const panel = page.getByRole('region', { name: 'Optional checkpoints' })
  const checkbox = panel.getByRole('checkbox', {
    name: /I observed beginner-review/,
  })
  await checkbox.check()
  await page.reload()
  await expect(checkbox).toBeChecked()
  const downloadPromise = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Download evidence', exact: true })
    .click()
  const stream = await (await downloadPromise).createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  expect(Buffer.concat(chunks).toString('utf8')).toContain(
    '[x] I observed beginner-review'
  )
  await page.getByRole('button', { name: 'Back to test and save' }).click()
  await expect(page).toHaveURL(/step=testing$/)
  await expect(
    page.getByRole('button', { name: 'Finish core lab', exact: true })
  ).toBeDisabled()
})

test('lesson map links to real headings, supports reload and never completes a checkpoint', async ({
  page,
}) => {
  await page.goto('/?industry=retail&step=setup')
  const map = page.getByRole('navigation', { name: 'Lesson map' })
  const links = await map
    .getByRole('link')
    .evaluateAll((items) => items.map((item) => item.getAttribute('href')))
  for (const href of links) {
    expect(href).toBeTruthy()
    await expect(page.locator(href!)).toHaveCount(1)
  }
  await map
    .getByRole('link', {
      name: 'Step 5: Check Node.js, npm, and Git',
      exact: true,
    })
    .click()
  await expect(page).toHaveURL(/#lab-00-step-5-check-nodejs-npm-and-git$/)
  await page.reload()
  await expect(
    page.locator('#lab-00-step-5-check-nodejs-npm-and-git')
  ).toBeFocused()
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0)
})

test('contextual definitions work with hover, keyboard, Escape and touch without altering code', async ({
  page,
  browser,
}) => {
  await page.goto('/?industry=retail&step=setup')
  const term = page
    .getByRole('button', { name: 'Explain Node.js', exact: true })
    .first()
  await term.hover()
  let definition = page.getByRole('dialog', { name: 'Node.js', exact: true })
  await expect(definition).toBeVisible()
  await definition.hover()
  await expect(definition).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(definition).toHaveCount(0)
  await page.keyboard.press('Tab')
  await term.focus()
  await expect(definition).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(
    definition.getByRole('button', { name: 'Close definition of Node.js' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(term).toBeFocused()
  await expect(definition).toHaveCount(0)
  await expect(
    page.locator('pre button, a button, code button, button button')
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Hide word explanations' }).click()
  await expect(page.getByRole('button', { name: /^Explain / })).toHaveCount(0)
  await page.getByRole('button', { name: 'Show word explanations' }).click()
  await expect(term).toBeVisible()

  const touch = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
  })
  const mobile = await touch.newPage()
  await mobile.goto('/?industry=retail&step=setup')
  await mobile
    .getByRole('button', { name: 'Explain Node.js', exact: true })
    .first()
    .tap()
  definition = mobile.getByRole('dialog', { name: 'Node.js', exact: true })
  await expect(definition).toBeVisible()
  const bounds = await definition.boundingBox()
  expect(bounds?.x).toBeGreaterThanOrEqual(0)
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(375)
  await definition
    .getByRole('button', { name: 'Close definition of Node.js' })
    .tap()
  await expect(definition).toHaveCount(0)
  await touch.close()
})

test('tool output help surfaces errors and never asserts machine verification', async ({
  page,
}) => {
  await page.goto('/?industry=retail&step=setup')
  await page
    .getByText('Optional: help me understand my tool output', { exact: true })
    .click()
  await page.getByRole('button', { name: 'Explain these outputs' }).click()
  await expect(page.getByLabel('Node.js output')).toBeFocused()
  await expect(page.getByLabel('Node.js output')).toHaveAttribute(
    'aria-invalid',
    'true'
  )
  await page.getByLabel('Node.js output').fill('v24.19.0')
  await page.getByLabel('npm output').fill('11.17.0')
  await page.getByLabel('Git output').fill('git version 2.50.1.windows.1')
  await page.getByRole('button', { name: 'Explain these outputs' }).click()
  await expect(
    page.locator('#tool-output-helper').getByRole('status')
  ).toContainText('no checkpoints were changed')
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Continue to build', exact: true })
  ).toBeDisabled()
})

for (const theme of ['light', 'dark']) {
  test(`${theme}: optional modules have working heading links and fit narrow screens`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme
    )
    await page.goto('/?industry=retail&step=whatsnext')
    const links = await page
      .getByRole('navigation', { name: 'Lesson map' })
      .getByRole('link')
      .evaluateAll((items) => items.map((item) => item.getAttribute('href')))
    for (const href of links) await expect(page.locator(href!)).toHaveCount(1)
    await page.addScriptTag({ content: axe.source })
    const results = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
    )
    expect(results.violations).toEqual([])
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 812 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true)
    }
  })
  test(`${theme}: contextual definition and output helper have no automated accessibility violations`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme
    )
    await page.goto('/?industry=retail&step=setup')
    await page
      .getByText('Optional: help me understand my tool output', { exact: true })
      .click()
    await page.getByRole('button', { name: 'Explain these outputs' }).click()
    await page.keyboard.press('Tab')
    await page
      .getByRole('button', { name: 'Explain Node.js', exact: true })
      .first()
      .focus()
    await expect(
      page.getByRole('dialog', { name: 'Node.js', exact: true })
    ).toBeVisible()
    await page.addScriptTag({ content: axe.source })
    const results = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
    )
    expect(results.violations).toEqual([])
  })
}
