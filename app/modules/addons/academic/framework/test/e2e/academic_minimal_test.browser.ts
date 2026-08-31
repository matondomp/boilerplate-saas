import { test } from '@japa/runner'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'

test.group('Academic Browser — Minimal Smoke Test', () => {
  test('Should open application, login via UI and access Academic dashboard', async ({ visit }) => {
    console.log('\n[SMOKE BROWSER] 1. Abrindo tela de login (/security/auth/login)...')
    const page = await visit('/security/auth/login')

    console.log('[SMOKE BROWSER] 2. Preenchendo credenciais do usuário Root...')
    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    console.log('[SMOKE BROWSER] 3. Aguardando redirecionamento para o Dashboard...')
    await page.waitForURL(/account/)
    await page.assertUrlContains('account')
    console.log('  ↳ ✅ Login realizado com sucesso.')

    console.log('[SMOKE BROWSER] 4. Navegando para o Módulo Academic (/academic/universities)...')
    await page.visit('/academic/universities')
    await page.waitForURL('academic/universities')
    await page.assertUrlContains('academic/universities')

    console.log('[SMOKE BROWSER] 5. Verificando renderização da página de Universidades...')
    await page.waitForSelector('body')
    await page.assertTextIncludes('body', 'Universidade')
    console.log('  ↳ ✅ Página de Universidades carregada e validada visualmente no Browser.\n')
  })
})
