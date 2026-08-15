import { UseCase } from '#core/domain/index'
import { FindDashboardItemByIdUseCaseOutput } from './find_dashboard_item_usecase_output.js'

export type FindDashboardItemByIdUseCase = UseCase<
  string,
  FindDashboardItemByIdUseCaseOutput | undefined
>
