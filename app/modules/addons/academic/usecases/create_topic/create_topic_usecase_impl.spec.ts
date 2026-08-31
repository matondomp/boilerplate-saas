import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { SubjectNotFoundError, TopicNotFoundError } from '../../domain/errors/index.js'
import { SubjectEntity, TopicEntity } from '../../domain/entities/index.js'
import { CreateTopicUseCaseImpl } from './create_topic_usecase_impl.js'

test.group('CreateTopicUseCase', () => {
  const existingSubject = SubjectEntity.hydrate(new UniqueEntityID('subj-1'), {
    name: 'Matemática',
  })
  const existingParentTopic = TopicEntity.hydrate(new UniqueEntityID('topic-parent'), {
    subjectId: new UniqueEntityID('subj-1'),
    name: 'Álgebra',
    level: 1,
  })

  test('should return left when subject not found', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(null) }
    const findTopicStub = { findById: sinon.fake.resolves(null) }
    const createTopicStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateTopicUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createTopicStub as any
    )

    const output = await sut.perform({
      subjectId: 'invalid-subj',
      name: 'Álgebra',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, SubjectNotFoundError)
  })

  test('should return left when parent topic specified but not found', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(existingSubject) }
    const findTopicStub = { findById: sinon.fake.resolves(null) }
    const createTopicStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateTopicUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createTopicStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      parentId: 'invalid-parent',
      name: 'Equações',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, TopicNotFoundError)
  })

  test('should create root topic with level 1 when parentId is null', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(existingSubject) }
    const findTopicStub = { findById: sinon.fake.resolves(null) }
    const createTopicStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateTopicUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createTopicStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      name: 'Álgebra',
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createTopicStub.create.calledOnce)
  })

  test('should create child topic with incremented level', async ({ assert }) => {
    const findSubjStub = { findById: sinon.fake.resolves(existingSubject) }
    const findTopicStub = { findById: sinon.fake.resolves(existingParentTopic) }
    const createTopicStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateTopicUseCaseImpl(
      findSubjStub as any,
      findTopicStub as any,
      createTopicStub as any
    )

    const output = await sut.perform({
      subjectId: 'subj-1',
      parentId: 'topic-parent',
      name: 'Equações do 2º Grau',
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createTopicStub.create.calledOnce)
  })
})
