import { DomainEvent } from '#core/domain/index'
import { LogInterface } from '#shared/domain/interfaces/log_interface'

interface DomainActionExecutedProps extends LogInterface {}

export class DomainActionExecutedEvent extends DomainEvent<DomainActionExecutedProps> {}
