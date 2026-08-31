import vine from '@vinejs/vine'

const schema = vine.object({
  name: vine.string().trim().minLength(2),
  description: vine.string().trim().optional(),
})

export const CreateSubjectValidation = vine.compile(schema)
