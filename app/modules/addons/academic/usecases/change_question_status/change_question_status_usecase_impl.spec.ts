import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import {
  QuestionInvalidStateTransitionError,
  QuestionNotFoundError,
} from '../../domain/errors/index.js'
import { QuestionEntity } from '../../domain/entities/index.js'
import {
  ContentSource,
  DifficultyLevel,
  QuestionStatus,
  QuestionType,
} from '../../domain/value_objects/index.js'
import { ChangeQuestionStatusUseCaseImpl } from './change_question_status_usecase_impl.js'

test.group('ChangeQuestionStatusUseCase', () => {
  const draftQuestion = QuestionEntity.hydrate(new UniqueEntityID('q-draft'), {
    subjectId: new UniqueEntityID('subj-1'),
    topicId: new UniqueEntityID('topic-1'),
    type: QuestionType.SINGLE_CHOICE,
    statement: 'Questão de Teste',
    difficulty: DifficultyLevel.MEDIUM,
    source: ContentSource.ORIGINAL,
    status: QuestionStatus.DRAFT,
  })

  test('should return left when question not found', async ({ assert }) => {
    const findStub = { findById: sinon.fake.resolves(null) }
    const updateStub = { updateStatus: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new ChangeQuestionStatusUseCaseImpl(
      findStub as any,
      updateStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      id: 'invalid-q',
      newStatus: QuestionStatus.UNDER_REVIEW,
      authorId: 'user-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, QuestionNotFoundError)
  })

  test('should return left when invalid transition is attempted (e.g. DRAFT direct to PUBLISHED without review)', async ({
    assert,
  }) => {
    const findStub = { findById: sinon.fake.resolves(draftQuestion) }
    const updateStub = { updateStatus: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new ChangeQuestionStatusUseCaseImpl(
      findStub as any,
      updateStub as any,
      eventDispatcherStub as any
    )

    // DRAFT direto para PUBLISHED é proibido pela máquina de estados (exige UNDER_REVIEW -> APPROVED -> PUBLISHED)
    const output = await sut.perform({
      id: 'q-draft',
      newStatus: QuestionStatus.PUBLISHED,
      authorId: 'user-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, QuestionInvalidStateTransitionError)
  })

  test('should change status and publish domain event on valid transition', async ({ assert }) => {
    const qUnderReview = QuestionEntity.hydrate(new UniqueEntityID('q-review'), {
      subjectId: new UniqueEntityID('subj-1'),
      topicId: new UniqueEntityID('topic-1'),
      type: QuestionType.SINGLE_CHOICE,
      statement: 'Questão em revisão',
      difficulty: DifficultyLevel.MEDIUM,
      source: ContentSource.OFFICIAL_EXAM,
      status: QuestionStatus.UNDER_REVIEW,
    })

    const findStub = { findById: sinon.fake.resolves(qUnderReview) }
    const updateStub = { updateStatus: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new ChangeQuestionStatusUseCaseImpl(
      findStub as any,
      updateStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      id: 'q-review',
      newStatus: QuestionStatus.APPROVED,
      authorId: 'reviewer-1',
    })

    assert.isTrue(output.isRight())
    assert.isTrue(updateStub.updateStatus.calledOnce)
    assert.isTrue(eventDispatcherStub.publish.calledOnce)
    assert.equal(qUnderReview.status, QuestionStatus.APPROVED)
  })
})
