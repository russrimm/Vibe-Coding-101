import { expect, test, type Page } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import axe from 'axe-core'
import { lessonOutline, lessonSections } from '../src/lib/lessonOutline'
import {
  emptyLabProgress,
  isCoreComplete,
  labHref,
  parseProgress,
  PROGRESS_KEY,
} from '../src/lib/labProgress'

const setupAnchor = 'lab-00-step-5-check-nodejs-npm-and-git'
const installAnchor = 'lab-00-step-2-install-sign-in-and-check-copilot'
const buildAnchor = 'lab-02-step-3-add-a-record'
const skillsAnchor = 'lab-06-step-2-create-one-local-review-skill'

async function expectNoCompletion(page: Page) {
  await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0)
  await expect(
    page
      .locator('nav[aria-label="Lab steps"] a')
      .filter({ hasText: 'Reflect on your local prototype' })
  ).toHaveCount(0)
}

test('all guided sections preserve every curriculum line, heading, command and fenced example', () => {
  const docs = readdirSync(resolve('docs'))
    .filter((name) => /^lab-\d{2}-/.test(name))
    .sort()
    .map((name) =>
      readFileSync(resolve('docs', name), 'utf8').replace(/\r\n/g, '\n')
    )
  for (const text of [...docs, docs.join('\n\n---\n\n')]) {
    const sections = lessonSections(text)
    expect(sections.length).toBeGreaterThan(1)
    expect(sections.map((section) => section.content).join('\n')).toBe(text)
    expect(
      sections.flatMap((section) =>
        section.headings.map((heading) => heading.id)
      )
    ).toEqual(lessonOutline(text).map((heading) => heading.id))
    for (const section of sections) {
      const extracted = lessonOutline(section.content)
      expect(extracted.map((heading) => [heading.line, heading.title])).toEqual(
        section.headings.map((heading) => [heading.line, heading.title])
      )
      expect((section.content.match(/^\s*```/gm) ?? []).length % 2).toBe(0)
    }
  }
})

test('reader saves are backward compatible and cannot supply completion evidence', () => {
  expect(parseProgress(JSON.stringify(emptyLabProgress()))).toEqual(
    emptyLabProgress()
  )
  const save = {
    version: 1,
    activeIndustry: 'retail',
    byIndustry: {
      retail: {
        currentStep: 'setup',
        checkedItems: [],
        notes: 'Keep my note',
        reading: {
          setup: { mode: 'guided', anchor: setupAnchor },
          whatsnext: { mode: 'full', anchor: 'lab-07' },
        },
      },
    },
  }
  const parsed = parseProgress(JSON.stringify(save))
  expect(parsed).toEqual(save)
  expect(isCoreComplete(parsed.byIndustry.retail?.checkedItems ?? [])).toBe(
    false
  )
  expect(
    labHref('retail', 'setup', parsed.byIndustry.retail?.reading?.setup)
  ).toBe(`?industry=retail&step=setup&reader=guided#${setupAnchor}`)
  for (const reading of [
    null,
    [],
    { setup: { mode: 'automatic', anchor: 'lab-00' } },
    { setup: { mode: 'guided', anchor: 'https://example.com' } },
  ]) {
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...save,
          byIndustry: { retail: { ...save.byIndustry.retail, reading } },
        })
      )
    ).toThrow('Invalid saved reading position')
  }
})

test('guided reader handles next, previous, full-view switching, history and reload without checking evidence', async ({
  page,
}) => {
  await page.goto('/?industry=retail&step=setup')
  await page.getByRole('link', { name: 'Read one step at a time' }).click()
  await expect(page).toHaveURL(
    /\?industry=retail&step=setup&reader=guided#lab-00$/
  )
  await expect(
    page.getByRole('heading', {
      name: 'Step 2: Install, sign in, and check Copilot',
      exact: true,
    })
  ).toHaveCount(0)
  await page.getByRole('link', { name: /^Next section:/ }).click()
  await expect(
    page.locator('#lab-00-step-1-understand-the-three-places-you-will-work')
  ).toBeFocused()
  await page.getByRole('link', { name: /^Next section:/ }).click()
  await expect(page.locator(`#${installAnchor}`)).toBeFocused()
  await expect(
    page.getByRole('heading', {
      name: 'Install the AI coding app, not a similarly named product',
      exact: true,
    })
  ).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Choose a section')).toHaveValue(installAnchor)
  await expect(page.locator(`#${installAnchor}`)).toBeFocused()
  await page
    .getByRole('link', { name: 'Show full lesson', exact: true })
    .click()
  await expect(
    page.getByRole('heading', {
      name: 'Step 3: Make a dedicated learner folder and local session',
      exact: true,
    })
  ).toBeVisible()
  await page.goBack()
  await expect(page.getByLabel('Choose a section')).toHaveValue(installAnchor)
  await page.goBack()
  await expect(page.getByLabel('Choose a section')).toHaveValue(
    'lab-00-step-1-understand-the-three-places-you-will-work'
  )
  await page.goForward()
  await expect(page.getByLabel('Choose a section')).toHaveValue(installAnchor)
  await page
    .getByRole('link', { name: 'Previous section', exact: true })
    .click()
  await expect(page.getByLabel('Choose a section')).toHaveValue(
    'lab-00-step-1-understand-the-three-places-you-will-work'
  )
  await expectNoCompletion(page)
})

test('saved reader position is isolated by use case and stage, and reset clears it', async ({
  page,
}) => {
  await page.goto(`/?industry=retail&step=setup&reader=guided#${setupAnchor}`)
  await page
    .getByLabel('Your test results, preview address, and next step')
    .fill('Keep this evidence note.')
  await page
    .getByRole('navigation', { name: 'Lab steps' })
    .getByRole('link', { name: /Plan and build/ })
    .click()
  await page.getByLabel('Choose a section').selectOption(buildAnchor)
  await page
    .getByRole('navigation', { name: 'Lab steps' })
    .getByRole('link', { name: /Set up your workspace/ })
    .click()
  await expect(page.getByLabel('Choose a section')).toHaveValue(setupAnchor)
  await page
    .getByRole('button', { name: 'Change use case', exact: true })
    .click()
  const retail = page
    .getByRole('link')
    .filter({ has: page.getByRole('heading', { name: 'Retail', exact: true }) })
  await expect(retail).toHaveAttribute(
    'href',
    `?industry=retail&step=setup&reader=guided#${setupAnchor}`
  )
  await page
    .getByRole('link')
    .filter({
      has: page.getByRole('heading', { name: 'Healthcare', exact: true }),
    })
    .click()
  await expect(
    page.getByRole('link', { name: 'Read one step at a time' })
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Change use case', exact: true })
    .click()
  await page.reload()
  await retail.click()
  await expect(page.getByLabel('Choose a section')).toHaveValue(setupAnchor)
  await expect(
    page.getByLabel('Your test results, preview address, and next step')
  ).toHaveValue('Keep this evidence note.')
  await page
    .getByRole('button', { name: 'Reset this use case', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Clear checkpoints and notes', exact: true })
    .click()
  await expect(page).toHaveURL(/step=setup$/)
  await expect(
    page.getByRole('link', { name: 'Read one step at a time' })
  ).toBeVisible()
  await expect(
    page.getByLabel('Your test results, preview address, and next step')
  ).toHaveValue('')
})

test('cross-module and auxiliary links reveal the right section and preserve reading mode', async ({
  page,
}) => {
  await page.goto(
    `/?industry=retail&step=whatsnext&reader=guided#${skillsAnchor}`
  )
  await expect(page.locator(`#${skillsAnchor}`)).toBeVisible()
  await expect(page.locator('#lab-07')).toHaveCount(0)
  await page
    .getByRole('link', { name: "Jump to this lesson's checkpoints" })
    .click()
  await expect(page.getByLabel('Choose a section')).toHaveValue(skillsAnchor)
  await page.getByLabel('Choose a section').selectOption('lab-07')
  await page.getByRole('link', { name: 'Lab 00', exact: true }).click()
  await expect(page).toHaveURL(/step=setup&reader=guided#lab-00$/)
  await page.goBack()
  await expect(page.getByLabel('Choose a section')).toHaveValue('lab-07')
  await expectNoCompletion(page)
})

test('unavailable section and rejected completion links surface recovery instead of hiding evidence', async ({
  page,
}) => {
  await page.goto('/?industry=retail&step=setup&reader=guided#lab-99-missing')
  await expect(page.getByRole('alert')).toContainText(
    'section link is no longer'
  )
  await expect(page.getByLabel('Choose a section')).toHaveValue('lab-00')
  await page.getByRole('link', { name: /^Next section:/ }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.goto('/?industry=retail&step=completion&reader=guided#lab-04')
  await expectNoCompletion(page)
  await expect(
    page.getByRole('heading', {
      name: 'Lab 04: Explain what you built',
      exact: true,
    })
  ).toHaveCount(0)
})

test('checkpoint links preserve their own reading section across reload, history and new tabs', async ({
  page,
  context,
}) => {
  await page.goto(`/?industry=retail&step=setup&reader=guided#${setupAnchor}`)
  const select = page.getByLabel('Choose a section')
  const checkpoints = page.getByRole('link', {
    name: "Jump to this lesson's checkpoints",
  })
  await checkpoints.click()
  const checkpointUrl = page.url()
  expect(checkpointUrl).toContain(`section=${setupAnchor}#checkpoint-title`)
  await page.reload()
  await expect(select).toHaveValue(setupAnchor)
  await expect(
    page.getByRole('heading', { name: 'Your checkpoints', exact: true })
  ).toBeFocused()
  const fresh = await context.browser()!.newContext()
  const freshPage = await fresh.newPage()
  await freshPage.goto(checkpointUrl)
  await expect(freshPage.getByLabel('Choose a section')).toHaveValue(
    setupAnchor
  )
  await fresh.close()
  const other = installAnchor
  await select.selectOption(other)
  await checkpoints.click()
  await page.goBack()
  await expect(select).toHaveValue(other)
  await page.goBack()
  await expect(page).toHaveURL(checkpointUrl)
  await expect(select).toHaveValue(setupAnchor)
  await page
    .getByRole('link', { name: 'Show full lesson', exact: true })
    .click()
  await expect(page).toHaveURL(new RegExp(`step=setup#${setupAnchor}$`))
  await page.getByRole('link', { name: 'Read one step at a time' }).click()
  await expect(select).toHaveValue(setupAnchor)
  await expectNoCompletion(page)
})

test('skip navigation moves keyboard focus on the landing page and preserves a guided section', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to lab content', exact: true })
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.keyboard.press('Tab')
  const inMain = await page
    .getByRole('main')
    .evaluate((main) => main.contains(document.activeElement))
  expect(inMain).toBe(true)
  await page.goto(`/?industry=retail&step=setup&reader=guided#${setupAnchor}`)
  await page
    .getByRole('link', { name: 'Skip to lab content', exact: true })
    .focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await expect(page.getByLabel('Choose a section')).toHaveValue(setupAnchor)
  await page.reload()
  await expect(page.getByRole('main')).toBeFocused()
  await expect(page.getByLabel('Choose a section')).toHaveValue(setupAnchor)
})

test('legacy auxiliary bookmarks restore a saved section rather than overwriting it', async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, anchor }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          activeIndustry: 'retail',
          byIndustry: {
            retail: {
              currentStep: 'setup',
              checkedItems: [],
              notes: '',
              reading: { setup: { mode: 'guided', anchor } },
            },
          },
        })
      )
    },
    { key: PROGRESS_KEY, anchor: setupAnchor }
  )
  await page.goto('/?industry=retail&step=setup&reader=guided#checkpoint-title')
  await expect(page.getByLabel('Choose a section')).toHaveValue(setupAnchor)
  await page
    .getByRole('link', { name: 'Show full lesson', exact: true })
    .click()
  await expect(page).toHaveURL(new RegExp(`step=setup#${setupAnchor}$`))
})

