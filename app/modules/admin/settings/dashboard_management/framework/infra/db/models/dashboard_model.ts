import { randomUUID } from 'node:crypto'

import { DashboardItemModel } from './dashboard_item_model.js'
// import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { DateTime } from 'luxon'
import type { StatusType } from '#shared/domain/types/index'
import { CoreStatusModel } from '#shared/framework/infra/index'
import { BaseModel, beforeSave, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { slugifyAdapter } from '#app/db/adapters/slugify_adapter_impl'

export class DashboardModel extends BaseModel {
  static table = 'core_dashboards'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  /*@slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })*/
  declare slug: string

  @column({
    columnName: 'is_default',
    serializeAs: 'isDefault',
  })
  declare isDefault: boolean

  @column({ columnName: 'status_id' })
  declare statusId: StatusType

  @hasOne(() => CoreStatusModel)
  declare status: HasOne<typeof CoreStatusModel>

  @column({
    columnName: 'is_deleted',
    serializeAs: 'isDeleted',
  })
  declare isDeleted: boolean

  @column()
  declare description: string

  @manyToMany(() => DashboardItemModel, {
    pivotTable: 'core_dashboards_dashboard_items',
    pivotRelatedForeignKey: 'item_id',
    pivotForeignKey: 'dashboard_slug',
    localKey: 'slug',
    relatedKey: 'id',
  })
  declare items: ManyToMany<typeof DashboardItemModel>

  @beforeSave()
  static async setId(dashboard: DashboardModel) {
    dashboard.id = dashboard.id || randomUUID()
  }

  @beforeSave()
  static async setSlug(dashboard: DashboardModel) {
    if (!dashboard.slug) {
      dashboard.slug = await slugifyAdapter(dashboard.name, {
        fieldName: 'slug',
        tableName: DashboardModel.table,
      })
    }
  }

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
