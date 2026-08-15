import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

import { CorePermissionModel } from './core_permission_model.js'
import { CoreRoleModel } from './core_role_model.js'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export class CoreRolePermissionModel extends BaseModel {
  static table = 'core_role_permissions'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'permission_id' })
  declare permissionId: string

  @column({ columnName: 'role_id' })
  declare roleId: string

  @hasOne(() => CorePermissionModel)
  declare permissions: HasOne<typeof CorePermissionModel>

  @hasOne(() => CoreRoleModel)
  declare roles: HasOne<typeof CoreRoleModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async setId(rolePermission: CoreRolePermissionModel) {
    rolePermission.id = rolePermission.id || randomUUID()
  }
}
