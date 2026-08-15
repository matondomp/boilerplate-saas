import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface ModifiedAppSettingProps {
  lastId: UniqueEntityID
  currentId: UniqueEntityID
}

export class AppSettingModifiedEvent extends DomainEvent<ModifiedAppSettingProps> {}
