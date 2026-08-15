import { RetrieveDashboardsUseCaseOutput } from './retrieve_dashboards_usecase_output.js'
import { UseCase } from '#core/domain/index'

export type RetrieveDashboardsUseCase = UseCase<void, RetrieveDashboardsUseCaseOutput>
