import { test } from '@japa/runner'
import sinon from 'sinon'
import {
  SubjectAlreadyExistsError,
  SubjectNameRequiredError,
} from '../../domain/errors/index.js'
import { CreateSubjectUseCaseImpl } from './create_subject_usecase_impl.js'

test.group('CreateSubjectUseCase', () => {
  test('should return left when name is empty', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateSubjectUseCaseImpl(findRepoStub as any, createRepoStub as any)

    const output = await sut.perform({ name: '' })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, SubjectNameRequiredError)
  })

  test('should return left when subject already exists', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves({ id: 'subj-1' }) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateSubjectUseCaseImpl(findRepoStub as any, createRepoStub as any)

    const output = await sut.perform({ name: 'Matemática' })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, SubjectAlreadyExistsError)
  })

  test('should create subject successfully on valid input', async ({ assert }) => {
    const findRepoStub = { findByName: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateSubjectUseCaseImpl(findRepoStub as any, createRepoStub as any)

    const output = await sut.perform({ name: 'Matemática', description: 'Área de Exatas' })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createRepoStub.create.calledOnce)
  })
})
