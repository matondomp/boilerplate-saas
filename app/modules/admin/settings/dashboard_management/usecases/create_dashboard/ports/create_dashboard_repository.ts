import {
  CreateDashboardUseCaseInput,
  CreateDashboardUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'

export interface CreateDashboardRepository {
  create(input: CreateDashboardUseCaseInput): Promise<CreateDashboardUseCaseOutput>
}
