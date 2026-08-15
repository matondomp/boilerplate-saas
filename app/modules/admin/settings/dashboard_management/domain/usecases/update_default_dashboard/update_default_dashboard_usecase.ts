import { Either, UseCase } from '#core/domain/index'
import { UpdateDefaultDashboardUseCaseInput } from './update_default_dashboard_usecase_input.js'
import { DashboardNotFoundError } from '../../errors/dashboard_not_found_error.js'

export type UpdateDefaultDashboardUseCase = UseCase<
  UpdateDefaultDashboardUseCaseInput,
  Either<DashboardNotFoundError, void>
>
