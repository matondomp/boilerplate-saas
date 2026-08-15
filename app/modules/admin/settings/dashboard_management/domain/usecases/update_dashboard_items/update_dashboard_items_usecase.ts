import { UseCase } from '#core/domain/index'
import { UpdateDashboardItemsUseCaseInput } from './update_dashboard_items_usecase_input.js'
import { UpdateDashboardItemsUseCaseOuput } from './update_dashboard_items_usecase_output.js'

export type UpdateDashboardItemsUseCase = UseCase<
  UpdateDashboardItemsUseCaseInput,
  UpdateDashboardItemsUseCaseOuput
>
