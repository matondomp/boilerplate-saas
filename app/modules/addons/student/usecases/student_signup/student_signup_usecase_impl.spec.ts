import { test } from '@japa/runner'
import sinon from 'sinon'
import { StudentSignupUseCaseImpl } from './student_signup_usecase_impl.js'

test.group('StudentSignupUseCase', () => {
  test('should register student successfully', async ({ assert }) => {
    const fakeOutput = {
      user: { id: 'user-1', email: 'aluno@exemplo.com', fullName: 'Estudante Teste', role: 'student' },
      token: { type: 'bearer', value: 'secret-token-123' },
    }

    const sut = new StudentSignupUseCaseImpl(
      { findByEmail: sinon.fake.resolves(null) },
      { createStudentAccount: sinon.fake.resolves(fakeOutput) }
    )

    const result = await sut.perform({
      email: 'aluno@exemplo.com',
      password: 'Password123!',
      fullName: 'Estudante Teste',
    })

    assert.isTrue(result.isRight())
    if (result.isRight()) {
      assert.equal(result.value.user.email, 'aluno@exemplo.com')
      assert.equal(result.value.token.value, 'secret-token-123')
    }
  })

  test('should fail when email already exists', async ({ assert }) => {
    const sut = new StudentSignupUseCaseImpl(
      { findByEmail: sinon.fake.resolves({ id: 'existing-id' }) },
      { createStudentAccount: sinon.fake.resolves(null as any) }
    )

    const result = await sut.perform({
      email: 'existente@exemplo.com',
      password: 'Password123!',
      fullName: 'Estudante Repetido',
    })

    assert.isTrue(result.isLeft())
  })
})
