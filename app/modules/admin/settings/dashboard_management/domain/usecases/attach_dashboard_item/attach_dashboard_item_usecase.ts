import { Either, UseCase } from '#core/domain/index'
import { AttachDashboardItemUseCaseInput } from './attach_dashboard_item_usecase_input.js'
import { DashboardItemNotFoundError } from '../../errors/dashboard_item_not_found_error.js'
import { DashboardNotFoundError } from '../../errors/dashboard_not_found_error.js'

export type AttachDashboardItemUseCase = UseCase<
  AttachDashboardItemUseCaseInput,
  Either<DashboardNotFoundError | DashboardItemNotFoundError, void>
>
