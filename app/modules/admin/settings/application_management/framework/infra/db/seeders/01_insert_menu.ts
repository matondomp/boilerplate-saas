import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class InsertMarketplaceMenuSeed extends BaseSeeder {
  async run() {
    await CoreMenuModel.create({
      display: 'menu.admin.setting.setup.application',
      slug: 'setup_application',
      url: '/admin/settings/application',
      icon: 'table',
      order: 3,
      permissionId: 'admin-setup-application',
      belongsTo: 'group_settings',
    })
  }
}
