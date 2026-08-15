import { RetrieveDashboardsUseCaseOutput } from '#modules/admin/common/domain/usecases/retrieve_dashboards/retrieve_dashboards_usecase_output'

export interface RetrieveDashboardsRepository {
  findAll(): Promise<RetrieveDashboardsUseCaseOutput>
}
