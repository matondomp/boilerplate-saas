import vine from '@vinejs/vine'

const schema = vine.object({
  statement: vine.string().trim().minLength(5).optional(),
  difficulty: vine.string().optional(),
  solution: vine.string().trim().optional(),
  explanation: vine.string().trim().optional(),
  topicId: vine.string().uuid().optional(),
  options: vine
    .array(
      vine.object({
        label: vine.string().trim(),
        content: vine.string().trim(),
        position: vine.number(),
        isCorrect: vine.boolean(),
      })
    )
    .optional(),
  version: vine.number().min(1),
  reason: vine.string().trim().minLength(3),
})

export const UpdateQuestionValidation = vine.compile(schema)
