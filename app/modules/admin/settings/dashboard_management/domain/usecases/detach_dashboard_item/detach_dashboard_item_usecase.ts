import { Either, UseCase } from '#core/domain/index'
import { DetachDashboardItemUseCaseInput } from './detach_dashboard_item_usecase_input.js'
import { DashboardItemNotFoundError } from '../../errors/dashboard_item_not_found_error.js'

export type DetachDashboardItemUseCase = UseCase<
  DetachDashboardItemUseCaseInput,
  Either<DashboardItemNotFoundError, void>
>
