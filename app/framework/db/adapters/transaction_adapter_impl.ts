import { TransactionAdapter } from '#core/ports/transaction_adapter'

import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import Database from '@adonisjs/lucid/services/db'

export class TransactionAdapterImpl implements TransactionAdapter {
  async useTransaction<T = any>(callback: Function): Promise<T> {
    if (app.inTest) {
      return callback(db)
    }

    const trx = await Database.transaction()

    try {
      const output = await callback(trx)

      await trx.commit()
      return output
    } catch (e) {
      await trx.rollback()

      throw e
    }
  }
}
