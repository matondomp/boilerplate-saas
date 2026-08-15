import { StatusEnum } from '#shared/domain/types/index'
import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export class DashboardMapper implements Mapper<DashboardEntity, DashboardModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(dashboardModel: DashboardModel): DashboardEntity {
    const dashBoardEntity = DashboardEntity.hydrate(
      new UniqueEntityID(dashboardModel.id),
      {
        slug: dashboardModel.slug,
        name: dashboardModel.name,
        description: dashboardModel.description,
        isDefault: dashboardModel.isDefault,
      },
      {
        deletedAt: dashboardModel.deletedAt ? dashboardModel.deletedAt.toJSDate() : undefined,
        createdAt: dashboardModel.createdAt.toJSDate(),
        updatedAt: dashboardModel.updatedAt.toJSDate(),
      }
    )
    return dashBoardEntity
  }
  async toPersistence(dashboardEntity: DashboardEntity): Promise<DashboardModel> {
    let dashboardModel = new DashboardModel()
    dashboardModel.slug = dashboardEntity.slug

    const dashboard = await DashboardModel.findBy('slug', dashboardEntity.slug)

    if (dashboard) {
      dashboardModel = dashboard
    }

    dashboardModel.name = dashboardEntity.name
    dashboardModel.description = dashboardEntity.description
    dashboardModel.isDefault = dashboardEntity.isDefault
    dashboardModel.deletedAt = dashboardEntity.deletedAt
      ? this.dateAdapter.toDatePersistence(dashboardEntity.deletedAt)
      : null

    dashboardModel.statusId = dashboardEntity.status || StatusEnum.ACTIVE

    return dashboardModel
  }
}
