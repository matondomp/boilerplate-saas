import { UseCase } from '#core/domain/index'
import { CreateDashboardItemUseCaseInput } from './create_dashboard_item_usecase_input.js'
import { CreateDashboardItemUseCaseOutput } from './create_dashboard_item_usecase_output.js'

export type CreateDashboardItemUseCase = UseCase<
  CreateDashboardItemUseCaseInput,
  CreateDashboardItemUseCaseOutput
>
