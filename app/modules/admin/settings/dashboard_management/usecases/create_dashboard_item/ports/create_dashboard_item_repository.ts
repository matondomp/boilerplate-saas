import type {
  CreateDashboardItemUseCaseOutput,
  CreateDashboardItemUseCaseInput,
} from '#modules/admin/settings/dashboard_management/domain/usecases/create_dashboard_item/index'

export interface CreateDashboardItemRepository {
  create(input: CreateDashboardItemUseCaseInput): Promise<CreateDashboardItemUseCaseOutput>
}
