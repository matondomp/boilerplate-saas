import { CoreRoleModel, CoreRolePermissionModel } from '#shared/framework/infra/db/models/index'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AssociateRoleWithPermissionSeed extends BaseSeeder {
  private async associateAdminPermissions() {
    const role = await CoreRoleModel.findBy('slug', 'admin')

    if (!role) {
      throw new Error('Role "admin" not found!')
    }

    const permissionIds = [
      'admin-acl-view-users',
      'admin-acl-create-user',
      'admin-acl-inactive-user',
      'admin-acl-active-user',
      'admin-acl-reset-user',
      'admin-acl-modify-user',
      'admin-acl-delete-user',
      'admin-acl-view-roles',
      'admin-acl-modify-role',
      'admin-acl-create-role',
      'admin-acl-delete-role',
    ]

    for (const permissionId of permissionIds) {
      await CoreRolePermissionModel.firstOrCreate({
        roleId: role.id,
        permissionId,
      })
    }
  }

  async run() {
    await this.associateAdminPermissions()
  }
}
