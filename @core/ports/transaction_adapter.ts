import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export interface TransactionAdapter {
  useTransaction: <T>(callback: (trx: TransactionClientContract) => Promise<any>) => Promise<T>
}
