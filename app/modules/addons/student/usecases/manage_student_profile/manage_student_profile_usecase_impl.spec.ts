import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { GetStudentProfileUseCaseImpl } from './get_student_profile_usecase_impl.js'
import { StudentEntity, StudentProfileEntity } from '../../domain/entities/index.js'

test.group('ManageStudentProfileUseCase', () => {
  test('should get or create student profile successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), { userId: new UniqueEntityID('user-1') })
    const profile = StudentProfileEntity.hydrate(new UniqueEntityID('prof-1'), {
      studentId: new UniqueEntityID('student-1'),
      fullName: 'Matondo Pedro',
    })

    const sut = new GetStudentProfileUseCaseImpl(
      { findByUserId: sinon.fake.resolves(student) } as any,
      { findByStudentId: sinon.fake.resolves(profile) } as any,
      { save: sinon.fake.resolves(undefined) } as any
    )

    const result = await sut.perform({ userId: 'user-1' })
    assert.isTrue(result.isRight())
    if (result.isRight()) {
      assert.equal(result.value.fullName, 'Matondo Pedro')
    }
  })
})
