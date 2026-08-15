import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DashboardItemEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardItemModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export class DashboardItemMapper extends Mapper<DashboardItemEntity, DashboardItemModel> {
  toDomain(dashboardItemModel: DashboardItemModel): DashboardItemEntity {
    const dashboardItemEntity = DashboardItemEntity.hydrate(
      new UniqueEntityID(dashboardItemModel.id),
      {
        name: dashboardItemModel.name,
        sqlRaw: dashboardItemModel.sqlRaw,
        chartType: dashboardItemModel.chartType,
        slug: dashboardItemModel.slug,
        width: dashboardItemModel.$extras.pivot_width,
        height: dashboardItemModel.$extras.pivot_height,
        x: dashboardItemModel.$extras.pivot_x,
        y: dashboardItemModel.$extras.pivot_y,
      }
    )
    return dashboardItemEntity
  }
  toPersistence(_: DashboardItemEntity): DashboardItemModel | Promise<DashboardItemModel> {
    throw new Error('Method not implemented.')
  }
}
