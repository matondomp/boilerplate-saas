import { BaseSeeder } from '@adonisjs/lucid/seeders'
import {
  CorePermissionModel,
  CoreRoleModel,
  CoreRolePermissionModel,
} from '#shared/framework/infra/index'

export default class AddImpersonatePermissionToRoot extends BaseSeeder {
  private async associateRootPermissions() {
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

  async run(): Promise<void> {
    await CorePermissionModel.firstOrCreate(
      { id: 'admin-acl-impersonate-user' },
      {
        group: 'permission.group.acl.manage.users',
        display: 'permission.acl.root.impersonate',
        description: 'permission.acl.root.impersonate.description',
        internal: true,
      }
    )

    await this.associateRootPermissions()
  }
}
