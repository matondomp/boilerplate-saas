import { LogsQueryBuilderImpl } from '#modules/admin/audit/log/framework/infra/db/builder/logs_query_builder_impl'
import { ViewLogsUseCaseImpl } from '#modules/admin/audit/log/usecases/index'
import { test } from '@japa/runner'
import { FindLogsRepository } from './index.js'
import { makeFindLogsRepositoryStub } from '#modules/admin/audit/log/framework/tests/factories/make_find_logs_respository_stub'
import { DateAdapterImpl } from '#shared/framework/infra/index'
import Sinon from 'sinon'
import { ViewLogsUseCase } from '../../domain/index.js'

interface SutTypes {
  sut: ViewLogsUseCaseImpl
  findLogsRepositoryStub: FindLogsRepository
}

const makeSut = (): SutTypes => {
  const findLogsRepositoryStub = makeFindLogsRepositoryStub()
  const sut = new ViewLogsUseCaseImpl(
    findLogsRepositoryStub,
    new LogsQueryBuilderImpl(),
    new DateAdapterImpl()
  )
  return {
    sut,
    findLogsRepositoryStub,
  }
}

test.group('View logs usecase', function () {
  test('Perform method should be called', ({ assert }) => {
    const { sut } = makeSut()
    const spy = Sinon.spy(sut, 'perform')

    const options: ViewLogsUseCase.Input = {
      withPagination: true,
      page: 1,
      perPage: 2,
      title: '',
      user: '',
      source: '',
      date: new Date(),
      success: true,
    }

    sut.perform(options)

    assert.isTrue(spy.calledOnce)
  })
})
