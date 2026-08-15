import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardItemUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { Chart } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'
import { DashboardItemNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_item_not_found_error'
import { makeUpdateDashboardItemRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeFindDashboardItemByIdRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: UpdateDashboardItemUseCaseImpl
  updateDashboardItemRepositoryStub: UpdateDashboardItemRepository
  findDashboardItemByIdRepositoryStub: FindDashboardItemByIdRepository
}

const makeInput = () => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    chartType: Chart.BAR,
    sqlRaw: 'valid_sql_raw',
  }
}

const makeSut = (): SutTypes => {
  const updateDashboardItemRepositoryStub = makeUpdateDashboardItemRepositoryStub()
  const findDashboardItemByIdRepositoryStub = makeFindDashboardItemByIdRepositoryStub()

  const sut = new UpdateDashboardItemUseCaseImpl(
    updateDashboardItemRepositoryStub,
    findDashboardItemByIdRepositoryStub
  )

  return {
    sut,
    updateDashboardItemRepositoryStub,
    findDashboardItemByIdRepositoryStub,
  }
}

test.group('Update dashboard item', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('Should update the item', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not update a not found item', async ({ assert }) => {
    const { sut, findDashboardItemByIdRepositoryStub } = makeSut()

    sinon.replace(
      findDashboardItemByIdRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(undefined))
    )
    const output = await sut.perform(makeInput())
    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, DashboardItemNotFoundError)
  })
})
