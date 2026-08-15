import { BaseModel, beforeSave, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import { DashboardModel } from './dashboard_model.js'
import { slugifyAdapter } from '#app/db/adapters/slugify_adapter_impl'
// import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export class DashboardItemModel extends BaseModel {
  static table = 'core_dashboard_items'

  @column()
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
    columnName: 'sql_raw',
    serializeAs: 'sqlRaw',
  })
  declare sqlRaw: string

  @column({
    columnName: 'chart_type',
    serializeAs: 'chartType',
  })
  declare chartType: string

  @manyToMany(() => DashboardModel, {
    pivotTable: 'core_dashboards_dashboard_items',
    pivotRelatedForeignKey: 'dashboard_slug',
    pivotForeignKey: 'item_id',
    localKey: 'id',
    relatedKey: 'slug',
    pivotColumns: ['width', 'height', 'x', 'y'],
  })
  declare dashboards: ManyToMany<typeof DashboardModel>

  @beforeSave()
  static async setId(dashboardItem: DashboardItemModel) {
    dashboardItem.id = dashboardItem.id || randomUUID()
  }

  @beforeSave()
  static async setSlug(dashboardItem: DashboardItemModel) {
    if (!dashboardItem.slug) {
      dashboardItem.slug = await slugifyAdapter(dashboardItem.name, {
        fieldName: 'slug',
        tableName: DashboardItemModel.table,
      })
    }
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
