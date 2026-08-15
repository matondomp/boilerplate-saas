import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardItemByIdRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardItemByIdUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { makeFindDashboardItemByIdRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: FindDashboardItemByIdUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardItemByIdRepository
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardItemByIdRepositoryStub()

  const sut = new FindDashboardItemByIdUseCaseImpl(findDashboardBySlugRepositoryStub)

  return {
    sut,
    findDashboardBySlugRepositoryStub,
  }
}

test.group('Find dashboard item', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform('valid_slug')

    assert.isTrue(spy.calledOnce)
  })
})
