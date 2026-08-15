import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardBySlugUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/find_dashboard_usecase_impl'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/find_dashboard/ports/index'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: FindDashboardBySlugUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardBySlugRepository
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardBySlugRepositoryStub()

  const sut = new FindDashboardBySlugUseCaseImpl(findDashboardBySlugRepositoryStub)

  return {
    sut,
    findDashboardBySlugRepositoryStub,
  }
}

test.group('Find dashboard by slug', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform('valid_slug')

    assert.isTrue(spy.calledOnce)
  })
})
