import { UseCase, Either } from '#core/domain/index'
import { DashboardItemNotFoundError } from '../../errors/dashboard_item_not_found_error.js'

export type DeleteDashboardItemUseCase = UseCase<string, Either<DashboardItemNotFoundError, void>>
