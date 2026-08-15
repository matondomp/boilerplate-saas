import { EventDispatcher, UniqueEntityID } from '#core/domain/index'
import {
  DeleteRoleUseCase,
  NonRootCannotModifyError,
  RoleHaveAssociatedUsersError,
  RoleNotFoundError,
} from '../../domain/index.js'
import {
  makeFindAssociatedUsersRepositoryStub,
  makeFindRoleBySlugRepositoryStub,
} from '../shared/__test__/index.js'
import {
  DeleteRoleUseCaseImpl,
  FindAssociatedUsersRepository,
  FindRoleBySlugRepository,
} from '../delete_role/index.js'
import { RoleEntity } from '../../domain/entities/role_entity.js'
import { makeUpdateRoleRepositoryStub } from './__test__/index.js'
import { test } from '@japa/runner'
import Sinon from 'sinon'

interface SutTypes {
  sut: DeleteRoleUseCase
  findAssociatedUsersRepositoryStub: FindAssociatedUsersRepository
  findRoleBySlugRepositoryStub: FindRoleBySlugRepository
}

const makeSut = (): SutTypes => {
  const findAssociatedUsersRepositoryStub = makeFindAssociatedUsersRepositoryStub()
  const findRoleBySlugRepositoryStub = makeFindRoleBySlugRepositoryStub()
  const sut = new DeleteRoleUseCaseImpl(
    findRoleBySlugRepositoryStub,
    findAssociatedUsersRepositoryStub,
    makeUpdateRoleRepositoryStub(),
    new EventDispatcher()
  )

  return {
    sut,
    findAssociatedUsersRepositoryStub,
    findRoleBySlugRepositoryStub,
  }
}

test.group('DeleteRoleUseCaseImpl', () => {
  test('should return an RoleNotFoundError, when a invalid role is provided', async ({
    expect,
  }) => {
    const { sut, findRoleBySlugRepositoryStub } = makeSut()

    Sinon.stub(findRoleBySlugRepositoryStub, 'find').resolves(undefined)

    const output = await sut.perform({
      roleId: 'invalid_role',
      isRoot: false,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(RoleNotFoundError)
  })
  test('should not be able to delete a role that have users associated to', async ({ expect }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      roleId: 'role_with_associated_users',
      isRoot: false,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(RoleHaveAssociatedUsersError)
  })

  test('should reject if an unroot user try to delete an internal role', async ({ expect }) => {
    const { sut, findRoleBySlugRepositoryStub } = makeSut()
    Sinon.stub(findRoleBySlugRepositoryStub, 'find').callsFake(async (_role) => {
      return RoleEntity.hydrate(new UniqueEntityID('valid_role_id'), {
        name: 'valid_name',
        description: 'valid_desc',
        internal: true,
        permissions: [new UniqueEntityID('valid_permission_id')],
      })
    })

    const output = await sut.perform({
      roleId: 'internal_role',
      isRoot: false,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(NonRootCannotModifyError)
  })

  test('should delete an internal role when root delete it', async ({ expect }) => {
    const { sut, findAssociatedUsersRepositoryStub, findRoleBySlugRepositoryStub } = makeSut()
    Sinon.stub(findAssociatedUsersRepositoryStub, 'findAssociatedUsers').resolves([])

    Sinon.stub(findRoleBySlugRepositoryStub, 'find').callsFake(async (_role) => {
      return RoleEntity.hydrate(new UniqueEntityID('valid_role_id'), {
        name: 'valid_name',
        description: 'valid_desc',
        internal: true,
        permissions: [new UniqueEntityID('valid_permission_id')],
      })
    })

    const output = await sut.perform({
      roleId: 'internal_role',
      isRoot: true,
    })

    expect(output.isRight()).toBeTruthy()
  })

  test('should return true, when everything succeed', async ({ expect }) => {
    const { sut, findAssociatedUsersRepositoryStub } = makeSut()

    Sinon.stub(findAssociatedUsersRepositoryStub, 'findAssociatedUsers').resolves([])

    const output = await sut.perform({
      roleId: 'valid_role',
      isRoot: false,
    })

    expect(output.isRight()).toBeTruthy()
  })
})
