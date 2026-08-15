import Database from '@adonisjs/lucid/services/db'
import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/index'
import {
  ExecuteItemQueryUseCaseInput,
  ExecuteItemQueryUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export class ExecuteItemQueryRepositoryImpl implements ExecuteItemQueryRepository {
  async execute(input: ExecuteItemQueryUseCaseInput): Promise<ExecuteItemQueryUseCaseOutput> {
    const queryResult = await Database.rawQuery(input.sqlRaw)
    const { result } = queryResult[0][0]
    return result
  }
}
