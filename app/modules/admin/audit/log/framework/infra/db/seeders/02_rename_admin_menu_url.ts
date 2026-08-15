import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class RenameAdminMenuRouteUrl extends BaseSeeder {
  async run() {
    const menu = await CoreMenuModel.findByOrFail('slug', 'audit_application')

    menu.url = '/account/admin/audit/logs'

    await menu.save()
  }
}
