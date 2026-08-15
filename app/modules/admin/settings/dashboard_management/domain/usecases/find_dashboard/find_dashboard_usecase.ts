import { UseCase } from '#core/domain/index'
import { FindDashboardBySlugUseCaseOutput } from './find_dashboard_usecase_output.js'

export type FindDashboardBySlugUseCase = UseCase<
  string,
  FindDashboardBySlugUseCaseOutput | undefined
>
