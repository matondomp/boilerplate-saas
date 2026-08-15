import { Either, UseCase } from '#core/domain/index'
import { UpdateDashboardItemUseCaseInput } from './update_dashboard_item_usecase_input.js'
import { DashboardItemNotFoundError } from '../../errors/dashboard_item_not_found_error.js'

export type UpdateDashboardItemUseCase = UseCase<
  UpdateDashboardItemUseCaseInput,
  Either<DashboardItemNotFoundError, void>
>
