import { CreateUserUseCaseImpl } from './create_user_usecase_impl.js'
import { EmailError, UserNameErrors } from '#shared/domain/errors/index'
import { makeFindUsernameRepositoryStub } from '#modules/auth/__test__/index'
import { FindUsernameRepository } from '#modules/auth/usecases/index'
import {
  GenerateRandomPasswordService,
  PersistUserRepository,
} from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'
import {
  makeGenerateRandomPasswordServiceStub,
  makePersistUserRepositoryStub,
} from '#modules/admin/settings/acl/users_management/usecases/create_user/__test__/index'
import { EventDispatcher, UniqueEntityID } from '#core/domain/index'
import { UserAlreadyExistError } from '#modules/admin/settings/acl/users_management/domain/errors/index'
import { UserEntity } from '#modules/auth/domain/index'
import { Email } from '#shared/domain/value_objects/email'
import { StatusEnum } from '#shared/domain/types/index'
import { test } from '@japa/runner'
import Sinon from 'sinon'

interface SutTypes {
  sut: CreateUserUseCaseImpl
  findUsernameRepositoryStub: FindUsernameRepository
  generateRandomPasswordServiceStub: GenerateRandomPasswordService
  persistUserRepositoryStub: PersistUserRepository
}

const makeSut = (): SutTypes => {
  const findUsernameRepositoryStub = makeFindUsernameRepositoryStub()
  const generateRandomPasswordServiceStub = makeGenerateRandomPasswordServiceStub()
  const persistUserRepositoryStub = makePersistUserRepositoryStub()

  const sut = new CreateUserUseCaseImpl(
    findUsernameRepositoryStub,
    generateRandomPasswordServiceStub,
    persistUserRepositoryStub,
    new EventDispatcher()
  )
  return {
    sut,
    generateRandomPasswordServiceStub,
    findUsernameRepositoryStub,
    persistUserRepositoryStub,
  }
}

test.group('CreateUserUseCase', function () {
  test('should return EmailInvalidError error', async ({ expect }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      role: 'valid_role_id',
    })

    expect(output.isLeft())
    expect(output.value).toBeInstanceOf(EmailError.EmailInvalidError)
  })

  test('should return UserAlreadyExist error', async ({ expect }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      role: 'valid_role_id',
    })

    expect(output.isLeft())
    expect(output.value).toBeInstanceOf(UserAlreadyExistError)
  })

  test('should return invalid first name error', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    Sinon.stub(findUsernameRepositoryStub, 'findUsername').resolves(undefined)

    const output = await sut.perform({
      firstName: '',
      lastName: 'lastName',
      email: 'email@mail.com',
      role: 'valid_role_id',
    })

    expect(output.isLeft())
    expect(output.value).toBeInstanceOf(UserNameErrors.UserFirstNameRequiredError)
  })

  test('should return invalid last name error', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()
    Sinon.stub(findUsernameRepositoryStub, 'findUsername').resolves(undefined)

    const output = await sut.perform({
      firstName: 'first',
      lastName: '',
      email: 'email@mail.com',
      role: 'valid_role_id',
    })

    expect(output.isLeft())
    expect(output.value).toBeInstanceOf(UserNameErrors.UserLastNameRequiredError)
  })

  test('should allow me to create a deleted user', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()
    const email = Email.create('email@mail.com')

    if (email.isLeft()) {
      throw new Error(email.value.errorMessage)
    }

    const User = UserEntity.hydrate(
      new UniqueEntityID('mock'),
      {
        firstName: 'valid',
        lastName: 'user',
        roleId: new UniqueEntityID('role-id'),
        password: 'valid-pwd',
        defaultLang: 'pt',
        email: email.value,
        slug: 'valid-user',
        timezone: 'unkonwn',
        status: StatusEnum.DELETED,
      },
      {
        deletedAt: new Date(),
      }
    )

    if (User.isLeft()) {
      throw new Error(User.value.errorMessage)
    }

    Sinon.stub(findUsernameRepositoryStub, 'findUsername').resolves(User.value)

    const output = await sut.perform({
      firstName: 'first',
      lastName: 'user',
      email: 'email@mail.com',
      role: 'valid_role_id',
    })

    expect(output.isRight())
  })

  test('should return right if succeed', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()
    Sinon.stub(findUsernameRepositoryStub, 'findUsername').resolves(undefined)
    const output = await sut.perform({
      firstName: 'first',
      lastName: 'user',
      email: 'email@mail.com',
      role: 'valid_role_id',
    })

    expect(output.isRight())
  })
})
