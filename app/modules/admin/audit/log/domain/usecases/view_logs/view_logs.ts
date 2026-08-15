import { Paginate, Pagination } from '#core/ports/index'
import { UseCase } from '#core/domain/index'
import { LogInterface } from '#modules/admin/audit/log/domain/interfaces/index'

export namespace ViewLogsUseCase {
  export interface Input extends Paginate {
    title?: string
    user?: string
    source?: string
    date?: Date
    success?: boolean
  }

  export interface Output extends Omit<LogInterface, 'userId' | 'createdAt'> {
    hash: string
    createdAt: string
  }

  export type Contract = UseCase<Input, Pagination<Output>>
}
