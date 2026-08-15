import {
  FindTokenRepository,
  FindUserIdRepository,
  UpdateTokenRepository,
  UpdateUserRepository,
} from './ports/index.js'
import {
  makeFindTokenRepositoryStub,
  makeUpdateTokenRepositoryStub,
  makeUpdateUserRepositoryStub,
} from './__test__/index.js'

import { ResetPasswordUseCaseImpl } from '#modules/auth/usecases/index'
import { ResetPasswordUseCase } from '#modules/auth/domain/usecases/index'

import { EventDispatcher, IEventDispatcher, UniqueEntityID } from '#core/domain/index'
import {
  PasswordMismatchError,
  TokenEntity,
  TokenExpiredError,
  TokenNotFoundError,
  TokenRevokedError,
  TokenTypes,
} from '../../domain/index.js'
import { makeFindUserIdRepositoryStub } from '#modules/auth/__test__/index'
import { PasswordChangedEvent } from '#shared/domain/events/password_changed_event'
import { test } from '@japa/runner'
import * as sinon from 'sinon'

interface SutTypes {
  sut: ResetPasswordUseCase.Contract
  findTokenRepositoryStub: FindTokenRepository
  findUserIdRepositoryStub: FindUserIdRepository
  updateUserRepositoryStub: UpdateUserRepository
  updateTokenRepositoryStub: UpdateTokenRepository
  eventDispatcher: IEventDispatcher
}

const makeSut = (): SutTypes => {
  const findTokenRepositoryStub = makeFindTokenRepositoryStub()
  const findUserIdRepositoryStub = makeFindUserIdRepositoryStub()
  const updateUserRepositoryStub = makeUpdateUserRepositoryStub()
  const updateTokenRepositoryStub = makeUpdateTokenRepositoryStub()
  const eventDispatcher = new EventDispatcher()

  const sut = new ResetPasswordUseCaseImpl(
    findTokenRepositoryStub,
    findUserIdRepositoryStub,
    updateUserRepositoryStub,
    updateTokenRepositoryStub,
    eventDispatcher
  )

  return {
    sut,
    findTokenRepositoryStub,
    findUserIdRepositoryStub,
    updateUserRepositoryStub,
    eventDispatcher,
    updateTokenRepositoryStub,
  }
}

test.group('ResetPasswordUseCaseImpl', function () {
  test('should return token not found', async ({ assert }) => {
    const { sut, findTokenRepositoryStub } = makeSut()

    sinon.replace(findTokenRepositoryStub, 'find', sinon.fake.returns(Promise.resolve(undefined)))

    const output = await sut.perform({
      token: 'valid_token',
      password: 'new_password',
      confirmPassword: 'new_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, TokenNotFoundError)
  })

  test('should return token expired', async ({ assert }) => {
    const { sut, findTokenRepositoryStub } = makeSut()

    sinon.useFakeTimers().setSystemTime(new Date('2022-02-03'))

    sinon.replace(
      findTokenRepositoryStub,
      'find',
      sinon.fake.returns(
        Promise.resolve(
          TokenEntity.hydrate(new UniqueEntityID('valid_token_id'), {
            token: 'valid_token',
            userId: new UniqueEntityID('valid_user_id'),
            expiredAt: new Date(2022, 1, 1),
            revoked: false,
            tokenType: TokenTypes.RECOVER_PASSWORD,
          })
        )
      )
    )

    const output = await sut.perform({
      token: 'valid_token',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, TokenExpiredError)
    sinon.restore()
  })

  test('should return token revoked', async ({ assert }) => {
    const { sut, findTokenRepositoryStub } = makeSut()

    sinon.useFakeTimers().setSystemTime(new Date('2022-01-01'))

    sinon.replace(
      findTokenRepositoryStub,
      'find',
      sinon.fake.returns(
        Promise.resolve(
          TokenEntity.hydrate(new UniqueEntityID('valid_token_id'), {
            token: 'valid_token',
            userId: new UniqueEntityID('valid_user_id'),
            expiredAt: new Date(2022, 1, 1),
            revoked: true,
            tokenType: TokenTypes.RECOVER_PASSWORD,
          })
        )
      )
    )
    const output = await sut.perform({
      token: 'valid_token',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, TokenRevokedError)
    sinon.restore()
  })

  test('should return password mismatch', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      token: 'valid_token',
      password: 'valid_password',
      confirmPassword: 'in_valid_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, PasswordMismatchError)
  })

  test('should return success', async ({ assert, expect }) => {
    const { sut, eventDispatcher } = makeSut()

    await sinon.useFakeTimers({
      now: new Date(),
    })
    const eventDispatcherSpy = sinon.spy(eventDispatcher, 'publish')

    const output = await sut.perform({
      token: 'valid_token',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    })

    assert.isTrue(output.isRight())
    expect(
      eventDispatcherSpy.calledWithExactly(
        new PasswordChangedEvent({
          userId: new UniqueEntityID('valid_user_id'),
        })
      )
    ).toBeTruthy()

    await sinon.restore()
  })
})
