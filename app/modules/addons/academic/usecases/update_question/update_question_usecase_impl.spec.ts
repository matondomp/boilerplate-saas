import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import {
  QuestionNotFoundError,
  QuestionOptimisticLockConflictError,
} from '../../domain/errors/index.js'
import { QuestionEntity, QuestionOptionEntity } from '../../domain/entities/index.js'
import {
  ContentSource,
  DifficultyLevel,
  QuestionStatus,
  QuestionType,
} from '../../domain/value_objects/index.js'
import { UpdateQuestionUseCaseImpl } from './update_question_usecase_impl.js'

test.group('UpdateQuestionUseCase', () => {
  const existingQuestion = QuestionEntity.hydrate(new UniqueEntityID('q-1'), {
    subjectId: new UniqueEntityID('subj-1'),
    topicId: new UniqueEntityID('topic-1'),
    type: QuestionType.SINGLE_CHOICE,
    statement: 'Qual o valor de 2 + 2?',
    difficulty: DifficultyLevel.EASY,
    source: ContentSource.ORIGINAL,
    status: QuestionStatus.PUBLISHED,
    version: 2,
    options: [
      QuestionOptionEntity.hydrate(new UniqueEntityID('opt-1'), {
        label: 'A',
        content: '3',
        position: 0,
        isCorrect: false,
      }),
      QuestionOptionEntity.hydrate(new UniqueEntityID('opt-2'), {
        label: 'B',
        content: '4',
        position: 1,
        isCorrect: true,
      }),
    ],
  })

  test('should return left when question not found', async ({ assert }) => {
    const findStub = { findById: sinon.fake.resolves(null) }
    const updateStub = { updateWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake.yields({}) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new UpdateQuestionUseCaseImpl(
      findStub as any,
      updateStub as any,
      trxStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      id: 'invalid-q',
      statement: 'Novo enunciado',
      version: 2,
      authorId: 'user-1',
      reason: 'Correção',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, QuestionNotFoundError)
  })

  test('should return left with 409 conflict when version does not match (optimistic lock)', async ({
    assert,
  }) => {
    const findStub = { findById: sinon.fake.resolves(existingQuestion) }
    const updateStub = { updateWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake.yields({}) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new UpdateQuestionUseCaseImpl(
      findStub as any,
      updateStub as any,
      trxStub as any,
      eventDispatcherStub as any
    )

    // Versão passada é 1, mas o registro no banco está na versão 2
    const output = await sut.perform({
      id: 'q-1',
      statement: 'Novo enunciado',
      version: 1,
      authorId: 'user-1',
      reason: 'Tentativa de edição com versão desatualizada',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, QuestionOptimisticLockConflictError)
  })

  test('should update published question, generate revision and increment version', async ({
    assert,
  }) => {
    const findStub = { findById: sinon.fake.resolves(existingQuestion) }
    const updateStub = { updateWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake((cb: any) => cb({})) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new UpdateQuestionUseCaseImpl(
      findStub as any,
      updateStub as any,
      trxStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      id: 'q-1',
      statement: 'Qual o valor exato de 2 + 2?',
      version: 2,
      authorId: 'user-1',
      reason: 'Ajuste de clareza textual no enunciado',
    })

    assert.isTrue(output.isRight())
    assert.isTrue(updateStub.updateWithTransaction.calledOnce)
    assert.isTrue(eventDispatcherStub.publish.calledOnce)
    assert.equal(existingQuestion.version, 3) // Version incremented from 2 to 3!
  })
})
