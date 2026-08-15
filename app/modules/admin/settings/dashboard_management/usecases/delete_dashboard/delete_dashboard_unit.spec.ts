import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/update_dashboard/index'
import { DeleteDashboardUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/delete_dashboard/index'
import { FindDashboardBySlugRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { makeFindDashboardBySlugRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeUpdateDashboardRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'

type SutTypes = {
  sut: DeleteDashboardUseCaseImpl
  findDashboardBySlugRepositoryStub: FindDashboardBySlugRepository
  updateDashboardRepositoryStub: UpdateDashboardRepository
}

const Input = 'valid_slug'

const makeSut = (): SutTypes => {
  const findDashboardBySlugRepositoryStub = makeFindDashboardBySlugRepositoryStub()
  const updateDashboardRepositoryStub = makeUpdateDashboardRepositoryStub()

  const sut = new DeleteDashboardUseCaseImpl(
    findDashboardBySlugRepositoryStub,
    updateDashboardRepositoryStub
  )

  return {
    sut,
    findDashboardBySlugRepositoryStub,
    updateDashboardRepositoryStub,
  }
}

test.group('Delete dashboard', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(Input)

    assert.isTrue(spy.calledOnce)
  })

  test('Should delete a dashboard', async ({ assert }) => {
    const { sut, findDashboardBySlugRepositoryStub } = makeSut()
    const dashboard = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
      name: 'valid_name',
      description: 'valid_description',
      slug: 'valid_slug',
      isDefault: false,
    })

    sinon.replace(
      findDashboardBySlugRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(dashboard))
    )

    const output = await sut.perform(Input)
    assert.isTrue(output.isRight())
  })

  test('Should not delete a not found dashboard', async ({ assert }) => {
    const { sut, findDashboardBySlugRepositoryStub } = makeSut()

    sinon.replace(
      findDashboardBySlugRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(undefined))
    )
    const output = await sut.perform(Input)
    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, DashboardNotFoundError)
  })

  test('Should not delete a default dashboard', async ({ assert }) => {
    const { sut, findDashboardBySlugRepositoryStub } = makeSut()
    const dashboard = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
      name: 'valid_name',
      description: 'valid_description',
      slug: 'valid_slug',
      isDefault: true,
    })

    sinon.replace(
      findDashboardBySlugRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(dashboard))
    )

    const output = await sut.perform(Input)
    assert.isTrue(output.isLeft())
  })
})
