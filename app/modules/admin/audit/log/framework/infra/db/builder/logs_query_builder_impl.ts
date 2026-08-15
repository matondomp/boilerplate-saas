import {
  LogsFilters,
  LogsQueryBuilder,
} from '#modules/admin/audit/log//usecases/view_logs/ports/logs_query_builder'
import { DateTime } from 'luxon'

export class LogsQueryBuilderImpl implements LogsQueryBuilder {
  build(input: LogsFilters) {
    const query: LogsFilters = {}

    if (input.title) {
      query.title = input.title
    }

    if (input.source) {
      query.source = input.source
    }

    if (input.username) {
      query.username = input.username
    }

    if (input.hasOwnProperty('success')) {
      query.success = input.success
    }

    if (input.createdAt) {
      let actualDay = DateTime.fromISO(input.createdAt.toString())
      const nextDay = actualDay.plus({ day: 1 })

      query.createdAt = {
        $gte: new Date(actualDay.toISODate()!),
        $lt: new Date(nextDay.toISODate()!),
      }
    }

    return {
      query,
    }
  }
}
