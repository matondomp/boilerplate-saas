import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardByNameUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardByNameRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { makeFindDashboardByNameRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: FindDashboardByNameUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardByNameRepository
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardByNameRepositoryStub()

  const sut = new FindDashboardByNameUseCaseImpl(findDashboardBySlugRepositoryStub)

  return {
    sut,
    findDashboardBySlugRepositoryStub,
  }
}

test.group('Find dashboard by name', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform('valid_slug')

    assert.isTrue(spy.calledOnce)
  })
})
