import '@sentry/tracing'

import { HttpContext } from '@adonisjs/core/http'

import { startTransaction, captureException, runWithAsyncContext } from '@sentry/node'

import { Controller } from '#core/ports/controller'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'

export interface ControllerMetaData {
  operation: string
  description: string
}

export class CaptureErrorDecorator implements Controller<HttpContext> {
  constructor(
    private readonly controller: Controller<HttpContext>,
    private readonly meta: ControllerMetaData
  ) {}

  async perform(input: HttpContext): Promise<any> {
    const transaction = startTransaction({
      op: this.meta.operation,
      name: this.meta.description,
      data: {
        queryParams: input.params,
      },
      startTimestamp: DateTime.now().toMillis(),
    })

    return runWithAsyncContext(async () => {
      return this.controller
        .perform(input)
        .catch((e) => {
          const isApi = /^\/api\//.test(input.route?.pattern || '')

          if (['E_VALIDATION_ERROR'].includes(e.code)) {
            if (!e.messages.errors) {
              if (isApi) {
                return input.response.badRequest({
                  message: e.messages.map((er: any) => er.message),
                })
              }

              input.session.flash('alert', {
                success: false,
                message: e.messages.map((er: any) => er.message),
              })
            } else {
              if (isApi) {
                return input.response.badRequest({
                  message: e.messages.map((er: any) => er.message),
                })
              }

              if (isApi) {
                return input.response.internalServerError({
                  message: input.i18n.formatMessage('shared.errors.internal_server_error'),
                })
              }

              input.session.flash('alert', {
                success: false,
                message: e.messages.errors.map((x: any) => x.message),
              })
            }

            return input.response.redirect().back()
          }

          if (app.inDev) {
            logger.error(e)
          }

          if (app.inProduction) {
            captureException(e)
          }

          if (isApi) {
            return input.response.internalServerError({
              message: input.i18n.formatMessage('shared.errors.internal_server_error'),
            })
          }

          input.session.flash('alertGlobal', {
            success: false,
            message: input.i18n.formatMessage('shared.errors.internal_server_error'),
          })

          return input.response.redirect().back()
        })
        .finally(() => {
          input.response.header('x-operation-name', this.meta.operation)
          transaction.endTimestamp = DateTime.now().toMillis()
          transaction.finish()
        })
    })
  }
}
