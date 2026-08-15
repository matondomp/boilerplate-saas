import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class RenameAdminMenuRouteUrl extends BaseSeeder {
  async run() {
    const menu = await CoreMenuModel.findByOrFail('slug', 'setup_application')

    menu.url = '/account/admin/settings/application'

    await menu.save()
  }
}
