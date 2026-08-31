import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export default class InsertPermissionSeed extends BaseSeeder {
  async run() {
    await CorePermissionModel.firstOrCreate(
      { id: 'client-manage-view-client' },
      {
        group: 'permission.group.group_crm',
        display: 'permission.manage.client',
        description: 'permission.manage.client.description',
      }
    )
  }
}
