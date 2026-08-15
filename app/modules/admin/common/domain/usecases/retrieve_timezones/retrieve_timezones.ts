import { UseCaseWithoutInput } from '#core/domain/use_case'

export namespace RetrieveTimezones {
  export type Output = string[]

  export type Contract = UseCaseWithoutInput<Output>
}
