import { ExecuteItemQueryRepository } from '#modules/admin/settings/dashboard_management/usecases/execute_item_query/index'
import {
  ExecuteItemQueryUseCaseInput,
  ExecuteItemQueryUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'

export const makeExecuteItemQueryRepositoryStub = (): ExecuteItemQueryRepository => {
  return new (class implements ExecuteItemQueryRepository {
    async execute(_input: ExecuteItemQueryUseCaseInput): Promise<ExecuteItemQueryUseCaseOutput> {
      return {
        yColumn: [1, 3, 5],
        xColumn: [2, 4, 6],
      }
    }
  })()
}
