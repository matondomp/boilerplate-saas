import { Mapper, UniqueEntityID } from '#core/domain/index'
import { StudentEntity } from '../../../../domain/entities/index.js'
import { StudentStatus } from '../../../../domain/value_objects/index.js'
import { StudentModel } from '../models/index.js'
import { StudentProfileMapper } from './student_profile_mapper.js'

export class StudentMapper implements Mapper<StudentEntity, StudentModel> {
  constructor(private readonly profileMapper = new StudentProfileMapper()) {}

  toDomain(model: StudentModel): StudentEntity {
    return StudentEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        userId: new UniqueEntityID(model.userId),
        status: model.status as StudentStatus,
        profile: model.profile ? this.profileMapper.toDomain(model.profile) : null,
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate() || null,
      }
    )
  }

  async toPersistence(entity: StudentEntity): Promise<StudentModel> {
    let model = await StudentModel.find(entity.id.toString())

    if (!model) {
      model = new StudentModel()
      model.id = entity.id.toString()
    }

    model.userId = entity.userId.toString()
    model.status = entity.status

    return model
  }
}
