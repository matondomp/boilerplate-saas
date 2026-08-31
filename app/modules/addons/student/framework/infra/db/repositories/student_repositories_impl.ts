import { StudentEntity } from '../../../../domain/entities/index.js'
import { FindStudentByUserIdRepository, CreateStudentRepository } from '../../../../usecases/create_preparation_goal/ports/index.js'
import {
  ListAdminStudentsRepository,
  ListAdminStudentsFilter,
  PaginatedAdminStudentsResult,
  FindStudentByIdRepository,
  UpdateStudentRepository,
} from '../../../../usecases/admin/ports/index.js'
import { StudentModel } from '../models/index.js'
import { StudentMapper } from '../mappers/index.js'

export class StudentRepositoriesImpl
  implements
    FindStudentByUserIdRepository,
    CreateStudentRepository,
    ListAdminStudentsRepository,
    FindStudentByIdRepository,
    UpdateStudentRepository
{
  constructor(private readonly studentMapper = new StudentMapper()) {}

  async findByUserId(userId: string): Promise<StudentEntity | null> {
    const model = await StudentModel.query().where('user_id', userId).preload('profile').first()
    if (!model) return null
    return this.studentMapper.toDomain(model)
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const model = await StudentModel.query().where('id', id).preload('profile').first()
    if (!model) return null
    return this.studentMapper.toDomain(model)
  }

  async create(student: StudentEntity): Promise<void> {
    const model = await this.studentMapper.toPersistence(student)
    await model.save()
  }

  async update(student: StudentEntity): Promise<void> {
    const model = await this.studentMapper.toPersistence(student)
    await model.save()
  }

  async listAdminStudents(filter: ListAdminStudentsFilter): Promise<PaginatedAdminStudentsResult> {
    const page = filter.page || 1
    const perPage = filter.perPage || 15

    const query = StudentModel.query()
      .preload('profile')

    if (filter.status) {
      query.where('status', filter.status)
    }

    if (filter.fullName) {
      const nameSearch = `%${filter.fullName}%`
      query.whereHas('profile', (pq) => {
        pq.whereILike('fullName', nameSearch)
      })
    }

    if (filter.phone) {
      const phoneSearch = `%${filter.phone}%`
      query.whereHas('profile', (pq) => {
        pq.whereILike('phone', phoneSearch)
      })
    }

    if (filter.search) {
      const search = `%${filter.search}%`
      query.where((q) => {
        q.whereHas('profile', (pq) => {
          pq.whereILike('fullName', search).orWhereILike('phone', search)
        }).orWhere('user_id', 'like', search)
      })
    }

    const paginated = await query.orderBy('createdAt', 'desc').paginate(page, perPage)
    const JSONData = paginated.toJSON()

    const data = JSONData.data.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      fullName: m.profile?.fullName || 'Estudante Sem Nome',
      phone: m.profile?.phone || null,
      status: m.status,
      goalsCount: 0,
      primaryGoal: null,
      createdAt: m.createdAt,
    }))

    return {
      data,
      meta: {
        total: JSONData.meta.total,
        page: JSONData.meta.currentPage,
        perPage: JSONData.meta.perPage,
        lastPage: JSONData.meta.lastPage,
      },
    }
  }
}
