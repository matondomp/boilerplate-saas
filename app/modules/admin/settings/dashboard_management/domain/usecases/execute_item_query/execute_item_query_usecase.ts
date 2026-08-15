import { UseCase } from '#core/domain/index'
import { ExecuteItemQueryUseCaseInput } from './execute_item_query_usecase_input.js'
import { ExecuteItemQueryUseCaseOutput } from './execute_item_query_usecase_output.js'

export type ExecuteItemQueryUseCase = UseCase<
  ExecuteItemQueryUseCaseInput,
  ExecuteItemQueryUseCaseOutput
>
