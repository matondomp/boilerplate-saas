import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'

test.group('Academic Browser E2E — Smoke Test', (group) => {
  group.each.setup(async () => {
    // Mantém o estado consistente para cada execução
  })

  test('Should login via UI, reach Dashboard and navigate to Academic Universities', async ({ visit }) => {
    console.log('[DEBUG] Iniciando o teste...')
    let page: any
    try {
      console.log('[DEBUG] Executando: visit("/security/auth/login") com timeout estendido de 180s...')
      page = await visit('/security/auth/login', { timeout: 180000 })
      console.log('[DEBUG] Visit executado com sucesso! Preenchendo campos com timeout de 180s...')

      // 1. Preencher credenciais e submeter login
      await page.fill('input[name="username"]', rootUser.email, { timeout: 180000 })
      console.log('[DEBUG] Username preenchido.')
      await page.fill('input[name="password"]', rootUser.password)
      console.log('[DEBUG] Password preenchido. Clicando em submit...')
      await page.click('button[type="submit"]')

      // 2. Aguardar redirecionamento para o Dashboard
      console.log('[DEBUG] Aguardando URL do Dashboard...')
      await page.waitForURL('account/dashboard')
      await page.assertUrlContains('account/dashboard')
      console.log('[DEBUG] Dashboard alcançado!')

      // 3. Acessar a tela inicial do módulo Academic
      const academicUrl = 'academic/universities'
      console.log(`[DEBUG] Navegando para /${academicUrl}...`)
      await page.goto(`/${academicUrl}`)
      await page.waitForURL(academicUrl)
      await page.assertUrlContains(academicUrl)

      // 4. Asserção visual de que a página carregou
      await page.waitForSelector('body')
      await page.assertTextIncludes('body', 'Universidade')
      console.log('[DEBUG] Teste finalizado com SUCESSO!')
    } catch (error) {
      console.error('[DEBUG ERROR] O teste lançou uma exceção:', error)
      try {
        if (page) {
          const bodyText = await page.innerText('body')
          console.log('\n[DEBUG ERROR] === CONTEÚDO RENDERIZADO NA TELA DA FALHA ===')
          console.log(bodyText.substring(0, 1000))
          console.log('=========================================================\n')
        }
      } catch (err) {
        console.error('[DEBUG ERROR] Não foi possível ler o texto da tela:', err.message)
      }
      throw error
    }
  }).timeout(240000)
})
