import { RetrieveDashboardItemsUseCaseOutput } from './retrieve_dashboard_items_usecase_output.js'
import { DashboardNotFoundError } from '#modules/admin/settings/dashboard_management/domain/errors/dashboard_not_found_error'
import { RetrieveDashboardItemsUseCaseInput } from './retrieve_dashboard_items_usecase_input.js'
import { Either, UseCase } from '#core/domain/index'

export type RetrieveDashboardItemsUseCase = UseCase<
  RetrieveDashboardItemsUseCaseInput,
  Either<DashboardNotFoundError, RetrieveDashboardItemsUseCaseOutput>
>
