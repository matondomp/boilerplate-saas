import { IDomainEvent, IHandler } from '#core/domain/index'
import { HttpContext } from '@adonisjs/core/http'

export abstract class Handler implements IHandler<IDomainEvent<any>> {
  abstract handle(event: IDomainEvent<any>): void

  ctx(): HttpContext | null {
    return HttpContext.get()
  }
}
