import { UniqueEntityID } from './unique_entity_id.js'

export interface Options {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export abstract class Entity<T> {
  protected _id: UniqueEntityID
  protected readonly _createdAt: Date
  protected readonly _updatedAt?: Date
  protected _deletedAt?: Date
  protected readonly props: T

  protected constructor(props: T, id?: UniqueEntityID, options?: Options) {
    this._id = id ?? new UniqueEntityID()
    this.props = props

    this._createdAt = options?.createdAt || new Date()
    this._updatedAt = options?.updatedAt
    this._deletedAt = options?.deletedAt
  }

  get id(): UniqueEntityID {
    return this._id
  }

  restore(): void {
    this._deletedAt = undefined
  }

  delete(): void {
    this._deletedAt = new Date()
  }

  get isDeleted(): boolean {
    return !!this._deletedAt
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  protected changeId(id: UniqueEntityID): void {
    this._id = id
  }
}
