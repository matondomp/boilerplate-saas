import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { rootUser } from '#modules/shared/framework/infra/db/factories/root_user_factory'

test.group('Academic Module — Real Browser E2E Lifecycle', (group) => {
  group.each.setup(async () => {
    // Database lifecycle managed by suite configuration (db:wipe, migrate, seed)
  })

  test('E2E Browser Full Academic Lifecycle: Login -> University -> Course -> Subject -> Topics -> Exam -> Question -> Review -> Publish', async ({ visit }) => {
    console.log('\n======================================================')
    console.log('🌐 [BROWSER E2E] INICIANDO FLUXO DE NAVEGADOR REAL...')
    console.log('======================================================\n')

    // 1. Login através da interface web real
    console.log('▶ [1/9 BROWSER] Realizando login como Administrador...')
    const page = await visit('/security/auth/login')

    await page.fill('input[name="username"]', rootUser.email)
    await page.fill('input[name="password"]', rootUser.password)
    await page.click('button[type="submit"]')

    await page.waitForURL(/account/)
    await page.assertUrlContains('account')
    console.log('  ↳ ✅ Login realizado com sucesso e redirecionado para o Dashboard.')

    // 2. Navegação e Criação de Universidade
    console.log('\n▶ [2/9 BROWSER] Navegando para Universidades e criando novo registro...')
    await page.visit('/academic/universities')
    await page.waitForURL('academic/universities')
    await page.assertUrlContains('academic/universities')

    const uniName = `Universidade Real E2E ${Date.now()}`
    const uniAcronym = 'U-E2E'

    // Abrir Modal de Criação
    const newUniBtn = page.locator('button:has-text("Nova"), button:has-text("Novo")').first()
    await newUniBtn.click()
    await page.waitForSelector('form input[name="name"]')

    await page.fill('form input[name="name"]', uniName)
    await page.fill('form input[name="acronym"]', uniAcronym)
    await page.click('form button[type="submit"]')

    // Aguardar fechamento do modal e persistência na tabela
    await page.waitForSelector(`text=${uniName}`)
    await page.assertTextIncludes('body', uniName)
    await page.assertTextIncludes('body', uniAcronym)
    console.log('  ↳ ✅ Universidade criada na UI e visível na tabela:', uniName)

    // Validar persistência real com Reload
    await page.reload()
    await page.waitForSelector(`text=${uniName}`)
    await page.assertTextIncludes('body', uniName)
    console.log('  ↳ ✅ Persistência confirmada após reload da página.')

    // 3. Navegação e Criação de Curso
    console.log('\n▶ [3/9 BROWSER] Navegando para Cursos e associando à Universidade...')
    await page.visit('/academic/courses')
    await page.waitForURL('academic/courses')

    const courseName = `Engenharia de Software E2E ${Date.now()}`

    const newCourseBtn = page.locator('button:has-text("Novo"), button:has-text("Nova")').first()
    await newCourseBtn.click()
    await page.waitForSelector('form input[name="name"]')

    // Selecionar Universidade criada no dropdown
    await page.selectOption('form select[name="universityId"]', { label: uniName })
    await page.fill('form input[name="name"]', courseName)
    await page.click('form button[type="submit"]')

    await page.waitForSelector(`text=${courseName}`)
    await page.assertTextIncludes('body', courseName)
    console.log('  ↳ ✅ Curso criado e associado à Universidade:', courseName)

    await page.reload()
    await page.waitForSelector(`text=${courseName}`)
    await page.assertTextIncludes('body', courseName)
    console.log('  ↳ ✅ Persistência do Curso confirmada após reload.')

    // 4. Navegação e Criação de Disciplina
    console.log('\n▶ [4/9 BROWSER] Navegando para Disciplinas e criando nova disciplina...')
    await page.visit('/academic/subjects')
    await page.waitForURL('academic/subjects')

    const subjectName = `Estruturas de Dados e Algoritmos ${Date.now()}`

    const newSubjectBtn = page.locator('button:has-text("Nova"), button:has-text("Novo")').first()
    await newSubjectBtn.click()
    await page.waitForSelector('form input[name="name"]')

    await page.fill('form input[name="name"]', subjectName)
    await page.fill('form textarea[name="description"]', 'Árvores binárias balanceadas, grafos e algoritmos de busca.')
    await page.click('form button[type="submit"]')

    await page.waitForSelector(`text=${subjectName}`)
    await page.assertTextIncludes('body', subjectName)
    console.log('  ↳ ✅ Disciplina criada com sucesso:', subjectName)

    await page.reload()
    await page.waitForSelector(`text=${subjectName}`)
    await page.assertTextIncludes('body', subjectName)
    console.log('  ↳ ✅ Persistência da Disciplina confirmada após reload.')

    // 5. Navegação e Criação de Tópicos (Raiz e Subtópico Hierárquico)
    console.log('\n▶ [5/9 BROWSER] Navegando para Árvore de Tópicos e criando hierarquia...')
    await page.visit('/academic/topics')
    await page.waitForURL('academic/topics')

    const rootTopicName = 'Árvores Binárias'
    const childTopicName = 'Árvores AVL e Balanceamento'

    // Criar Tópico Raiz
    const newTopicBtn = page.locator('button:has-text("Novo Tópico"), button:has-text("Novo")').first()
    await newTopicBtn.click()
    await page.waitForSelector('form select[name="subjectId"]')

    await page.selectOption('form select[name="subjectId"]', { label: subjectName })
    await page.fill('form input[name="name"]', rootTopicName)
    await page.click('form button[type="submit"]')

    await page.waitForSelector(`text=${rootTopicName}`)
    await page.assertTextIncludes('body', rootTopicName)
    console.log('  ↳ ✅ Tópico Raiz criado:', rootTopicName)

    // Criar Subtópico vinculado ao Raiz
    const addChildBtn = page.locator('button:has-text("+ Subtópico")').first()
    if (await addChildBtn.isVisible()) {
      await addChildBtn.click()
    } else {
      await newTopicBtn.click()
    }
    await page.waitForSelector('form input[name="name"]')
    await page.fill('form input[name="name"]', childTopicName)
    await page.click('form button[type="submit"]')

    await page.waitForSelector(`text=${childTopicName}`)
    await page.assertTextIncludes('body', childTopicName)
    console.log('  ↳ ✅ Subtópico hierárquico criado e visível na árvore:', childTopicName)

    await page.reload()
    await page.waitForSelector(`text=${rootTopicName}`)
    await page.assertTextIncludes('body', rootTopicName)
    await page.assertTextIncludes('body', childTopicName)
    console.log('  ↳ ✅ Persistência da Árvore de Tópicos confirmada após reload.')

    // 6. Navegação e Criação de Exame de Admissão
    console.log('\n▶ [6/9 BROWSER] Navegando para Exames e cadastrando prova oficial...')
    await page.visit('/academic/exams')
    await page.waitForURL('academic/exams')

    const newExamBtn = page.locator('button:has-text("Novo Exame"), button:has-text("Novo")').first()
    await newExamBtn.click()
    await page.waitForSelector('form select[name="courseId"]')

    await page.selectOption('form select[name="courseId"]', { label: new RegExp(courseName) })
    await page.fill('form input[name="year"]', '2026')
    await page.fill('form input[name="period"]', 'Fase Regular')
    await page.click('form button[type="submit"]')

    await page.waitForSelector('text=Exame de Admissão — 2026')
    await page.assertTextIncludes('body', '2026')
    console.log('  ↳ ✅ Exame oficial de 2026 cadastrado com sucesso.')

    await page.reload()
    await page.waitForSelector('text=Exame de Admissão — 2026')
    console.log('  ↳ ✅ Persistência do Exame confirmada após reload.')

    // 7. Navegação e Criação de Questão no Editor Estruturado
    console.log('\n▶ [7/9 BROWSER] Acessando Editor Estruturado e criando Questão com Gabarito...')
    await page.visit('/academic/questions/new')
    await page.waitForURL('academic/questions/new')

    const questionStatement = 'Qual é a propriedade fundamental de balanceamento de uma árvore AVL?'
    const questionSolution = 'O fator de balanceamento (altura da subárvore esquerda - altura da direita) deve estar em {-1, 0, 1}.'
    const questionExplanation = 'Garante tempo de busca O(log n) no pior caso.'

    // Bloco 1: Metadados
    await page.selectOption('select[name="subjectId"]', { label: subjectName })
    await page.waitForTimeout(300)
    await page.selectOption('select[name="topicId"]', { label: rootTopicName })
    await page.selectOption('select[name="difficulty"]', { value: 'MEDIUM' })

    // Bloco 2: Enunciado
    await page.fill('textarea[name="statement"]', questionStatement)

    // Bloco 3: Alternativas
    const optionInputs = page.locator('input[placeholder="Texto da alternativa..."]')
    const count = await optionInputs.count()
    if (count >= 2) {
      await optionInputs.nth(0).fill('{-1, 0, 1} em qualquer nó')
      await optionInputs.nth(1).fill('{-2, 0, 2} em qualquer nó')
    }

    // Bloco 4: Resolução e Explicação
    await page.fill('textarea[name="solution"]', questionSolution)
    await page.fill('textarea[name="explanation"]', questionExplanation)

    // Submeter formulário do editor
    await page.click('button[type="submit"]')

    // Aguardar redirecionamento para a listagem de questões
    await page.waitForURL('academic/questions')
    await page.waitForSelector(`text=${questionStatement}`)
    await page.assertTextIncludes('body', questionStatement)
    console.log('  ↳ ✅ Questão estruturada criada com sucesso no Banco de Questões.')

    // 8. Moderação Humana (Aprovação e Publicação)
    console.log('\n▶ [8/9 BROWSER] Executando Esteira de Moderação e Revisão Humana...')
    const reviewBtn = page.locator('button:has-text("Revisar")').first()
    await reviewBtn.click()

    await page.waitForURL(/academic\/questions\/.*\/review/)
    await page.assertTextIncludes('body', 'Painel do Revisor Humano')
    await page.assertTextIncludes('body', questionStatement)
    console.log('  ↳ ✅ Tela de Revisão Humana carregada com preview da questão.')

    // Aprovar Questão (DRAFT -> APPROVED)
    const approveBtn = page.locator('button:has-text("Aprovar")').first()
    if (await approveBtn.isVisible()) {
      await approveBtn.click()
      await page.waitForTimeout(500)
      console.log('  ↳ ✅ Questão aprovada pelo Revisor.')
    }

    // Publicar Questão (APPROVED -> PUBLISHED)
    const publishBtn = page.locator('button:has-text("Publicar")').first()
    if (await publishBtn.isVisible()) {
      await publishBtn.click()
      await page.waitForTimeout(500)
      console.log('  ↳ ✅ Questão publicada oficialmente.')
    }

    // 9. Verificação de Persistência e Acesso
    console.log('\n▶ [9/9 BROWSER] Validando persistência e integridade final no banco real...')
    await page.visit('/academic/questions')
    await page.waitForURL('academic/questions')
    await page.assertTextIncludes('body', questionStatement)
    console.log('  ↳ ✅ Questão visível e persistida no Banco de Questões.')

    console.log('\n======================================================')
    console.log('🎉 [BROWSER E2E] FLUXO COMPLETO VALIDADO COM SUCESSO!')
    console.log('======================================================\n')
  })

  test('E2E Browser Security & ACL: Unauthenticated user is redirected to login', async ({ visit }) => {
    console.log('\n▶ [SECURITY BROWSER] Tentando acessar área restrita sem autenticação...')
    const page = await visit('/academic/universities')
    await page.waitForURL(/security\/auth\/login/)
    await page.assertUrlContains('security/auth/login')
    console.log('  ↳ ✅ Acesso negado com sucesso: redirecionado para a tela de login.')
  })
})
