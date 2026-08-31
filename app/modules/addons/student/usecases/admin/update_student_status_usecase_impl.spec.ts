import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { UpdateStudentStatusUseCaseImpl } from './update_student_status_usecase_impl.js'
import { StudentEntity } from '../../domain/entities/index.js'

test.group('UpdateStudentStatusUseCase', () => {
  test('should suspend student successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), { userId: new UniqueEntityID('user-1') })
    const updateStub = sinon.fake.resolves(undefined)

    const sut = new UpdateStudentStatusUseCaseImpl(
      { findById: sinon.fake.resolves(student) },
      { update: updateStub }
    )

    const result = await sut.perform({ studentId: 'student-1', status: 'SUSPENDED' })
    assert.isTrue(result.isRight())
    assert.isTrue(student.isSuspended)
  })
})
