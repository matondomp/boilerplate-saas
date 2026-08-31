import { test } from '@japa/runner'
import sinon from 'sinon'
import {
  UniversityAlreadyExistsError,
  UniversityNotFoundError,
} from '../../domain/errors/index.js'
import { UpdateUniversityUseCaseImpl } from './update_university_usecase_impl.js'
import { UniversityEntity } from '../../domain/entities/index.js'
import { UniqueEntityID } from '#core/domain/index'
import { UniversityStatus } from '../../domain/value_objects/index.js'

test.group('UpdateUniversityUseCase', () => {
  test('should return left when university does not exist', async ({ assert }) => {
    const findByIdStub = sinon.fake.resolves(null)
    const findByNameStub = sinon.fake.resolves(null)
    const updateRepoStub = sinon.fake.resolves(undefined)

    const sut = new UpdateUniversityUseCaseImpl(
      { findById: findByIdStub } as any,
      { findByName: findByNameStub } as any,
      { update: updateRepoStub } as any
    )

    const output = await sut.perform({
      id: 'non-existent-id',
      name: 'Universidade Agostinho Neto',
      acronym: 'UAN',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityNotFoundError)
  })

  test('should return left when updated name already exists for another university', async ({ assert }) => {
    const existingUni = UniversityEntity.hydrate(new UniqueEntityID('existing-id'), {
      name: 'Universidade Agostinho Neto',
      acronym: 'UAN',
    })

    const otherUni = UniversityEntity.hydrate(new UniqueEntityID('other-id'), {
      name: 'Universidade Nova',
      acronym: 'UN',
    })

    const findByIdStub = sinon.fake.resolves(existingUni)
    const findByNameStub = sinon.fake.resolves(otherUni)
    const updateRepoStub = sinon.fake.resolves(undefined)

    const sut = new UpdateUniversityUseCaseImpl(
      { findById: findByIdStub } as any,
      { findByName: findByNameStub } as any,
      { update: updateRepoStub } as any
    )

    const output = await sut.perform({
      id: 'existing-id',
      name: 'Universidade Nova',
      acronym: 'UAN',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityAlreadyExistsError)
  })

  test('should update university successfully', async ({ assert }) => {
    const existingUni = UniversityEntity.hydrate(new UniqueEntityID('existing-id'), {
      name: 'Universidade Agostinho Neto',
      acronym: 'UAN',
    })

    const findByIdStub = sinon.fake.resolves(existingUni)
    const findByNameStub = sinon.fake.resolves(null)
    const updateRepoStub = sinon.fake.resolves(undefined)

    const sut = new UpdateUniversityUseCaseImpl(
      { findById: findByIdStub } as any,
      { findByName: findByNameStub } as any,
      { update: updateRepoStub } as any
    )

    const output = await sut.perform({
      id: 'existing-id',
      name: 'Universidade Agostinho Neto Editada',
      acronym: 'UANE',
      status: UniversityStatus.INACTIVE,
    })

    assert.isTrue(output.isRight())
    assert.isTrue(output.value)
    assert.isTrue(updateRepoStub.calledOnce)

    const updatedEntity = updateRepoStub.firstCall.args[0] as UniversityEntity
    assert.equal(updatedEntity.name, 'Universidade Agostinho Neto Editada')
    assert.equal(updatedEntity.acronym, 'UANE')
    assert.equal(updatedEntity.status, UniversityStatus.INACTIVE)
  })
})
