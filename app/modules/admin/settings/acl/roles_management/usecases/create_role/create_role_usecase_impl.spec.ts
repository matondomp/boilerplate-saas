import { CreateRoleWithTransactionRepository, FindRoleByNameRepository } from './ports/index.js'
import { CreateRoleUseCaseImpl } from './create_role_usecase_impl.js'
import {
  PermissionAreMissingError,
  RoleAlreadyExistError,
  RoleDescriptionRequiredError,
  RoleNameRequiredError,
} from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import { CreateRoleUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/index'
import {
  makeCreateRoleRepositoryStub,
  makeFindRoleByNameRepositoryStub,
  makeTransactionAdapterStub,
} from '#modules/admin/settings/acl/roles_management/usecases/create_role/__test__/index'
import { EventDispatcher } from '#core/domain/index'
import { test } from '@japa/runner'
import Sinon from 'sinon'

const makeInput = (): CreateRoleUseCaseInput => ({
  name: 'valid_role',
  description: 'valid_role_desc',
  permissions: ['valid_id_1'],
  userId: 'valid_user_id',
})

interface SutTypes {
  sut: CreateRoleUseCaseImpl
  findRoleByNameRepositoryStub: FindRoleByNameRepository
  createRoleRepositoryStub: CreateRoleWithTransactionRepository<any>
}
const makeSut = (): SutTypes => {
  const findRoleByNameRepositoryStub = makeFindRoleByNameRepositoryStub()
  const createRoleRepositoryStub = makeCreateRoleRepositoryStub()
  const sut = new CreateRoleUseCaseImpl(
    findRoleByNameRepositoryStub,
    createRoleRepositoryStub,
    makeTransactionAdapterStub(),
    EventDispatcher.getInstance()
  )

  return {
    sut,
    findRoleByNameRepositoryStub,
    createRoleRepositoryStub,
  }
}

test.group('CreateRoleUseCase', function () {
  test('should returns missing permission error', async ({ expect }) => {
    const { sut } = makeSut()

    const input = makeInput()
    input.permissions = []
    const output = await sut.perform(input)

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(PermissionAreMissingError)
  })

  test('should returns role name required', async ({ expect }) => {
    const { sut } = makeSut()

    const input = makeInput()
    input.name = ''
    const output = await sut.perform(input)

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(RoleNameRequiredError)
  })

  test('should returns role description required', async ({ expect }) => {
    const { sut } = makeSut()

    const input = makeInput()
    input.description = ''

    const output = await sut.perform(input)

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(RoleDescriptionRequiredError)
  })

  test('should returns role name already exists', async ({ expect }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(RoleAlreadyExistError)
  })

  test('should returns true when succeed', async ({ expect }) => {
    const { sut, findRoleByNameRepositoryStub } = makeSut()

    Sinon.stub(findRoleByNameRepositoryStub, 'findByName').resolves(undefined)

    const output = await sut.perform(makeInput())

    expect(output.isRight()).toBeTruthy()
  })
})
