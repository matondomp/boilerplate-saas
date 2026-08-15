import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard_item/index'
import { makeFindDashboardItemByIdRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DetachDashboardItemUseCaseImpl } from './detach_dashboard_item_usecase_impl.js'
import { makeDetachDashboardItemByIdRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DetachDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/detach_dashboard_item/index'
import { DashboardItemNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_item_not_found_error'

type SutTypes = {
  sut: DetachDashboardItemUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardBySlugRepository
  findDashboardItemByIdRepositoryStub: FindDashboardItemByIdRepository
  detachDashboardItemRepositoryStub: DetachDashboardItemRepository
}

const makeInput = () => {
  return {
    dashboardSlug: 'valid_slug',
    dashboardItemId: 'valid_id',
  }
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardBySlugRepositoryStub()
  const findDashboardItemByIdRepositoryStub = makeFindDashboardItemByIdRepositoryStub()
  const detachDashboardItemRepositoryStub = makeDetachDashboardItemByIdRepositoryStub()

  const sut = new DetachDashboardItemUseCaseImpl(
    findDashboardBySlugRepositoryStub,
    findDashboardItemByIdRepositoryStub,
    detachDashboardItemRepositoryStub
  )

  return {
    sut,
    findDashboardBySlugRepositoryStub,
    findDashboardItemByIdRepositoryStub,
    detachDashboardItemRepositoryStub,
  }
}

test.group('Detach dashboard item', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('Should detach an item from a dashboard', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not detach a not found item from a dashboard', async ({ assert }) => {
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

  test('Should not detach an item from a not found dashboard', async ({ assert }) => {
    const { sut, findDashboardBySlugRepositoryStub } = makeSut()

    sinon.replace(
      findDashboardBySlugRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(undefined))
    )
    const output = await sut.perform(makeInput())
    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, DashboardNotFoundError)
  })
})
