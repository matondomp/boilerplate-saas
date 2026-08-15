import {
  CorePermissionModel,
  CoreRoleModel,
  CoreRolePermissionModel,
} from '#shared/framework/infra/db/models/index'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AssociatePermissionsWithRote extends BaseSeeder {
  async run() {
    const role = await CoreRoleModel.findBy('slug', 'root')

    if (!role) {
      throw new Error('Role "root" not found!')
    }

    await CoreRolePermissionModel.query().where({ roleId: role.id }).delete()

    const permissions = await CorePermissionModel.all()

    await CoreRolePermissionModel.createMany(
      permissions.map((permission) => ({
        permissionId: permission.id,
        roleId: role.id,
      }))
    )
  }
}
