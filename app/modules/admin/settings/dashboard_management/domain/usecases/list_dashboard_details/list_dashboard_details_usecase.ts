import { Either, UseCase } from '#core/domain/index'
import { ListDashboardDetailsInput } from './list_dashboard_details_input.js'
import { ListDashboardDetailsOutput } from './list_dashboard_details_output.js'
import { DashboardNotFoundError } from '../../errors/dashboard_not_found_error.js'

export type ListDashboardDetailsUseCase = UseCase<
  ListDashboardDetailsInput,
  Either<DashboardNotFoundError, ListDashboardDetailsOutput>
>
