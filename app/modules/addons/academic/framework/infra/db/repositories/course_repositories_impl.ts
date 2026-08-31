import { CourseEntity } from '../../../../domain/entities/index.js'
import {
  CreateCourseRepository,
  FindCourseByNameAndUniversityRepository,
  FindUniversityByIdRepository,
} from '../../../../usecases/create_course/ports/index.js'
import { AcademicCourseModel, AcademicUniversityModel } from '../models/index.js'
import { CourseMapper, UniversityMapper } from '../mappers/index.js'

export class CourseRepositoriesImpl
  implements
    FindCourseByNameAndUniversityRepository,
    FindUniversityByIdRepository,
    CreateCourseRepository
{
  constructor(
    private readonly courseMapper: CourseMapper = new CourseMapper(),
    private readonly universityMapper: UniversityMapper = new UniversityMapper()
  ) {}

  async findById(id: string): Promise<any> {
    const uni = await AcademicUniversityModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (uni) return this.universityMapper.toDomain(uni)

    const course = await AcademicCourseModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (course) return this.courseMapper.toDomain(course)

    return null
  }

  async findByNameAndUniversity(name: string, universityId: string): Promise<CourseEntity | null> {
    const model = await AcademicCourseModel.query()
      .where('name', name)
      .andWhere('university_id', universityId)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.courseMapper.toDomain(model)
  }

  async create(course: CourseEntity): Promise<void> {
    const model = await this.courseMapper.toPersistence(course)
    await model.save()
  }
}
