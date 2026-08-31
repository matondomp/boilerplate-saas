import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { StudentSignupUseCaseImpl } from '../../../usecases/student_signup/student_signup_usecase_impl.js'

export class StudentSignupController implements Controller<HttpContext> {
  constructor(private readonly signupUseCase: StudentSignupUseCaseImpl) {}

  async perform(ctx: HttpContext): Promise<any> {
    const { request, response } = ctx
    const email = request.input('email')
    const password = request.input('password')
    const fullName = request.input('fullName')
    const phone = request.input('phone')

    if (!email || !password || !fullName) {
      return response.badRequest({ message: 'Os campos email, password e fullName são obrigatórios' })
    }

    const output = await this.signupUseCase.perform({
      email,
      password,
      fullName,
      phone,
    })

    if (output.isLeft()) {
      const err = output.value as any
      return response.badRequest({ message: err?.message || 'Email já registado ou dados inválidos' })
    }

    return response.created(output.value)
  }
}
