import { CorePermissionModel } from '#shared/framework/infra/db/models/index'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertPermissionSeed extends BaseSeeder {
  async run() {
    await CorePermissionModel.firstOrCreate(
      { id: 'admin-setup-application' },
      {
        group: 'permission.group.admin.setup.application',
        display: 'permission.setup.application',
        description: 'permission.setup.application.description',
        internal: true,
      }
    )
  }
}
