import { Pagination } from '#core/ports/index'

export interface Role {
  slug: string
  name: string
  isInternal: boolean
  updatedAt: string

  description: string
  updatedAtText: string
}

export type ListRolesUseCaseOutput = Pagination<Role>