test('rejected completion navigation preserves the fallback reading position and evidence', async ({
  page,
}) => {
  const finalTestingSection = 'lab-03-common-issues'
  await page.goto(
    `/?industry=retail&step=testing&reader=guided#${finalTestingSection}`
  )
  await page
    .getByLabel('Your test results, preview address, and next step')
    .fill('Do not lose my evidence.')
  await page
    .getByRole('link', { name: 'Lab 04: Explain what you built', exact: true })
    .click()
  await expect(page).toHaveURL(
    new RegExp(`step=testing&reader=guided#${finalTestingSection}$`)
  )
  await expect(page.getByLabel('Choose a section')).toHaveValue(
    finalTestingSection
  )
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.reload()
  await expect(page.getByLabel('Choose a section')).toHaveValue(
    finalTestingSection
  )
  await expect(
    page.getByLabel('Your test results, preview address, and next step')
  ).toHaveValue('Do not lose my evidence.')
  await page.goto('/?industry=retail&step=completion&reader=guided#lab-04')
  await expect(page).toHaveURL(
    new RegExp(`step=testing&reader=guided#${finalTestingSection}$`)
  )
  await expect(page.getByLabel('Choose a section')).toHaveValue(
    finalTestingSection
  )
  await expectNoCompletion(page)
})

