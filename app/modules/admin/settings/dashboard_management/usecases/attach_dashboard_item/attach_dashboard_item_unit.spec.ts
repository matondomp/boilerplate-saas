import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/index'
import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeFindDashboardItemByIdRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DashboardItemNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_item_not_found_error'
import { makeAttachDashboardItemRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import {
  AttachDashboardItemRepository,
  AttachDashboardItemUseCaseImpl,
} from '#modules/admin/settings/dashboard_management/usecases/index'

type SutTypes = {
  sut: AttachDashboardItemUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardBySlugRepository
  findDashboardItemByIdRepositoryStub: FindDashboardItemByIdRepository
  attachDashboardItemRepositoryStub: AttachDashboardItemRepository
}

const makeInput = () => {
  return {
    dashboardSlug: 'valid_slug',
    dashboardItemId: 'valid_id',
    x: 10,
    y: 50,
    width: 350,
    height: 250,
  }
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardBySlugRepositoryStub()
  const findDashboardItemByIdRepositoryStub = makeFindDashboardItemByIdRepositoryStub()
  const attachDashboardItemRepositoryStub = makeAttachDashboardItemRepositoryStub()

  const sut = new AttachDashboardItemUseCaseImpl(
    findDashboardBySlugRepositoryStub,
    findDashboardItemByIdRepositoryStub,
    attachDashboardItemRepositoryStub
  )

  return {
    sut,
    findDashboardBySlugRepositoryStub,
    findDashboardItemByIdRepositoryStub,
    attachDashboardItemRepositoryStub,
  }
}

test.group('Attach dashboard item', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('Should attach an item to a dashboard', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not attach a not found item to a dashboard', async ({ assert }) => {
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

  test('Should not attach an item to a not found dashboard', async ({ assert }) => {
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
