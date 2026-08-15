import { CoreMenuModel } from '#shared/framework/infra/index'
import { HttpContext } from '@adonisjs/core/http'

type MenuProps = {
  display: string
  icon?: string
  isGroup: boolean
  children?: MenuProps[]
}

export const sharedUserMenu = async ({
  auth,
  session,
  i18n,
}: HttpContext): Promise<MenuProps[]> => {
  if (auth.isAuthenticated && auth.user) {
    await auth.user.load('role', (builder) => {
      builder.preload('permissions')
    })

    const permissions = auth.user.role.permissions

    if (!permissions) {
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage('menu.error.cannot_load_menu'),
      })

      return []
    }

    const menu = await CoreMenuModel.loadMenuBasedInUserPermissions(
      permissions.map((p: any) => p.id)
    )

    return menu
  }

  return []
}
