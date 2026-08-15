import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MenuSeedSeeder extends BaseSeeder {
  async run() {
    await CoreMenuModel.create({
      display: 'menu.audit',
      slug: 'group_audit',
      url: '',
      icon: '',
      order: 3,
      isGroup: true,
    })
  }
}
