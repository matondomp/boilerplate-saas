import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { ListDashboardItemsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/index'
import { ListDashboardItemsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { makeExecuteItemQueryRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeListDashboardItemsRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: ListDashboardItemsUseCaseImpl
  listDashboardItemsRepositoryStub: ListDashboardItemsRepository
  executeItemQueryRepositoryStub: ExecuteItemQueryRepository
}

const makeSut = (): SutTypes => {
  const listDashboardItemsRepositoryStub = makeListDashboardItemsRepositoryStub()
  const executeItemQueryRepositoryStub = makeExecuteItemQueryRepositoryStub()

  const sut = new ListDashboardItemsUseCaseImpl(
    listDashboardItemsRepositoryStub,
    executeItemQueryRepositoryStub
  )

  return {
    sut,
    listDashboardItemsRepositoryStub,
    executeItemQueryRepositoryStub,
  }
}

test.group('List dashboard items', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform()

    assert.isTrue(spy.calledOnce)
  })
})
