import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDefaultDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDefaultDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { makeUpdateDefaultDashboardRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'

type SutTypes = {
  sut: UpdateDefaultDashboardUseCaseImpl
  updateDefaultDashboardRepositoryStub: UpdateDefaultDashboardRepository
  findDashboardRepositoryStub: FindDashboardBySlugRepository
}

const makeInput = () => {
  return {
    dashboardSlug: 'valid_slug',
  }
}

const makeSut = (): SutTypes => {
  const updateDefaultDashboardRepositoryStub = makeUpdateDefaultDashboardRepositoryStub()
  const findDashboardRepositoryStub = makeFindDashboardBySlugRepositoryStub()

  const sut = new UpdateDefaultDashboardUseCaseImpl(
    findDashboardRepositoryStub,
    updateDefaultDashboardRepositoryStub
  )

  return {
    sut,
    updateDefaultDashboardRepositoryStub,
    findDashboardRepositoryStub,
  }
}

test.group('Update default dashboard', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('Should update dashboard to default', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not update a not found dashboard to default', async ({ assert }) => {
    const { sut, findDashboardRepositoryStub } = makeSut()

    sinon.replace(
      findDashboardRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(undefined))
    )
    const output = await sut.perform(makeInput())
    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, DashboardNotFoundError)
  })
})
