export interface Paginate {
  withPagination: boolean
  page: number
  perPage: number
}

export interface Data<T> {
  data: T[]
}

interface PaginationWithoutWithPagination extends Omit<Paginate, 'withPagination'> {
  total: number
  sort?: string
  direction?: 'desc' | 'asc'
}

export interface Pagination<T> extends Data<T> {
  pagination: PaginationWithoutWithPagination
}
