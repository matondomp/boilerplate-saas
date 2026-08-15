import { Server } from 'socket.io'
import type { ApplicationService } from '@adonisjs/core/types'

import { WsService } from '#app/services/ws_service'
import { ApplicationSocketEventsRegistry } from '#start/socket_loader'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'app.socket': Server
  }
}

export default class AppSocketProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('app.socket', () => {
      const ws = WsService.create()
      ws.boot()

      return ws.io
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const io = await this.app.container.make('app.socket')

    io.on('connection', (socket) => {
      socket.on('connected', (user) => {
        socket.join(user.username)
      })

      const socketEventsRegistry = ApplicationSocketEventsRegistry.getInstance(io.sockets)
      void socketEventsRegistry.registerGlobalEvents()
    })
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    const io = await this.app.container.make('app.socket')

    await io.close()
  }
}
