import { test } from '@japa/runner'
import * as sinon from 'sinon'

import { EventDispatcher, UniqueEntityID } from '#core/domain/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { ImpersonateUserUseCaseImpl } from './impersonate_user_usecase_impl.js'
import { InactiveUserCannotBeImpersonatedError } from '../../domain/errors/index.js'
import { StatusEnum } from '#shared/domain/types/index'
import { UserCannotImpersonateRootUserError } from './../../domain/errors/user_cannot_impersonate_root_user_error.js'
import { makeFindUserWithRoleRepositoryStub } from '#modules/auth/__test__/index'
import { FindUsernameWithRoleRepository } from '#shared/usecases/ports/find_username_with_role_repository'

type SutTypes = {
  sut: ImpersonateUserUseCaseImpl
  findUsernameRepositoryStub: FindUsernameWithRoleRepository
}

const makeInput = () => ({
  username: new UniqueEntityID('invalid-user'),
  role: new UniqueEntityID('valid-role'),
})
const makeSut = (): SutTypes => {
  const findUsernameRepositoryStub = makeFindUserWithRoleRepositoryStub()
  const sut = new ImpersonateUserUseCaseImpl(findUsernameRepositoryStub, new EventDispatcher())

  return { sut, findUsernameRepositoryStub }
}

test.group('ImpersonateUserUseCase', () => {
  test('should be not to impersonate a user, when user not exists', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    sinon.replace(
      findUsernameRepositoryStub,
      'findUsername',
      sinon.fake.returns(Promise.resolve(undefined))
    )

    const output = await sut.perform(makeInput())

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UserNotFoundError)
  })

  test('should be not to impersonate a user, when user is inactive', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    sinon.replace(
      findUsernameRepositoryStub,
      'findUsername',
      sinon.fake((username) => {
        return Promise.resolve(
          makeFindUserWithRoleRepositoryStub({ status: StatusEnum.INACTIVE }).findUsername(username)
        )
      })
    )

    const output = await sut.perform(makeInput())

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, InactiveUserCannotBeImpersonatedError)
  })

  test('should not be able to impersonate a root user, if isnt a root user', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()

    sinon.replace(
      findUsernameRepositoryStub,
      'findUsername',
      sinon.fake((username) => {
        return Promise.resolve(
          makeFindUserWithRoleRepositoryStub(undefined, {
            slug: 'root',
          }).findUsername(username)
        )
      })
    )

    const output = await sut.perform(makeInput())

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UserCannotImpersonateRootUserError)
  })

  test('should return the uid of valid user', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())

    assert.isTrue(output.isRight())
    assert.instanceOf(output.value, UniqueEntityID)
  })
})
