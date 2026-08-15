import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { FindLogsRepository } from '#modules/admin/audit/log/usecases/index'
import { Pagination } from '#core/ports/index'
import { Options } from '#modules/admin/audit/log/usecases/view_logs/ports/index'

export const makeFindLogsRepositoryStub = (): FindLogsRepository => {
  return new (class implements FindLogsRepository {
    async find(_: Options): Promise<Pagination<LogEntity>> {
      const logEntity = LogEntity.create({
        title: 'valid_title',
        source: 'valid_source',
        success: true,
        fullLog: {},
        summary: 'valid_value',
        userId: 'valid-user-id',
        username: 'valid-username',
      })

      if (logEntity.isLeft()) {
        throw new Error(logEntity.value.errorMessage)
      }

      return {
        pagination: {
          total: 10,
          perPage: 2,
          page: 1,
        },
        data: [logEntity.value],
      }
    }
  })()
}
