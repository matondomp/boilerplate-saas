import {
  ExecuteItemQueryUseCaseInput,
  ExecuteItemQueryUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/index'
import { ExecuteItemQueryRepository } from './ports/execute_item_query_repository.js'
import { ExecuteItemQueryUseCase } from '#modules/admin/settings/dashboard_management/domain/index'

export class ExecuteItemQueryUseCaseImpl implements ExecuteItemQueryUseCase {
  constructor(private readonly executeItemQueryRepository: ExecuteItemQueryRepository) {}

  async perform(input: ExecuteItemQueryUseCaseInput): Promise<ExecuteItemQueryUseCaseOutput> {
    return this.executeItemQueryRepository.execute(input)
  }
}
