import { DateAdapter } from '#shared/domain/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import * as luxon from 'luxon'

export class DateAdapterImpl implements DateAdapter {
  toRelative(date?: Date): string {
    if (!date) {
      return ''
    }

    const ctx = HttpContext.get()

    if (!ctx) return ''

    const timezone = ctx.auth.user?.timezone

    const luxonDate = DateTime.fromJSDate(date, {
      zone: timezone ?? 'UTC',
    })

    return date && ctx.i18n.formatRelativeTime(luxonDate, 'auto')
  }

  format(date?: Date): string {
    if (!date) {
      return ''
    }

    const ctx = HttpContext.get()

    if (!ctx) return ''

    const timezone = ctx.auth.user?.timezone

    const luxonDate = DateTime.fromJSDate(date, {
      zone: timezone ?? 'UTC',
    })

    return (
      date &&
      ctx.i18n.formatDate(luxonDate, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour: '2-digit',
        hourCycle: 'h24',
      })
    )
  }

  toDatePersistence(date?: Date): DateTime | undefined {
    if (!date) {
      return
    }

    const ctx = HttpContext.get()

    if (!ctx) return

    const timezone = ctx.auth.user?.timezone

    return luxon.DateTime.fromJSDate(date, {
      zone: timezone ?? 'UTC',
    })
  }
}
