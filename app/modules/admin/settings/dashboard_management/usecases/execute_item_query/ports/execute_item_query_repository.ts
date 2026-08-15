import {
  ExecuteItemQueryUseCaseOutput,
  ExecuteItemQueryUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'
export interface ExecuteItemQueryRepository {
  execute(input: ExecuteItemQueryUseCaseInput): Promise<ExecuteItemQueryUseCaseOutput>
}
