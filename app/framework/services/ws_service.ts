import { Server } from 'socket.io'
import env from '#start/env'
import server from '@adonisjs/core/services/server'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'

export class WsService {
  io!: Server
  private booted = false
  private static instance: WsService

  private constructor() {}

  boot(): void {
    if (this.booted) {
      return
    }

    this.booted = true

    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: env.get('APP_INTERNAL_URL'),
        credentials: true,
      },
    })

    const pubClient = createClient({
      url: `redis://${env.get('REDIS_HOST')}:${env.get('REDIS_PORT')}`,
      password: env.get('REDIS_PASSWORD'),
    })
    const subClient = pubClient.duplicate()

    pubClient.on('error', (err: string) => console.error('Redis Pub Client Error:', err))
    subClient.on('error', (err: string) => console.error('Redis Sub Client Error:', err))

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this.io.adapter(createAdapter(pubClient, subClient))
    })
  }

  static create() {
    if (!this.instance) {
      this.instance = new WsService()
    }

    return this.instance
  }
}
