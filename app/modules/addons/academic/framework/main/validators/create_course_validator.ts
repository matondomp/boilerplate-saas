import vine from '@vinejs/vine'

const schema = vine.object({
  universityId: vine.string().uuid(),
  academicUnitId: vine.string().uuid().optional(),
  name: vine.string().trim().minLength(2),
})

export const CreateCourseValidation = vine.compile(schema)
