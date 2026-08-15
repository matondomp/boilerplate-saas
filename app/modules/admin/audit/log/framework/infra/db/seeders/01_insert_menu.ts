import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class MenuSeedSeeder extends BaseSeeder {
  async run() {
    await CoreMenuModel.create({
      display: 'menu.admin.audit.log',
      slug: 'audit_application',
      url: '/admin/audit/logs',
      icon: 'clipboard',
      order: 1,
      permissionId: 'admin-view-logs',
      belongsTo: 'group_audit',
    })
  }
}