test('guided reading keeps exact copied file contents and in-memory notes when storage is blocked', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'SecurityError')
    }
  })
  await page.goto(
    `/?industry=retail&step=whatsnext&reader=guided#${skillsAnchor}`
  )
  const notes = page.getByLabel(
    'Your test results, preview address, and next step'
  )
  await notes.fill('In-memory evidence must survive navigation.')
  const block = page.locator('div').filter({
    has: page.locator(':scope > pre[aria-label="markdown content"]'),
  })
  const exact = await block.locator('pre code').innerText()
  await block.getByRole('button', { name: 'Copy', exact: true }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied.replace(/\r\n/g, '\n')).toBe(exact.replace(/\r\n/g, '\n'))
  await expect(
    page.locator('pre button, a button, code button, button button')
  ).toHaveCount(0)
  await page.getByRole('link', { name: /^Next section:/ }).click()
  await expect(notes).toHaveValue('In-memory evidence must survive navigation.')
  await page.getByRole('link', { name: 'Show full lesson' }).click()
  await page.locator('a[href*="step=setup"]').last().click()
  await expect(notes).toHaveValue('In-memory evidence must survive navigation.')
  await expect(page.getByRole('alert')).toContainText('only kept in this tab')
})

test('reader export contains a resume URL but no evidence in that URL', async ({
  page,
}) => {
  await page.goto(`/?industry=retail&step=setup&reader=guided#${setupAnchor}`)
  await page
    .getByLabel('Your test results, preview address, and next step')
    .fill('Private-in-browser test note.')
  const pending = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Download evidence', exact: true })
    .click()
  const stream = await (await pending).createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  const text = Buffer.concat(chunks).toString('utf8')
  const line = text
    .split('\n')
    .find((value) => value.startsWith('Reading position:'))
  expect(line).toContain(`step=setup&reader=guided#${setupAnchor}`)
  expect(line).not.toContain('Private-in-browser')
})

