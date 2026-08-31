import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertClientMenuSeed extends BaseSeeder {
  async run() {
    await CoreMenuModel.firstOrCreate(
      { slug: 'client_management' },
      {
        display: 'menu.main.client_management.client',
        url: '/client-manage/client',
        icon: 'list',
        permissionId: 'client-manage-view-client',
        order: 1,
        belongsTo: 'client_management_crm',
      }
    )
  }
}
