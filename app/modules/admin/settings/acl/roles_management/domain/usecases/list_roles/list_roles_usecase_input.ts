import { Paginate, Search } from '#core/ports/index'

export interface ListRolesUseCaseInput extends Search, Paginate {
  isRoot: boolean
}
