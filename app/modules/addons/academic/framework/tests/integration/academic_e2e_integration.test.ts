import { test } from '@japa/runner'
import { EventDispatcher } from '#core/domain/index'
import { CoreUserModel } from '#shared/framework/infra/db/models/core_user_model'
import {
  CreateUniversityUseCaseImpl,
  CreateCourseUseCaseImpl,
  CreateSubjectUseCaseImpl,
  CreateTopicUseCaseImpl,
  CreateExamUseCaseImpl,
  CreateQuestionUseCaseImpl,
  UpdateQuestionUseCaseImpl,
  ChangeQuestionStatusUseCaseImpl,
  CreatePreparationGoalUseCaseImpl,
} from '../../../usecases/index.js'
import {
  UniversityRepositoriesImpl,
  CourseRepositoriesImpl,
  SubjectTopicRepositoriesImpl,
  ExamRepositoriesImpl,
  QuestionRepositoriesImpl,
  PreparationGoalRepositoriesImpl,
} from '../../infra/db/repositories/index.js'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'

test.group('Academic Addon — End-to-End Integration Tests', (group) => {
  const transactionAdapter = new TransactionAdapterImpl()
  const universityRepo = new UniversityRepositoriesImpl()
  const courseRepo = new CourseRepositoriesImpl()
  const subjectTopicRepo = new SubjectTopicRepositoriesImpl()
  const examRepo = new ExamRepositoriesImpl()
  const questionRepo = new QuestionRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const eventDispatcher = EventDispatcher.getInstance()

  test('E2E Full Lifecycle: University -> Course -> Subject -> Topic -> Exam -> Question -> Review -> Publish -> Student Goal', async ({ assert }) => {
    console.log('\n======================================================')
    console.log('🚀 [E2E TEST] INICIANDO CICLO COMPLETO DE TESTES...')
    console.log('======================================================\n')

    // 1. Criar Universidade
    console.log('▶ [PASSO 1/9] Criando Universidade...')
    const createUniUseCase = new CreateUniversityUseCaseImpl(universityRepo, universityRepo, eventDispatcher)
    const uniResult = await createUniUseCase.perform({
      name: `Universidade E2E Test ${Date.now()}`,
      acronym: 'U-E2E',
    })
    console.log('  ↳ Resultado Passo 1:', uniResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', uniResult.value)
    assert.isTrue(uniResult.isRight())
    const universityId = (uniResult.value as { id: string }).id
    assert.isDefined(universityId)
    console.log('  ↳ ID da Universidade:', universityId)

    // 2. Criar Curso
    console.log('\n▶ [PASSO 2/9] Criando Curso...')
    const createCourseUseCase = new CreateCourseUseCaseImpl(universityRepo, courseRepo, courseRepo, eventDispatcher)
    const courseResult = await createCourseUseCase.perform({
      universityId,
      name: `Engenharia de Software E2E ${Date.now()}`,
    })
    console.log('  ↳ Resultado Passo 2:', courseResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', courseResult.value)
    assert.isTrue(courseResult.isRight())
    const courseId = (courseResult.value as { id: string }).id
    assert.isDefined(courseId)
    console.log('  ↳ ID do Curso:', courseId)

    // 3. Criar Disciplina
    console.log('\n▶ [PASSO 3/9] Criando Disciplina...')
    const createSubjectUseCase = new CreateSubjectUseCaseImpl(subjectTopicRepo, subjectTopicRepo)
    const subjectResult = await createSubjectUseCase.perform({
      name: `Estruturas de Dados E2E ${Date.now()}`,
      description: 'Grafos, Árvores e Algoritmos',
    })
    console.log('  ↳ Resultado Passo 3:', subjectResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', subjectResult.value)
    assert.isTrue(subjectResult.isRight())
    const subjectId = (subjectResult.value as { id: string }).id
    console.log('  ↳ ID da Disciplina:', subjectId)

    // 4. Criar Tópico Raiz e Subtópico
    console.log('\n▶ [PASSO 4/9] Criando Tópicos (Raiz e Subtópico)...')
    const createTopicUseCase = new CreateTopicUseCaseImpl(subjectTopicRepo, subjectTopicRepo, subjectTopicRepo)
    const rootTopicResult = await createTopicUseCase.perform({
      subjectId,
      name: 'Árvores Binárias',
    })
    console.log('  ↳ Resultado Tópico Raiz:', rootTopicResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', rootTopicResult.value)
    assert.isTrue(rootTopicResult.isRight())
    const rootTopicId = (rootTopicResult.value as { id: string }).id
    console.log('  ↳ ID Tópico Raiz:', rootTopicId)

    const subTopicResult = await createTopicUseCase.perform({
      subjectId,
      parentId: rootTopicId,
      name: 'Árvores AVL e Balanceamento',
    })
    console.log('  ↳ Resultado Subtópico:', subTopicResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', subTopicResult.value)
    assert.isTrue(subTopicResult.isRight())
    const subTopicId = (subTopicResult.value as { id: string }).id
    console.log('  ↳ ID Subtópico:', subTopicId)

    // 5. Criar Exame
    console.log('\n▶ [PASSO 5/9] Criando Exame...')
    const createExamUseCase = new CreateExamUseCaseImpl(examRepo, examRepo, examRepo)
    const examResult = await createExamUseCase.perform({
      courseId,
      year: 2026,
      period: 'EXAM_1',
      sourceType: 'OFFICIAL_EXAM',
    })
    console.log('  ↳ Resultado Passo 5:', examResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', examResult.value)
    assert.isTrue(examResult.isRight())
    const examId = (examResult.value as { id: string }).id
    console.log('  ↳ ID do Exame:', examId)

    // 6. Criar Questão Atômica com Alternativas
    console.log('\n▶ [PASSO 6/9] Criando Questão Atômica...')
    let questionId: string = ''
    try {
      const createQuestionUseCase = new CreateQuestionUseCaseImpl(
        subjectTopicRepo,
        subjectTopicRepo,
        questionRepo,
        transactionAdapter
      )
      const questionResult = await createQuestionUseCase.perform({
        examId,
        subjectId,
        topicId: subTopicId,
        type: 'SINGLE_CHOICE',
        statement: 'Qual é o fator de balanceamento máximo permitido em um nó de uma árvore AVL?',
        difficulty: 'MEDIUM',
        solution: 'O fator de balanceamento (altura esquerda - altura direita) deve pertencer ao conjunto {-1, 0, 1}.',
        explanation: 'Se o fator exceder esses valores (|FB| > 1), rotações são necessárias.',
        options: [
          { label: 'A', content: '{-1, 0, 1}', position: 0, isCorrect: true },
          { label: 'B', content: '{-2, 0, 2}', position: 1, isCorrect: false },
          { label: 'C', content: '{0, 1, 2}', position: 2, isCorrect: false },
        ],
        source: 'OFFICIAL_EXAM',
      })
      console.log('  ↳ Resultado Passo 6:', questionResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', questionResult.value)
      assert.isTrue(questionResult.isRight())
      questionId = (questionResult.value as { id: string }).id
      console.log('  ↳ ID da Questão:', questionId)
    } catch (err: any) {
      console.error('  ↳ ❌ EXCEÇÃO NO PASSO 6:', err?.message || err)
      if (err?.stack) console.error('  ↳ Stack Trace:', err.stack)
      throw err
    }

    // 7. Moderação Humana: DRAFT -> UNDER_REVIEW -> APPROVED -> PUBLISHED
    console.log('\n▶ [PASSO 7/9] Moderação de Estados da Questão...')
    try {
      const statusUseCase = new ChangeQuestionStatusUseCaseImpl(questionRepo, questionRepo, eventDispatcher)
      
      const rev1 = await statusUseCase.perform({ id: questionId, newStatus: 'UNDER_REVIEW', authorId: 'reviewer-1' })
      console.log('  ↳ Transição UNDER_REVIEW:', rev1.isRight() ? '✅ SUCESSO' : '❌ FALHA', rev1.value)
      assert.isTrue(rev1.isRight())

      const rev2 = await statusUseCase.perform({ id: questionId, newStatus: 'APPROVED', authorId: 'reviewer-1' })
      console.log('  ↳ Transição APPROVED:', rev2.isRight() ? '✅ SUCESSO' : '❌ FALHA', rev2.value)
      assert.isTrue(rev2.isRight())

      const rev3 = await statusUseCase.perform({ id: questionId, newStatus: 'PUBLISHED', authorId: 'admin-1' })
      console.log('  ↳ Transição PUBLISHED:', rev3.isRight() ? '✅ SUCESSO' : '❌ FALHA', rev3.value)
      assert.isTrue(rev3.isRight())
    } catch (err: any) {
      console.error('  ↳ ❌ EXCEÇÃO NO PASSO 7:', err?.message || err)
      if (err?.stack) console.error('  ↳ Stack Trace:', err.stack)
      throw err
    }

    // 8. Atualizar Questão Publicada (Gera Revisão e Lock Otimista)
    console.log('\n▶ [PASSO 8/9] Atualização da Questão com Revisão...')
    let validAuthorId: string = ''
    try {
      const rootUser = await CoreUserModel.first()
      validAuthorId = rootUser ? rootUser.id : (await CoreUserModel.create({
        firstName: 'Admin',
        lastName: 'E2E',
        username: `admin_e2e_${Date.now()}`,
        email: `admin_e2e_${Date.now()}@boilerplate.test`,
        status: 'ACTIVE',
        password: 'Password123!',
      })).id

      const updateQuestionUseCase = new UpdateQuestionUseCaseImpl(
        questionRepo,
        questionRepo,
        transactionAdapter,
        eventDispatcher
      )
      const updateResult = await updateQuestionUseCase.perform({
        id: questionId,
        statement: 'Qual é o fator de balanceamento máximo permitido em qualquer nó de uma árvore AVL balanceada?',
        solution: 'O módulo da diferença de alturas das subárvores não pode exceder 1.',
        explanation: 'Definição clássica de Adelson-Velsky e Landis.',
        version: 1,
        options: [
          { label: 'A', content: '{-1, 0, 1}', position: 0, isCorrect: true },
          { label: 'B', content: '{-2, 0, 2}', position: 1, isCorrect: false },
        ],
        authorId: validAuthorId,
        reason: 'Melhoria no enunciado e clareza didática',
      })
      console.log('  ↳ Resultado Passo 8:', updateResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', updateResult.value)
      assert.isTrue(updateResult.isRight())
    } catch (err: any) {
      console.error('  ↳ ❌ EXCEÇÃO NO PASSO 8:', err?.message || err)
      if (err?.stack) console.error('  ↳ Stack Trace:', err.stack)
      throw err
    }

    // 9. Criar Meta de Preparação do Estudante
    console.log('\n▶ [PASSO 9/9] Criando Meta do Estudante...')
    try {
      const createGoalUseCase = new CreatePreparationGoalUseCaseImpl(
        universityRepo,
        examRepo,
        goalRepo,
        goalRepo,
        eventDispatcher
      )
      const goalResult = await createGoalUseCase.perform({
        studentId: validAuthorId,
        universityId,
        courseId,
        targetExamPeriod: '2026/2027',
      })
      console.log('  ↳ Resultado Passo 9:', goalResult.isRight() ? '✅ SUCESSO' : '❌ FALHA', goalResult.value)
      assert.isTrue(goalResult.isRight())
    } catch (err: any) {
      console.error('  ↳ ❌ EXCEÇÃO NO PASSO 9:', err?.message || err)
      if (err?.stack) console.error('  ↳ Stack Trace:', err.stack)
      throw err
    }

    console.log('\n======================================================')
    console.log('🎉 [E2E TEST] TODOS OS 9 PASSOS EXECUTADOS COM SUCESSO!')
    console.log('======================================================\n')
  })
})
