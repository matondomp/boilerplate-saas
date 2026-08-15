import { TransactionAdapter } from '#core/ports/transaction_adapter'

export const makeTransactionAdapterStub = (): TransactionAdapter => {
  return new (class implements TransactionAdapter {
    async useTransaction<T>(_callback: Function): Promise<T> {
      return Promise.resolve({} as T)
    }
  })()
}
