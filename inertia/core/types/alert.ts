export type Alert<T = string> = {
  successWithModal?: boolean
  success: boolean
  message: T
}
