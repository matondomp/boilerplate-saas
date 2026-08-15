import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { ExecuteItemQueryUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/execute_item_query_usecase_impl'
import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/ports/index'
import { makeExecuteItemQueryRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: ExecuteItemQueryUseCaseImpl
  executeItemQueryRepositoryStub: ExecuteItemQueryRepository
}

const makeInput = () => ({
  sqlRaw: 'valid_sql_raw',
})

const makeSut = (): SutTypes => {
  const executeItemQueryRepositoryStub = makeExecuteItemQueryRepositoryStub()

  const sut = new ExecuteItemQueryUseCaseImpl(executeItemQueryRepositoryStub)

  return {
    sut,
    executeItemQueryRepositoryStub,
  }
}

test.group('Execute item query', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })
})
