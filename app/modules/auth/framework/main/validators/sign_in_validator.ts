import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().email(),
  password: vine.string().minLength(8).trim(),
  rememberMe: vine.boolean().optional(),
})

const signInValidator = vine.compile(schema)

signInValidator.messagesProvider = new SimpleMessagesProvider({
  'username.required': 'auth.validation.username.required',
  'username.email': 'auth.validation.username.email',
  'password.required': 'auth.validation.password.required',
  'password.minLength': 'auth.validation.password.minLength',
})

export { signInValidator }
