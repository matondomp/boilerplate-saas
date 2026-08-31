import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
    vine.object({
        name: vine.string(),
        gender: vine.string()
    })
)
createCustomerValidator.messagesProvider = new SimpleMessagesProvider({
    'name.required': 'customer.form.name.required',
    'gender.required': 'customer.form.gender.required'
})