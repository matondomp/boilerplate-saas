import { Pagination } from '#core/ports/index'

export interface User {
  slug: string
  fullName: string
  updatedAt: string
  firstName: string
  lastName: string
  email: string
  updatedAtText: string
  lastLoginAt: string
  lastLoginAtText: string
  status: string
  roleId: string
  roleText: string
}

export type ListUsersUseCaseOutput = Pagination<User>
