import vine from '@vinejs/vine'

const schema = vine.object({
  status: vine.string().trim(),
  reason: vine.string().trim().optional(),
})

export const ChangeQuestionStatusValidation = vine.compile(schema)
