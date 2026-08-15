import { UseCase } from '#core/domain/index'
import { ListDashboardItemsUseCaseOutput } from './list_dashboard_items_usecase_output.js'

export type ListDashboardItemsUseCase = UseCase<void, ListDashboardItemsUseCaseOutput>
