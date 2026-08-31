import vine from '@vinejs/vine'

const schema = vine.object({
  universityId: vine.string().uuid(),
  courseId: vine.string().uuid(),
  targetExamPeriod: vine.string().trim().optional(),
})

export const CreatePreparationGoalValidation = vine.compile(schema)
