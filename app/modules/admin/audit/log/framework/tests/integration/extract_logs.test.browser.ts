import { test } from '@japa/runner'

test.group('Extract logs', () => {
  test('Should extract logs', async ({ visit }) => {
    const logsUrl = 'admin/audit/logs'
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', 'root@mp.co.ao')
    await page.fill('input[name="password"]', '12345678')
    await page.click('button[type="submit"]')

    await page.click(`a[href="/${logsUrl}"]`)
    await page.waitForURL(logsUrl)
    await page.assertUrlContains(logsUrl)
    await page.click('#extract-logs')
    await page.click('#extract-pdf')
  })
})
