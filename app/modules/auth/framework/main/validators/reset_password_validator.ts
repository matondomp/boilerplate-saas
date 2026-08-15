import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const schema = vine.object({
  token: vine.string(),
  password: vine.string().minLength(8).trim().confirmed({
    confirmationField: 'confirmPassword',
  }),
})

const resetPasswordValidator = vine.compile(schema)

resetPasswordValidator.messagesProvider = new SimpleMessagesProvider({
  'token.required': 'auth.validation.token.required',
  'password.required': 'auth.validation.password.required',
  'password.minLength': 'auth.validation.password.minLength',
  'confirmPassword.equalTo': 'auth.validation.password.confirmed',
})

export { resetPasswordValidator }
