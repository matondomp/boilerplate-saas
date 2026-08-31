import { test } from '@japa/runner'
import sinon from 'sinon'
import {
  UniversityAlreadyExistsError,
  UniversityNameRequiredError,
} from '../../domain/errors/index.js'
import { CreateUniversityUseCaseImpl } from './create_university_usecase_impl.js'

test.group('CreateUniversityUseCase', () => {
  test('should return left when university name is empty', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateUniversityUseCaseImpl(
      findRepoStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      name: '',
      acronym: 'UAN',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityNameRequiredError)
  })

  test('should return left when university already exists', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves({ id: 'existing-id' }) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateUniversityUseCaseImpl(
      findRepoStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      name: 'Universidade Agostinho Neto',
      acronym: 'UAN',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityAlreadyExistsError)
  })

  test('should create university and return right with id on valid input', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateUniversityUseCaseImpl(
      findRepoStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      name: 'Universidade Agostinho Neto',
      acronym: 'UAN',
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createRepoStub.create.calledOnce)
    assert.isTrue(eventDispatcherStub.publish.calledOnce)
  })
})
