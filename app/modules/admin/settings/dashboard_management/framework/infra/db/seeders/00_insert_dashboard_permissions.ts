import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export default class InsertPermissionSeed extends BaseSeeder {
  async run() {
    const permissions = [
      {
        id: 'admin-create-dashboards',
        group: 'permission.group.dashboards',
        display: 'permission.create.dashboards',
        description: 'permission.create.dashboards.description',
      },
      {
        id: 'admin-view-dashboards',
        group: 'permission.group.dashboards',
        display: 'permission.view.dashboards',
        description: 'permission.view.dashboards.description',
      },
      {
        id: 'admin-edit-dashboard',
        group: 'permission.group.dashboards',
        display: 'permission.edit.dashboard',
        description: 'permission.edit.dashboard.description',
      },
      {
        id: 'admin-set-default-dashboard',
        group: 'permission.group.dashboards',
        display: 'permission.set.default.dashboard',
        description: 'permission.set.default.dashboard.description',
      },
      {
        id: 'admin-delete-dashboard',
        group: 'permission.group.dashboards',
        display: 'permission.delete.dashboard',
        description: 'permission.delete.dashboard.description',
      },
      {
        id: 'admin-view-dashboard-details',
        group: 'permission.group.dashboards',
        display: 'permission.view.dashboard.details',
        description: 'permission.view.dashboard.details.description',
      },
      {
        id: 'admin-list-items',
        group: 'permission.group.dashboards',
        display: 'permission.list.items',
        description: 'permission.list.items.description',
      },
      {
        id: 'admin-attach-dashboard-item',
        group: 'permission.group.dashboards',
        display: 'permission.attach.dashboard.item',
        description: 'permission.attach.dashboard.item.description',
      },
      {
        id: 'admin-edit-dashboard-items',
        group: 'permission.group.dashboards',
        display: 'permission.edit.dashboard.items',
        description: 'permission.edit.dashboard.items.description',
      },
      {
        id: 'admin-detach-dashboard-item',
        group: 'permission.group.dashboards',
        display: 'permission.detach.dashboard.item',
        description: 'permission.detach.dashboard.item.description',
      },
    ]

    for (const permission of permissions) {
      await CorePermissionModel.firstOrCreate({ id: permission.id }, permission)
    }
  }
}
