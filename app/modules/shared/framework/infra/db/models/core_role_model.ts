import { randomUUID } from 'node:crypto'
// import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

import { DateTime } from 'luxon'
import { CoreUserModel } from './core_user_model.js'
import { CorePermissionModel } from './core_permission_model.js'
import { softDelete } from '../adapters/soft_delete_adapter.js'
import { BaseModel, beforeSave, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { slugifyAdapter } from '#app/db/adapters/slugify_adapter_impl'

export class CoreRoleModel extends BaseModel {
  static table = 'core_roles'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  // @slugify({
  //   strategy: 'dbIncrement',
  //   fields: ['name'],
  // })
  declare slug: string

  @column()
  declare description: string

  @column({ columnName: 'system' })
  declare isSystem?: boolean

  @column({ columnName: 'created_by_user' })
  declare createdByUser?: string

  @hasMany(() => CoreUserModel, {
    foreignKey: 'roleId',
  })
  declare users: HasMany<typeof CoreUserModel>

  @manyToMany(() => CorePermissionModel, {
    pivotTable: 'core_role_permissions',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  declare permissions: ManyToMany<typeof CorePermissionModel>

  @column.dateTime()
  declare deletedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(role: CoreRoleModel) {
    role.id = role.id || randomUUID()
  }

  @beforeSave()
  static async setSlug(role: CoreRoleModel) {
    if (!role.slug) {
      role.slug = await slugifyAdapter(role.name, {
        fieldName: 'slug',
        tableName: CoreRoleModel.table,
      })
    }
  }

  @computed()
  get isRoot(): boolean {
    return this.slug === 'root'
  }

  async softDelete() {
    await softDelete(this)
  }
}
