import { Paginate, Search } from '#core/ports/index'

export interface ListUsersUseCaseInput extends Search, Paginate {}
