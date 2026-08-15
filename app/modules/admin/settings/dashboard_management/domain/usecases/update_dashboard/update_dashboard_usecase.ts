import { Either, UseCase } from '#core/domain/index'
import { UpdateDashboardUseCaseInput } from './update_dashboard_usecase_input.js'
import { DashboardNotFoundError } from '../../errors/dashboard_not_found_error.js'

export type UpdateDashboardUseCase = UseCase<
  UpdateDashboardUseCaseInput,
  Either<DashboardNotFoundError, void>
>
