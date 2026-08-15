import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MenuSeedSeeder extends BaseSeeder {
  async run() {
    const menus = [
      {
        display: 'menu.main',
        slug: 'group_main',
        url: '',
        icon: '',
        order: 1,
        isGroup: true,
      },
      {
        display: 'menu.settings',
        slug: 'group_settings',
        url: '',
        icon: '',
        order: 2,
        isGroup: true,
      },
    ]

    await CoreMenuModel.createMany(menus)
  }
}
