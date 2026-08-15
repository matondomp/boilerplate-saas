import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DateAdapterImpl } from '#shared/framework/infra/index'
import { ListDashboardsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/list_dashboards/list_dashboards_usecase_impl'
import { ListDashboardsRepository } from '#modules/admin/settings/dashboard_management/usecases/list_dashboards/ports/index'
import { makeListDashboardsRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: ListDashboardsUseCaseImpl
  listDashboardsRepositoryStub: ListDashboardsRepository
}

const makeSut = (): SutTypes => {
  const listDashboardsRepositoryStub = makeListDashboardsRepositoryStub()

  const sut = new ListDashboardsUseCaseImpl(listDashboardsRepositoryStub, new DateAdapterImpl())

  return {
    sut,
    listDashboardsRepositoryStub,
  }
}

test.group('List dashboards', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform()

    assert.isTrue(spy.calledOnce)
  })
})
