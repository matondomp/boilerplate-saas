import { InboxProcessorContract } from '#shared/domain/ports/inbox_processor_contract'
import { CoreAppLogs } from '#modules/admin/audit/log/framework/infra/db/models/core_app_logs'
import { LogInterface } from '#modules/admin/audit/log/domain/interfaces/index'
import { HashDriverAdapterImpl } from '#modules/auth/framework/infra/adapters/index'
import { HashAdapter } from '#modules/auth/usecases/index'
import env from '#start/env'

export class SaveLogProcessor implements InboxProcessorContract<LogInterface> {
  constructor(private readonly hashDriver: HashAdapter = new HashDriverAdapterImpl()) { }

  async perform(input: LogInterface): Promise<void> {
    await CoreAppLogs.insertOne({
      title: input.title,
      source: input.source,
      username: input.username,
      fullLog: input.fullLog,
      summary: input.summary,
      success: input.success,
      userId: input.userId,
      createdAt: input.createdAt,
      hash: await this.hashDriver.generate(env.get('APP_KEY'), input.userId),
    })
  }
}
