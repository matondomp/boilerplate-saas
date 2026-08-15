import { QueryBuilder } from '#shared/framework/infra/builder/ports/query_builder'

export interface LogsFilters {
  title?: string
  source?: string
  username?: string
  success?: boolean
  createdAt?: { $gte: Date; $lt: Date }
}

export interface LogsFiltersMountedQuery {
  query: LogsFilters
}

export interface LogsQueryBuilder extends QueryBuilder<LogsFilters> {
  build(input: LogsFilters): LogsFiltersMountedQuery
}
