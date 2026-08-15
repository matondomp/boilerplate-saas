import type { DomainError } from './errors.js'

export class Result<T> {
  isSuccess: boolean
  isFailure: boolean
  error: T | string
  private readonly _value: T

  constructor(isSuccess: boolean, error?: T | string | null, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error')
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message')
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error as T
    this._value = value as any

    Object.freeze(this)
  }

  /**
   * If success returns an instance of provided class.
   */
  getResult(): T {
    if (!this.isSuccess) {
      throw new Error('Can not get the value of an error result. Use errorValue instead.')
    }

    return this._value
  }

  errorValue(): T {
    return this.error as T
  }

  get errorMessage(): string {
    return (this.error as unknown as DomainError).message
  }

  get errorPayload(): JSON | undefined {
    return (this.error as unknown as DomainError).payload
  }

  get errorName(): string {
    return (this.error as any).error
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value)
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error)
  }

  static combine(results: Array<Result<any>>): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result
      }
    }
    return Result.ok()
  }
}
