import CoreUserModel from '#shared/framework/infra/db/models/core_user_model'
import { CoreRoleModel } from '#shared/framework/infra/db/models/core_role_model'
import { StatusEnum } from '#shared/domain/types/status_type'
import { UniqueEntityID } from '#core/domain/index'

import {
  FindUserByEmailRepository,
  CreateStudentAccountRepository,
  StudentSignupInput,
  StudentSignupOutput,
} from '../../../../usecases/student_signup/ports/index.js'
import { StudentModel, StudentProfileModel } from '../models/index.js'

export class StudentSignupRepositoryImpl implements FindUserByEmailRepository, CreateStudentAccountRepository {
  async findByEmail(email: string): Promise<any | null> {
    return await CoreUserModel.findBy('email', email)
  }

  async createStudentAccount(input: StudentSignupInput): Promise<StudentSignupOutput> {
    const userId = new UniqueEntityID().toString()

    let studentRole = await CoreRoleModel.findBy('slug', 'student')
    if (!studentRole) {
      studentRole = await CoreRoleModel.create({
        name: 'Estudante',
        description: 'Perfil de estudante da plataforma de preparação',
        slug: 'student',
      })
    }

    const userModel = await CoreUserModel.create({
      id: userId,
      email: input.email,
      password: input.password,
      firstName: input.fullName.split(' ')[0] || input.fullName,
      lastName: input.fullName.split(' ').slice(1).join(' ') || '',
      statusId: StatusEnum.ACTIVE,
      roleId: studentRole.id,
    })

    const studentModel = await StudentModel.create({
      userId: userModel.id,
      status: 'ACTIVE',
    })

    await StudentProfileModel.create({
      studentId: studentModel.id,
      fullName: input.fullName,
      phone: input.phone || null,
      preferredLanguage: 'pt',
    })

    const accessToken = await CoreUserModel.accessTokens.create(userModel)

    return {
      user: {
        id: userModel.id,
        email: userModel.email,
        fullName: input.fullName,
        role: 'student',
      },
      token: {
        type: 'bearer',
        value: accessToken.value!.release(),
      },
    }
  }
}
