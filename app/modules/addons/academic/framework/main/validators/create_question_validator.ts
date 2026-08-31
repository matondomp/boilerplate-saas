import vine from '@vinejs/vine'

const schema = vine.object({
  examId: vine.string().uuid().optional(),
  subjectId: vine.string().uuid(),
  topicId: vine.string().uuid(),
  type: vine.string().optional(),
  statement: vine.string().trim().minLength(5),
  difficulty: vine.string().optional(),
  solution: vine.string().trim().optional(),
  explanation: vine.string().trim().optional(),
  source: vine.string().optional(),
  sourceMetadata: vine.record(vine.any()).optional(),
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
})

export const CreateQuestionValidation = vine.compile(schema)
