import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class RenameClientMenuRouteUrl extends BaseSeeder {
  async run() {
    const menu = await CoreMenuModel.findBy('slug', 'client_management')

    if (!menu) {
      return
    }

    menu.url = '/client-manage/client'

    await menu.save()
  }
}
