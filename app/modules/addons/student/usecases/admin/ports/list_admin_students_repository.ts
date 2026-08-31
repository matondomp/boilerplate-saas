export interface ListAdminStudentsFilter {
  search?: string
  fullName?: string
  phone?: string
  status?: string
  page?: number
  perPage?: number
}

export interface AdminStudentSummary {
  id: string
  userId: string
  fullName: string
  phone: string | null
  status: string
  goalsCount: number
  primaryGoal: {
    id: string
    courseName: string
    universityName: string
    targetYear: number
  } | null
  createdAt: Date
}

export interface PaginatedAdminStudentsResult {
  data: AdminStudentSummary[]
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
