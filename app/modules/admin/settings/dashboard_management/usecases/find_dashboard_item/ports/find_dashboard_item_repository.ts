import { FindDashboardItemByIdUseCaseOutput } from '#modules/admin/settings/dashboard_management/domain/usecases/index'

export interface FindDashboardItemByIdRepository {
  find(input: string): Promise<FindDashboardItemByIdUseCaseOutput | undefined>
}
