export interface StudentSignupInput {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface StudentSignupOutput {
  user: {
    id: string
    email: string
    fullName: string
    role: string
  }
  token: {
    type: string
    value: string
  }
}

export interface FindUserByEmailRepository {
  findByEmail(email: string): Promise<any | null>
}

export interface CreateStudentAccountRepository {
  createStudentAccount(input: StudentSignupInput): Promise<StudentSignupOutput>
}
