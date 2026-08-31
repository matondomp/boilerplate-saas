import vine from '@vinejs/vine'

const schema = vine.object({
  subjectId: vine.string().uuid(),
  parentId: vine.string().uuid().optional(),
  name: vine.string().trim().minLength(2),
  position: vine.number().optional(),
})

export const CreateTopicValidation = vine.compile(schema)
