import { Either, UseCase } from '#core/domain/index'
import { CreateDashboardUseCaseInput } from './create_dashboard_usecases_input.js'
import { CreateDashboardUseCaseOutput } from './create_dashboard_usecases_output.js'
import { DashboardAlreadyExistError } from '../../errors/dashboard_already_exist_error.js'

export type CreateDashboardUseCase = UseCase<
  CreateDashboardUseCaseInput,
  Either<DashboardAlreadyExistError, CreateDashboardUseCaseOutput>
>
