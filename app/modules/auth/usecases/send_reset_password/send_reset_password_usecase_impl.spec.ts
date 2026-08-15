import {
  makeFindUsernameRepositoryStub,
  makeHashAdapterStub,
  makePersistPasswordTokenRepositoryStub,
  makeSendResetPasswordLinkServiceStub,
} from './__test__/index.js'

import {
  FindUsernameRepository,
  HashAdapter,
  PersistResetPasswordTokenRepository,
  SendResetPasswordLinkService,
  SendResetPasswordUseCaseImpl,
} from '#modules/auth/usecases/index'
import { UserNotFoundError } from '#modules/auth/domain/errors/index'
import { SendResetPasswordUseCase } from '#modules/auth/domain/usecases/index'
import { EventDispatcher } from '#core/domain/index'
import { test } from '@japa/runner'
import * as sinon from 'sinon'

interface SutTypes {
  sut: SendResetPasswordUseCase.Contract
  hashAdapterStub: HashAdapter
  persistPasswordTokenRepositoryStub: PersistResetPasswordTokenRepository
  sendResetPasswordLinkServiceSub: SendResetPasswordLinkService
  findUsernameRepositoryStub: FindUsernameRepository
}

const makeSut = (): SutTypes => {
  const findUsernameRepositoryStub = makeFindUsernameRepositoryStub()
  const persistPasswordTokenRepositoryStub = makePersistPasswordTokenRepositoryStub()
  const hashAdapterStub = makeHashAdapterStub()
  const sendResetPasswordLinkServiceSub = makeSendResetPasswordLinkServiceStub()

  const sut = new SendResetPasswordUseCaseImpl(
    findUsernameRepositoryStub,
    hashAdapterStub,
    persistPasswordTokenRepositoryStub,
    sendResetPasswordLinkServiceSub,
    new EventDispatcher()
  )

  return {
    sut,
    findUsernameRepositoryStub,
    hashAdapterStub,
    persistPasswordTokenRepositoryStub,
    sendResetPasswordLinkServiceSub,
  }
}

test.group('SendResetPasswordUseCase', () => {
  test('should returns UserNotFoundError, when username does not exists', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    sinon.stub(findUsernameRepositoryStub, 'findUsername').resolves(undefined)

    const output = await sut.perform({
      username: 'invalid@mail.com',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UserNotFoundError)
  })

  test('should calls sendResetPasswordLinkService with token', async ({ expect }) => {
    const { sut, sendResetPasswordLinkServiceSub } = makeSut()

    const sendResetPasswordLinkServiceSpy = sinon.spy(sendResetPasswordLinkServiceSub, 'send')

    await sut.perform({ username: 'valid@mail.com' })
    expect(sendResetPasswordLinkServiceSpy.callCount).toEqual(1)
    expect(
      sendResetPasswordLinkServiceSpy.calledWith({
        fullName: 'valid user',
        userLang: 'pt',
        token: 'valid_token',
        username: 'valid@email.com',
      })
    ).toBeTruthy()
  })

  test('should throws when findUsernameRepository throws', async ({ expect }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    const error = new Error('Database Error')

    const mock = sinon.mock(findUsernameRepositoryStub)

    mock.expects('findUsername').once().throws(error)

    const output = sut.perform({
      username: 'valid@mail.com',
    })

    await expect(output).rejects.toThrow(error)
    mock.restore()
  })
})