test('mobile chat prompts wrap visually without adding line breaks to copied text', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(
    `/?industry=retail&step=structure&reader=guided#${buildAnchor}`
  )
  const pre = page.getByLabel('prompt content')
  const before = await pre.locator('code').textContent()
  expect(
    await pre.evaluate((element) => element.scrollWidth <= element.clientWidth)
  ).toBe(true)
  const block = page
    .locator('div')
    .filter({ has: page.locator(':scope > pre[aria-label="prompt content"]') })
  await block.getByRole('button', { name: 'Copy', exact: true }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied.replace(/\r\n/g, '\n')).toBe(before?.replace(/\r\n/g, '\n'))
  await page.setViewportSize({ width: 1280, height: 900 })
  expect(await pre.locator('code').textContent()).toBe(before)
})

for (const theme of ['light', 'dark']) {
  test(`${theme}: all guided sections are reachable, accessible and responsive`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme
    )
    for (const stage of ['setup', 'structure', 'testing', 'whatsnext']) {
      await page.goto(`/?industry=retail&step=${stage}&reader=guided`)
      const select = page.getByLabel('Choose a section')
      const ids = await select
        .locator('option')
        .evaluateAll((options) =>
          options.map((option) => option.getAttribute('value') ?? '')
        )
      for (const id of ids) {
        await select.selectOption(id)
        await expect(page.locator(`#${id}`)).toHaveCount(1)
      }
      await page.addScriptTag({ content: axe.source })
      const results = await page.evaluate(async () =>
        window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        })
      )
      expect(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        }))
      ).toEqual([])
      for (const width of [320, 375, 768]) {
        await page.setViewportSize({ width, height: 812 })
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
          )
        ).toBe(true)
      }
    }
  })
}
