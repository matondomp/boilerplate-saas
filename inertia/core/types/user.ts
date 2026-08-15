export type UserStatus = 'ACTIVE' | 'INACTIVE'

export type UserProp = {
  avatar: string
  username: string
  fullName: string
  bio: string
  slug: string
  status: UserStatus
  firstName: string
  lastName: string
  lastLoginDateAt: string
  email: string
  defaultLang: string
  roleId: string
  role: RoleProp
  timezone: string
}

export type RoleProp = {
  name: string
  id: string
  description: string
  slug: string
  isRoot: boolean
  internal: boolean
  updatedAtText: string
  updatedAt: string
  permissions?: string[]
}
