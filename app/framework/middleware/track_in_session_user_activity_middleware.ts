import Application from '@adonisjs/core/services/app'
import { BroadcastMessageRepositoryImpl } from '#shared/framework/infra/index'
import { ActivityProps } from '#shared/framework/infra/inbox_processor/index'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { UniqueEntityID } from '#core/domain/index'
import { HttpContext } from '@adonisjs/core/http'
import { BroadcastMessageContract } from '#shared/domain/ports/index'
import { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'
import { hrtime } from 'process'

export default class TrackInSessionUserActivityMiddleware {
  constructor(
    private readonly broadcastMessage: BroadcastMessageContract = new BroadcastMessageRepositoryImpl()
  ) {}

  async handle({ session, auth, request, response }: HttpContext, next: NextFn): Promise<any> {
    if (!session.has('x-track-id')) {
      logger.info('New session Id attached')
      session.put('x-track-id', `${new UniqueEntityID().toString()}_${new Date().getTime()}`)
    }

    const startTime = hrtime()

    await next()

    const endTime = hrtime(startTime)

    if (!Application.inTest) {
      logger.info(
        `(${
          auth.user?.fullName ?? 'GUEST'
        }) ${request.method()} ${endTime[0] * 1000} ms ${request.ip()} ${request.url()} ${response.getStatus()}`
      )
    }

    if (request.method() === 'GET' && request.url().includes('api')) {
      return
    }

    let success = true

    if (response.getStatus() === 500) {
      success = false
    }

    const alert = session.flashMessages.get('alert')
    const alertGlobal = session.flashMessages.get('alertGlobal')

    if (alert) {
      success = alert.success
    }

    if (alertGlobal) {
      success = alertGlobal.success
    }

    const operationName = response.getHeader('x-operation-name')

    if (!operationName) {
      return
    }

    const operationViaImpersonation = session.get('@impersonate:userId')

    await this.broadcastMessage.publish<ActivityProps>('core.shared', {
      type: CoreBroadcastEnum.TRACK_ACTIVITY,
      message: {
        operation: `operation.${operationName}`,
        ip: request.ip(),
        sessionId: session.get('x-track-id'),
        success,
        payload: {
          impersonated: operationViaImpersonation?.uid ? auth.user!.slug : null,
          ...request.params(),
          ...request.body(),
        },
        createdAt: new Date(),
        method: request.method(),
      },
      meta: {
        userId: (operationViaImpersonation?.uid || auth.user?.id) ?? null,
      },
    })
  }
}
