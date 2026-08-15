import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'

export default class InsertBaseRolesSeed extends BaseSeeder {
  async run() {
    const roles = [
      {
        name: 'shared.roles.root',
        description: 'shared.roles.root.description',
        slug: 'root',
        system: true,
      },
      {
        name: 'shared.roles.admin',
        description: 'shared.roles.admin.description',
        slug: 'admin',
        system: true,
      },
    ]

    await CoreRoleModel.fetchOrCreateMany('slug', roles)
  }
}
