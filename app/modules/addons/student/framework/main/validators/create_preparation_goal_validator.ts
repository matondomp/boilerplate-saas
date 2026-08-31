import vine from '@vinejs/vine'

export const CreatePreparationGoalValidation = vine.compile(
  vine.object({
    universityId: vine.string().trim(),
    courseId: vine.string().trim(),
    targetYear: vine.number().min(2024).max(2035),
    targetExamId: vine.string().trim().optional().nullable(),
    targetExamPeriod: vine.string().trim().optional().nullable(),
    isPrimary: vine.boolean().optional(),
  })
)
