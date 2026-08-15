import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'
import { CreateDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard_item/index'
import { CreateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard_item/ports/index'
import { makeCreateDashboardItemRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: CreateDashboardItemUseCaseImpl
  createDashboardItemRespository: CreateDashboardItemRepository
}

const makeInput = () => ({
  dashboardId: 'valid_id',
  chartType: Chart.BAR,
  name: 'valid_name',
  sqlRaw: 'valid_sql_raw',
  x: 30,
  y: 40,
  width: 50,
  height: 50,
})

const makeSut = (): SutTypes => {
  const createDashboardItemRespository = makeCreateDashboardItemRepositoryStub()

  const sut = new CreateDashboardItemUseCaseImpl(createDashboardItemRespository)

  return {
    sut,
    createDashboardItemRespository,
  }
}

test.group('Create dashboard item', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })
})
