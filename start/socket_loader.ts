/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { resolve } from 'node:path'
import { loadContext as context } from './utils/load_context.js'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'

export interface Broadcast {
  message: string
  type: 'success' | 'info' | 'error' | 'warning'
  icon?: string
  title: string
  eventName: string
}

export interface BroadcastOnly extends Broadcast {
  users: string[]
}

export class ApplicationSocketEventsRegistry {
  private static instance: ApplicationSocketEventsRegistry
  private eventsRegistered: boolean = false

  private constructor(private readonly sockets: any) {}

  registerGlobalEvents(): void {
    if (this.eventsRegistered) {
      return
    }

    logger.info('Application Socket Events Registered!')
    ;['app/modules'].forEach(async (path) => {
      const req = context(resolve(app.appRoot.pathname, path), true, /main\/socket\.(ts|js)$/)
      for (const filename of req.keys()) {
        const m = await import(filename)
        void m(this.sockets)
      }
    })

    emitter.on(
      'alert:realtime:broadcast:all',
      ({ type, message, title, icon, eventName }: Broadcast) => {
        this.sockets.emit('alert', {
          title,
          message,
          type,
          icon,
          eventName,
        })
      }
    )

    emitter.on(
      'alert:realtime:broadcast:only',
      ({ users, message, type, title, icon, eventName }: BroadcastOnly) => {
        users.forEach((username) => {
          this.sockets.to(username).emit('alert', {
            message,
            title,
            type,
            icon,
            eventName,
          })
        })
      }
    )

    this.eventsRegistered = true
  }

  static getInstance(sockets: any): ApplicationSocketEventsRegistry {
    if (!this.instance) {
      this.instance = new ApplicationSocketEventsRegistry(sockets)
    }

    return this.instance
  }
}

declare module '@adonisjs/core/types' {
  interface EventsList {
    'alert:realtime:broadcast:only': BroadcastOnly
    'alert:realtime:broadcast:all': Broadcast
  }
}
