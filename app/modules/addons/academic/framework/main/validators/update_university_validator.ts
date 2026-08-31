import vine from '@vinejs/vine'

const schema = vine.object({
  name: vine.string().trim().minLength(2),
  acronym: vine.string().trim().minLength(2).maxLength(50),
  status: vine.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export const UpdateUniversityValidation = vine.compile(schema)
