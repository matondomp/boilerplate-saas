import vine from '@vinejs/vine'

export const SetPrimaryPreparationGoalValidation = vine.compile(
  vine.object({
    goalId: vine.string().trim(),
  })
)
