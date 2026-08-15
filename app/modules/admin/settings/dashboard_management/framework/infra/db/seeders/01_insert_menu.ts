import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertMarketplaceMenuSeed extends BaseSeeder {
  async run() {
    await CoreMenuModel.create({
      display: 'menu.main.dashboard.dashboard_management',
      slug: 'dashboard_management',
      url: '/admin/settings/dashboards/manage',
      icon: 'table',
      permissionId: 'admin-view-dashboards',
      order: 4,
      belongsTo: 'group_settings',
    })
  }
}
