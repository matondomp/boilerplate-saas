import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import {
  QuestionSingleChoiceMustHaveOneCorrectOptionError,
  QuestionStatementRequiredError,
  SubjectNotFoundError,
  TopicNotFoundError,
} from '../../domain/errors/index.js'
import { SubjectEntity, TopicEntity } from '../../domain/entities/index.js'
import { ContentSource, DifficultyLevel, QuestionType } from '../../domain/value_objects/index.js'
import { CreateQuestionUseCaseImpl } from './create_question_usecase_impl.js'

test.group('CreateQuestionUseCase', () => {
  const subject = SubjectEntity.hydrate(new UniqueEntityID('subj-1'), { name: 'Matemática' })
  const topic = TopicEntity.hydrate(new UniqueEntityID('topic-1'), {
    subjectId: new UniqueEntityID('subj-1'),
    name: 'Álgebra',
    level: 1,
  })

  test('should return left when subject not found', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(null) }
    const findTopicStub = { findById: sinon.fake.resolves(topic) }
    const createRepoStub = { createWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake.yields({}) }

    const sut = new CreateQuestionUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createRepoStub as any,
      trxStub as any
    )

    const output = await sut.perform({
      subjectId: 'invalid-subj',
      topicId: 'topic-1',
      statement: 'Qual o valor de x?',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, SubjectNotFoundError)
  })

  test('should return left when topic not found', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(subject) }
    const findTopicStub = { findById: sinon.fake.resolves(null) }
    const createRepoStub = { createWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake.yields({}) }

    const sut = new CreateQuestionUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createRepoStub as any,
      trxStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      topicId: 'invalid-topic',
      statement: 'Qual o valor de x?',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, TopicNotFoundError)
  })

  test('should return left when single choice has 0 or multiple correct options', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(subject) }
    const findTopicStub = { findById: sinon.fake.resolves(topic) }
    const createRepoStub = { createWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake.yields({}) }

    const sut = new CreateQuestionUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createRepoStub as any,
      trxStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      topicId: 'topic-1',
      type: QuestionType.SINGLE_CHOICE,
      statement: 'Qual o valor de x?',
      options: [
        { label: 'A', content: '2', position: 0, isCorrect: true },
        { label: 'B', content: '4', position: 1, isCorrect: true }, // Duas opções corretas em single choice!
      ],
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, QuestionSingleChoiceMustHaveOneCorrectOptionError)
  })

  test('should create question and options atomically via transaction on valid input', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(subject) }
    const findTopicStub = { findById: sinon.fake.resolves(topic) }
    const createRepoStub = { createWithTransaction: sinon.fake.resolves(undefined) }
    const trxStub = { useTransaction: sinon.fake((cb: any) => cb({})) }

    const sut = new CreateQuestionUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createRepoStub as any,
      trxStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      topicId: 'topic-1',
      type: QuestionType.SINGLE_CHOICE,
      statement: 'Resolva a equação 2x + 4 = 10',
      difficulty: DifficultyLevel.EASY,
      solution: '2x = 6 => x = 3',
      explanation: 'Isolamos a variável x subtraindo 4 de ambos os membros e dividindo por 2.',
      source: ContentSource.OFFICIAL_EXAM,
      options: [
        { label: 'A', content: 'x = 2', position: 0, isCorrect: false },
        { label: 'B', content: 'x = 3', position: 1, isCorrect: true },
        { label: 'C', content: 'x = 4', position: 2, isCorrect: false },
      ],
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createRepoStub.createWithTransaction.calledOnce)
  })
})
