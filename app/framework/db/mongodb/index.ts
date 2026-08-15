import { ClientSession, Db, MongoClient } from 'mongodb'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export class MongoDb {
  private client: MongoClient
  private isConnected = false

  private static instance: MongoDb

  constructor(private readonly url: string) {
    this.client = new MongoClient(this.url)
  }

  reload(url: string) {
    this.client = new MongoClient(url)
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return
    }

    await this.client.connect()
    logger.info('Mongodb Connected!')
    this.isConnected = true
  }

  query(dbName: string): Db {
    return this.client.db(dbName)
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    logger.info('Mongodb Disconnected!')
    await this.client.close()
  }

  async startSession(): Promise<ClientSession> {
    return this.client.startSession()
  }

  static getInstance(url: string): MongoDb {
    if (!MongoDb.instance) {
      MongoDb.instance = new MongoDb(url)
    }

    return MongoDb.instance
  }
}

export const mongodb = MongoDb.getInstance(env.get('MONGODB_URL'))
