import { StudentProfileEntity } from '../../../../domain/entities/index.js'
import {
  FindStudentProfileByStudentIdRepository,
  SaveStudentProfileRepository,
} from '../../../../usecases/manage_student_profile/ports/index.js'
import { StudentProfileModel } from '../models/index.js'
import { StudentProfileMapper } from '../mappers/index.js'

export class StudentProfileRepositoriesImpl
  implements FindStudentProfileByStudentIdRepository, SaveStudentProfileRepository
{
  constructor(private readonly profileMapper = new StudentProfileMapper()) {}

  async findByStudentId(studentId: string): Promise<StudentProfileEntity | null> {
    const model = await StudentProfileModel.query().where('student_id', studentId).first()
    if (!model) return null
    return this.profileMapper.toDomain(model)
  }

  async save(profile: StudentProfileEntity): Promise<void> {
    const model = await this.profileMapper.toPersistence(profile)
    await model.save()
  }
}
