import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export default class InsertPermissionSeed extends BaseSeeder {
  async run() {
    await CorePermissionModel.firstOrCreate(
      { id: 'admin-view-logs' },
      {
        group: 'permission.group.admin.audit',
        display: 'permission.view.logs',
        description: 'permission.view.logs.description',
      }
    )
  }
}
