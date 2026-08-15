export type SendResetPasswordLinkForm = {
  username: string
}

export type ResetPasswordForm = {
  password: string
  confirmPassword: string
  token: string
}

export type TokenProps = {
  token: string
}
