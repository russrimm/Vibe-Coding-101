import { expect, test } from '@playwright/test'
import axe from 'axe-core'
import {
  DEFAULT_COACHING_MINUTES,
  resolveCoachingConfig,
  safeHttpsUrl,
} from '../src/data/coaching'
import { pageFromSearch } from '../src/hooks/useSitePage'

declare global {
  interface Window {
    axe: typeof axe
  }
}

test('coaching settings accept only public https links and bounded values', () => {
  expect(safeHttpsUrl('https://cal.com/example/session')).toBe(
    'https://cal.com/example/session'
  )
  for (const unsafe of [
    '',
    '   ',
    'http://cal.com/example',
    'javascript:alert(1)',
    'https://user:pass@cal.com/example',
    'not a url',
    undefined,
    true,
  ]) {
    expect(safeHttpsUrl(unsafe)).toBeNull()
  }

  expect(resolveCoachingConfig({})).toMatchObject({
    bookingUrl: null,
    priceLabel: null,
    durationMinutes: DEFAULT_COACHING_MINUTES,
  })
  expect(
    resolveCoachingConfig({
      VITE_COACHING_BOOKING_URL: ' https://calendly.com/example/1-1 ',
      VITE_COACHING_PRICE: ' $49 USD ',
      VITE_COACHING_DURATION_MINUTES: '90',
    })
  ).toMatchObject({
    bookingUrl: 'https://calendly.com/example/1-1',
    priceLabel: '$49 USD',
    durationMinutes: 90,
  })
  for (const minutes of ['5', '600', '1.5', 'sixty', '-60']) {
    expect(
      resolveCoachingConfig({ VITE_COACHING_DURATION_MINUTES: minutes })
        .durationMinutes
    ).toBe(DEFAULT_COACHING_MINUTES)
  }
  expect(
    resolveCoachingConfig({ VITE_COACHING_PRICE: 'x'.repeat(41) }).priceLabel
  ).toBeNull()
  expect(pageFromSearch('?page=coaching')).toBe('coaching')
  expect(pageFromSearch('?page=playbook&industry=retail')).toBe('playbook')
  expect(pageFromSearch('?page=admin')).toBeNull()
})

test('header and landing links open the playbook and coaching pages with working back navigation', async ({
  page,
}) => {
  await page.goto('/')
  const site = page.getByRole('navigation', { name: 'Site' })

  await site.getByRole('link', { name: 'Playbook' }).click()
  await expect(page).toHaveURL(/\?page=playbook$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Vibe Coding Playbook' })
  ).toBeFocused()
  await expect(site.getByRole('link', { name: 'Playbook' })).toHaveAttribute(
    'aria-current',
    'page'
  )

  await page.getByRole('button', { name: 'See 1:1 training' }).click()
  await expect(page).toHaveURL(/\?page=coaching$/)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Book a 1:1 vibe coding session',
    })
  ).toBeFocused()
  // No booking URL is configured for tests, so the safe closed state shows.
  await expect(page.getByRole('status')).toContainText(
    'Online booking is not open yet'
  )
  await expect(
    page.getByRole('link', { name: /message Russ on LinkedIn/ })
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/russrimm')
  await expect(
    page.getByRole('link', { name: /Choose a time and pay/ })
  ).toHaveCount(0)

  await page.goBack()
  await expect(page).toHaveURL(/\?page=playbook$/)
  await page.getByRole('button', { name: 'Back to home' }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: /Guide the AI/ })
  ).toBeVisible()

  await page
    .getByRole('region', { name: 'More ways to learn' })
    .getByRole('link', { name: /1:1 training with Russ/ })
    .click()
  await expect(page).toHaveURL(/\?page=coaching$/)
  await page.reload()
  await expect(
    page.getByRole('heading', { level: 1, name: /Book a 1:1/ })
  ).toBeVisible()
})

test('pages opened from a lab return to that lab, and playbook lesson links stay in the portal', async ({
  page,
}) => {
  await page.goto('/?industry=finance&step=structure')
  await page
    .getByRole('navigation', { name: 'Site' })
    .getByRole('link', { name: 'Playbook' })
    .click()
  await expect(page).toHaveURL(/industry=finance/)
  await page.getByRole('button', { name: 'Back to your lab' }).click()
  await expect(page).toHaveURL(/industry=finance&step=structure/)
  await expect(page).not.toHaveURL(/page=/)

  await page.goto('/?page=playbook')
  await page
    .getByRole('link', { name: 'Set up your tools', exact: true })
    .click()
  await expect(page).toHaveURL(/\?industry=retail&step=setup#lab-00$/)
  await expect(page.getByRole('heading', { name: /Lab 00/ })).toBeVisible()
})

for (const theme of ['light', 'dark'] as const) {
  test(`${theme}: playbook and coaching pages are accessible and fit narrow screens`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme
    )
    const violations: string[] = []
    for (const target of ['playbook', 'coaching']) {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto(`/?page=${target}`)
      await page.addScriptTag({ content: axe.source })
      const results = await page.evaluate(async () =>
        window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        })
      )
      violations.push(
        ...results.violations.map(
          (item) =>
            `${target}: ${item.id} ${item.nodes.map((node) => node.target.join(' ')).join(', ')}`
        )
      )
      for (const width of [320, 375, 768]) {
        await page.setViewportSize({ width, height: 812 })
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
          ),
          `${target} at ${width}px`
        ).toBe(true)
      }
    }
    expect(violations).toEqual([])
  })
}
