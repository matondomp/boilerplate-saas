import { StatusEnum } from '#shared/domain/types/index'
import { CoreRoleModel, CoreUserModel } from '#shared/framework/infra/db/models/index'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertRootUser extends BaseSeeder {
  async run() {
    const role = await CoreRoleModel.findBy('slug', 'root')

    if (!role) {
      throw new Error('Role "root" not found!')
    }

    await CoreUserModel.firstOrCreate(
      { email: env.get('ROOT_USER_EMAIL', 'root@mp.co.ao') },
      {
        firstName: 'Root',
        lastName: 'User',
        password: env.get('ROOT_USER_PASSWORD', '12345678'),
        statusId: StatusEnum.ACTIVE,
        roleId: role.id,
      }
    )
  }
}
