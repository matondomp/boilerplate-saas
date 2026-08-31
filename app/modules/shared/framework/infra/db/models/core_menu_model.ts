import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, beforeSave, column } from '@adonisjs/lucid/orm'
import { slugifyAdapter } from '#app/db/adapters/slugify_adapter_impl'

export interface Menu {
  slug: string
  display: string
  url: string
  icon?: string
  isGroup: boolean
  children?: Menu[]
}

export class CoreMenuModel extends BaseModel {
  static table = 'core_menus'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'name' })
  declare display: string

  @column({ columnName: 'slug' })
  declare slug: string

  @column()
  declare url: string

  @column()
  declare icon?: string

  @column()
  declare order: number

  @column()
  declare groupName?: string

  @column()
  declare isGroup?: boolean

  @column()
  declare belongsTo: string | null

  @column({ columnName: 'permission_id' })
  declare permissionId?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async setId(menu: CoreMenuModel) {
    menu.id = menu.id || randomUUID()
  }

  @beforeSave()
  static async setSlug(menu: CoreMenuModel) {
    if (!menu.slug) {
      menu.slug = await slugifyAdapter(menu.display, {
        fieldName: 'slug',
        tableName: CoreMenuModel.table,
      })
    }
  }

  @beforeFetch()
  static applyOrderBy(query: any) {
    query.orderBy('order', 'asc')
  }

  static loadMenuBasedInUserPermissions(permissions: string[]) {
    return CoreMenuModel.query()
      .where((query) => {
        query.whereNull('permission_id').orWhereIn('permission_id', permissions)
      })
      .andWhereNull('deleted_at')
      .orderBy('order', 'asc')
      .then((menus) => {
        const principalMenus = menus.filter((menu) => !menu.belongsTo)

        return principalMenus
          .map((menu) => {
            return this.constructMenuMapped({
              slug: menu.slug,
              display: menu.display,
              icon: menu.icon,
              url: menu.url,
              isGroup: menu.isGroup ?? false,
              children: this.createSubMenuStructure(menus, menu.slug),
            })
          })
          .filter((menu) => menu.children)
      })
  }

  private static constructMenuMapped(menu: any): Menu {
    return {
      slug: menu.slug,
      display: menu.display,
      url: menu.url,
      icon: menu.icon,
      isGroup: menu.isGroup,
      children: menu.children,
    }
  }

  private static createSubMenuStructure(originalMenuArray: any, belongsTo?: string) {
    const onlyBelongsToArray = originalMenuArray.filter((menu: any) => menu.belongsTo === belongsTo)

    if (!onlyBelongsToArray.length) {
      return
    }

    const three: Menu[] = []

    for (let subMenu of onlyBelongsToArray) {
      three.push(
        this.constructMenuMapped({
          slug: subMenu.slug,
          display: subMenu.display,
          url: subMenu.url,
          icon: subMenu.icon,
          isGroup: subMenu.isGroup,
          children: this.createSubMenuStructure(originalMenuArray, subMenu.slug),
        })
      )
    }

    return three
  }
}
