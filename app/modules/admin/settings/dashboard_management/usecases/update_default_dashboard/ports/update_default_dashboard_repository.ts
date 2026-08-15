import { UpdateDefaultDashboardUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export interface UpdateDefaultDashboardRepository {
  update(input: UpdateDefaultDashboardUseCaseInput): Promise<void>
}
