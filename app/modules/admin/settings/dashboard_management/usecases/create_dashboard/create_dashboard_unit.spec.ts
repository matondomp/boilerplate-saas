import { UpdateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/update_dashboard/index'
import { FindDashboardByNameRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { UniqueEntityID } from '#core/domain/index'
import { makeUpdateDashboardRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeCreateDashboardRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { makeFindDashboardByNameRepositoryStub } from '#modules/admin/settings/dashboard_management/framework/test/factories/index'
import { DashboardAlreadyExistError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_already_exist_error'
import { CreateDashboardeUseCaseImpl } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard/create_dashboard_usecase_impl'
import { CreateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/create_dashboard/ports/index'

type SutTypes = {
  sut: CreateDashboardeUseCaseImpl
  findDashboardByNameRepositoryStub: FindDashboardByNameRepository
  updateDashboardRepositoryStub: UpdateDashboardRepository
  createDashboardRepositoryStub: CreateDashboardRepository
}

const makeInput = () => ({
  name: 'valid_name',
  description: 'valid_description',
})

const makeSut = (): SutTypes => {
  const findDashboardByNameRepositoryStub = makeFindDashboardByNameRepositoryStub()
  const updateDashboardRepositoryStub = makeUpdateDashboardRepositoryStub()
  const createDashboardRepositoryStub = makeCreateDashboardRepositoryStub()

  const sut = new CreateDashboardeUseCaseImpl(
    createDashboardRepositoryStub,
    findDashboardByNameRepositoryStub,
    updateDashboardRepositoryStub
  )

  return {
    sut,
    createDashboardRepositoryStub,
    findDashboardByNameRepositoryStub,
    updateDashboardRepositoryStub,
  }
}

test.group('Create dashboard', () => {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = sinon.spy(sut, 'perform')
    sut.perform(makeInput())

    assert.isTrue(spy.calledOnce)
  })

  test("Should create a dashboard when it doesn't exists", async ({ assert }) => {
    const { sut, findDashboardByNameRepositoryStub } = makeSut()

    sinon.replace(
      findDashboardByNameRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(undefined))
    )

    const output = await sut.perform(makeInput())
    assert.isTrue(output.isRight())
  })

  test('Should restore a deleted dashboard', async ({ assert }) => {
    const { sut, findDashboardByNameRepositoryStub } = makeSut()
    const dashboard = DashboardEntity.hydrate(new UniqueEntityID('valid_id'), {
      name: 'valid_name',
      description: 'valid_description',
      slug: 'valid_slug',
      isDefault: false,
    })

    dashboard.delete()

    sinon.replace(
      findDashboardByNameRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(dashboard))
    )
    const output = await sut.perform(dashboard)
    assert.isTrue(output.isRight())
  })

  test('Should not create a dashboard that exists and is not deleted', async ({ assert }) => {
    const { sut, findDashboardByNameRepositoryStub } = makeSut()
    const dashboard = {
      isDeleted: false,
      ...makeInput,
    } as DashboardEntity

    sinon.replace(
      findDashboardByNameRepositoryStub,
      'find',
      sinon.fake.returns(Promise.resolve(dashboard))
    )
    const output = await sut.perform(dashboard)
    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, DashboardAlreadyExistError)
  })
})
