import { Pagination } from '#core/ports/pagination'

export interface RetrieveWithPaginationContract<I, T> {
  findAll(data: I): Promise<Pagination<T>>
}
