import { UseCase } from '#core/domain/index'
import { ListDashboardsUseCaseInput } from './list_dashboards_usecase_input.js'
import { ListDashboardsUseCaseOutput } from './list_dashboards_usecase_output.js'

export type ListDashboardsUseCase = UseCase<ListDashboardsUseCaseInput, ListDashboardsUseCaseOutput>
