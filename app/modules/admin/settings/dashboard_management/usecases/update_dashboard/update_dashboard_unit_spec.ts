import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { UpdateDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { makeUpdateDashboardRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: UpdateDashboardUseCaseImpl
  updateDashboardRepositoryStub: UpdateDashboardRepository
  findDashboardRepositoryStub: FindDashboardBySlugRepository
}

const makeInput = () => {
  const dashboard = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
    name: 'valid_name',
    description: 'valid_description',
    slug: 'valid_slug',
    isDefault: false,
  })
  return dashboard
}

const makeSut = (): SutTypes => {
  const updateDashboardRepositoryStub = makeUpdateDashboardRepositoryStub()
  const findDashboardRepositoryStub = makeFindDashboardBySlugRepositoryStub()

  const sut = new UpdateDashboardUseCaseImpl(
    findDashboardRepositoryStub,
    updateDashboardRepositoryStub
  )

  return {
    sut,
    updateDashboardRepositoryStub,
    findDashboardRepositoryStub,
  }
}

test.group('Update dashboard', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test('Should update the dashboard', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should not update a not found dashboard', async ({ assert }) => {
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
