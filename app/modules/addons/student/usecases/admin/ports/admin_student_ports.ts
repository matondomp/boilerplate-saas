import { StudentEntity } from '../../../domain/entities/index.js'

export interface ListAdminStudentsFilter {
  search?: string
  status?: string
  page?: number
  perPage?: number
}

export interface AdminStudentItemDTO {
  id: string
  userId: string
  fullName: string
  phone: string | null
  status: string
  goalsCount: number
  primaryGoal: {
    universityName: string
    courseName: string
    targetYear: number
  } | null
  createdAt: string
}

export interface PaginatedAdminStudentsResult {
  data: AdminStudentItemDTO[]
  meta: {
    total: number
    page: number
    perPage: number
    lastPage: number
  }
}

export interface ListAdminStudentsRepository {
  listAdminStudents(filter: ListAdminStudentsFilter): Promise<PaginatedAdminStudentsResult>
}

export interface FindStudentByIdRepository {
  findById(id: string): Promise<StudentEntity | null>
}

export interface UpdateStudentRepository {
  update(student: StudentEntity): Promise<void>
}
