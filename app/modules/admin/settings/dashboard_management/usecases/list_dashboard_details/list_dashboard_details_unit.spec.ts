import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/index'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ListDashboardDetailsUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { ListDashboardDetailsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeExecuteItemQueryRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeListDashboardDetailsRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'

type SutTypes = {
  sut: ListDashboardDetailsUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardBySlugRepository
  executeItemQueryRepositoryStub: ExecuteItemQueryRepository
  listDashboardDetailsRepositoryStub: ListDashboardDetailsRepository
}

const makeInput = () => {
  return {
    slug: 'valid_slug',
  }
}

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardBySlugRepositoryStub()
  const listDashboardDetailsRepositoryStub = makeListDashboardDetailsRepositoryStub()
  const executeItemQueryRepositoryStub = makeExecuteItemQueryRepositoryStub()

  const sut = new ListDashboardDetailsUseCaseImpl(
    listDashboardDetailsRepositoryStub,
    findDashboardBySlugRepositoryStub,
    executeItemQueryRepositoryStub
  )

  return {
    sut,
    listDashboardDetailsRepositoryStub,
    findDashboardBySlugRepositoryStub,
    executeItemQueryRepositoryStub,
  }
}

test.group('Retrieve dashboard details', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('should list dashboard details', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not list dashboard details if dashboard not found', async ({ assert }) => {
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
