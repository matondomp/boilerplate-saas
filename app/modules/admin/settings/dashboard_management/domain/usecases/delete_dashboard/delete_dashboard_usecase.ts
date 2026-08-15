import { UseCase, Either } from '#core/domain/index'
import { DashboardNotFoundError } from '../../errors/dashboard_not_found_error.js'

export type DeleteDashboardUseCase = UseCase<string, Either<DashboardNotFoundError, void>>
