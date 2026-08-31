import vine from '@vinejs/vine'

const schema = vine.object({
  courseId: vine.string().uuid(),
  year: vine.number().min(1990).max(2100),
  period: vine.string().trim().minLength(2),
  sourceType: vine.string().optional(),
  sourceMetadata: vine.record(vine.any()).optional(),
  documentUrl: vine.string().optional(),
})

export const CreateExamValidation = vine.compile(schema)
