import { expect, test } from '@playwright/test'

test.describe('Site public', () => {
  test('afișează pagina principală și navighează în catalog', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/LC Estate Partners/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Locul potrivit')
    await page.getByRole('link', { name: 'Descoperă proprietățile' }).click()
    await expect(page).toHaveURL(/\/proprietati/)
    await expect(page.getByText(/proprietăți găsite/)).toBeVisible()
  })

  test('filtrează ofertele de închiriere', async ({ page }) => {
    await page.goto('http://localhost:3000/proprietati?tranzactie=rent')
    await expect(page.getByText('1 proprietate găsită')).toBeVisible()
    await expect(page.getByText('Casă calmă, aproape de Pădurea Verde')).toBeVisible()
  })

  test('folosește dropdown-uri custom pentru căutare', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.locator('.search-module select')).toHaveCount(0)
    await page.getByRole('button', { name: /Tipul spațiului/ }).click()
    await page.getByRole('option', { name: /Casă sau vilă/ }).click()
    await page.getByRole('button', { name: 'Arată-mi opțiunile' }).click()
    await expect(page).toHaveURL(/tip=house/)
    await expect(page.getByText('1 proprietate găsită')).toBeVisible()
  })

  test('pagina de contact conține formularul conectat', async ({ page }) => {
    await page.goto('http://localhost:3000/contact')
    await expect(page.getByRole('button', { name: 'Trimite mesajul' })).toBeVisible()
    await expect(page.locator('form')).toHaveAttribute('action', '/api/contact')
  })

  test('deschide formularul separat pentru credit', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('.credit-slide').click()
    await expect(page).toHaveURL(/\/credit/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Creditul potrivit')
    await expect(page.locator('form')).toHaveAttribute('action', '/api/credit')
    await expect(page.getByRole('button', { name: 'Solicită analiza' })).toBeVisible()
  })

  test('deschide programarea automată a unei vizionări', async ({ page }) => {
    await page.goto('http://localhost:3000/proprietati/vila-contemporana-dumbravita')
    await page.getByRole('button', { name: 'Alege data și ora' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Alege momentul potrivit.')).toBeVisible()
    await expect(page.locator('.time-options button:not([disabled])').first()).toBeVisible()
  })
})
