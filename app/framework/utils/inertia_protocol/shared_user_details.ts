import { DateAdapterImpl } from '#shared/framework/infra/index'
import { StatusEnum } from '#shared/domain/types/status_type'

import { HttpContext } from '@adonisjs/core/http'

type AuthenticatedUserDetails = {
  timezone: string
  slug: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  avatar?: string
  defaultLang: 'pt' | 'en'
  lastLoginText?: string
  lastLoginAt?: Date
  status: StatusEnum
  role: {
    isRoot: boolean
    name: string
    slug: string
    internal: boolean
    description: string
  }
  permissions: string[]
}

export const sharedUserDetails = async (
  ctx: HttpContext
): Promise<AuthenticatedUserDetails | undefined> => {
  if (ctx.auth.isAuthenticated && ctx.auth.user) {
    await ctx.auth.user.load('role', (builder) => {
      builder.preload('permissions')
    })

    const user = ctx.auth.user

    return {
      slug: user.slug,
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      defaultLang: user.defaultLang as any,
      timezone: user.timezone,
      lastLoginText: new DateAdapterImpl().format(user.lastLoginAt?.toJSDate()),
      lastLoginAt: user.lastLoginAt?.toJSDate(),
      status: user.statusId,
      role: {
        isRoot: user.role.isRoot,
        name: user.role.name,
        slug: user.role.slug,
        internal: user.role.isSystem ?? false,
        description: user.role.description,
      },
      permissions: user.role.permissions?.map((p) => p.id) || [],
    }
  }
  return
}
