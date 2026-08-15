import { AuthenticateUserUseCase } from '#modules/auth/domain/usecases/index'
import {
  AuthenticateUserUseCaseImpl,
  FindUsernameRepository,
  VerifyPasswordMatchAdapter,
} from '#modules/auth/usecases/index'
import {
  makeFindUsernameRepositoryStub,
  makeVerifyPasswordMatchAdapterStub,
} from './__test__/index.js'
import { UserNotFoundError, PasswordMismatchError } from '#modules/auth/domain/errors/index'
import { EventDispatcher } from '#core/domain/index'
import { test } from '@japa/runner'
import * as sinon from 'sinon'

interface SutTypes {
  sut: AuthenticateUserUseCase.Contract
  findUsernameRepositoryStub: FindUsernameRepository
  verifyPasswordMatchAdapterStub: VerifyPasswordMatchAdapter
}

const makeSut = (): SutTypes => {
  const findUsernameRepositoryStub = makeFindUsernameRepositoryStub()
  const verifyPasswordMatchAdapterStub = makeVerifyPasswordMatchAdapterStub()
  const sut = new AuthenticateUserUseCaseImpl(
    findUsernameRepositoryStub,
    verifyPasswordMatchAdapterStub,
    new EventDispatcher()
  )

  return {
    sut,
    findUsernameRepositoryStub,
    verifyPasswordMatchAdapterStub,
  }
}

test.group('AuthenticateUserUseCase', () => {
  test('should not found a user', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    sinon.replace(
      findUsernameRepositoryStub,
      'findUsername',
      sinon.fake.returns(Promise.resolve(undefined))
    )

    const output = await sut.perform({
      username: 'invalid@mail.com',
      password: 'valid_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UserNotFoundError)
  })

  test('should not match passwords', async ({ assert }) => {
    const { sut, verifyPasswordMatchAdapterStub } = makeSut()

    sinon.replace(
      verifyPasswordMatchAdapterStub,
      'compare',
      sinon.fake.returns(Promise.resolve(false))
    )

    const output = await sut.perform({
      username: 'valid@mail.com',
      password: 'invalid_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, PasswordMismatchError)
  })

  test('should throws when findUsernameRepository throws', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    const error = new Error('Database Error')

    sinon.replace(
      findUsernameRepositoryStub,
      'findUsername',
      sinon.fake.returns(Promise.reject(error))
    )

    const output = sut.perform({
      username: 'valid@mail.com',
      password: 'valid_password',
    })

    await expect(output).rejects.toThrow(error)
  })

  test('should return userId when succeed', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      username: 'valid@mail.com',
      password: 'valid_password',
    })

    assert.isTrue(output.isRight())
    assert.deepEqual(output.value, {
      userId: 'valid_id',
    })
  })
})
