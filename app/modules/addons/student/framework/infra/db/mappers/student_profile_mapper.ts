import { Mapper, UniqueEntityID } from '#core/domain/index'
import { StudentProfileEntity } from '../../../../domain/entities/index.js'
import { StudentProfileModel } from '../models/index.js'

export class StudentProfileMapper implements Mapper<StudentProfileEntity, StudentProfileModel> {
  toDomain(model: StudentProfileModel): StudentProfileEntity {
    return StudentProfileEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        studentId: new UniqueEntityID(model.studentId),
        fullName: model.fullName,
        phone: model.phone,
        avatarUrl: model.avatarUrl,
        preferredLanguage: model.preferredLanguage,
        birthYear: model.birthYear,
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: StudentProfileEntity): Promise<StudentProfileModel> {
    let model = await StudentProfileModel.findBy('student_id', entity.studentId.toString())

    if (!model) {
      model = await StudentProfileModel.find(entity.id.toString())
    }

    if (!model) {
      model = new StudentProfileModel()
      model.id = entity.id.toString()
    }

    model.studentId = entity.studentId.toString()
    model.fullName = entity.fullName
    model.phone = entity.phone || null
    model.avatarUrl = entity.avatarUrl || null
    model.preferredLanguage = entity.preferredLanguage
    model.birthYear = entity.birthYear || null

    return model
  }
}
