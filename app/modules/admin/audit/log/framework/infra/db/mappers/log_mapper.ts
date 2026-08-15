import { Mapper, UniqueEntityID } from '#core/domain/index'
import { LogEntity } from '#modules/admin/audit/log/domain/index'
import { CoreAppLogsSchema } from '#modules/admin/audit/log/framework/infra/db/models/core_app_logs'

export class LogMapper implements Mapper<LogEntity, CoreAppLogsSchema> {
  toDomain(data: CoreAppLogsSchema): LogEntity {
    return LogEntity.hydrate(
      new UniqueEntityID(data.hash),
      {
        title: data.title,
        success: data.success,
        errorMessage: data.errorMessage,
        username: data.username,
        source: data.source,
        summary: data.summary,
        fullLog: data.fullLog,
        userId: data.userId,
        hash: data.hash,
      },
      {
        createdAt: data.createdAt as Date,
      }
    )
  }

  toPersistence(_: LogEntity): CoreAppLogsSchema {
    throw new Error('Method not implemented.')
  }
}
