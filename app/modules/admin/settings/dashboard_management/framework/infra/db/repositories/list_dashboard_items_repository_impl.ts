import { ListDashboardItemsRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import { DashboardItemModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardItemMapper } from '#modules/admin/settings/dashboard_management/framework/infra/db/mappers/dashboard_item_mapper'

export class ListDashboardItemsRepositoryImpl implements ListDashboardItemsRepository {
  constructor(
    private readonly dashboardItemMapper: DashboardItemMapper = new DashboardItemMapper()
  ) {}
  async list(): Promise<DashboardItemEntity[]> {
    const dashboardItems = await DashboardItemModel.all()
    return dashboardItems.map((item) => this.dashboardItemMapper.toDomain(item))
  }
}
