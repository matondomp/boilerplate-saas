import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ReloadRootPermissions extends BaseCommand {
  static commandName = 'reload:root:permissions'
  static description = 'Add missing permissions to root profile!'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: false,
  }

  async run() {
    this.logger.info('Reload root permissions')

    const { CorePermissionModel, CoreRoleModel, CoreRolePermissionModel } = await import(
      '#shared/framework/infra/db/models/index'
    )

    const role = await CoreRoleModel.findByOrFail('slug', 'root')

    await CoreRolePermissionModel.query().where({ roleId: role.id }).delete()

    const permissions = await CorePermissionModel.all()

    await CoreRolePermissionModel.createMany(
      permissions.map((p) => ({
        permissionId: p.id,
        roleId: role.id,
      }))
    )

    this.logger.success('Reloaded')
  }
}
