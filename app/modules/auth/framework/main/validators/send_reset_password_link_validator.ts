import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().email(),
})

const sendResetPasswordLinkValidator = vine.compile(schema)

sendResetPasswordLinkValidator.messagesProvider = new SimpleMessagesProvider({
  'username.required': 'auth.validation.username.required',
  'username.email': 'auth.validation.username.email',
})

export { sendResetPasswordLinkValidator }
