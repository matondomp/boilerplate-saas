import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { ListStudentGoalsUseCaseImpl } from './list_student_goals_usecase_impl.js'
import { StudentEntity, PreparationGoalEntity } from '../../domain/entities/index.js'

test.group('ListStudentGoalsUseCase', () => {
  test('should list student goals successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), {
      userId: new UniqueEntityID('user-1'),
    })
    const goal = PreparationGoalEntity.hydrate(new UniqueEntityID('goal-1'), {
      studentId: new UniqueEntityID('student-1'),
      universityId: new UniqueEntityID('uni-1'),
      courseId: new UniqueEntityID('course-1'),
      targetYear: 2027,
    })

    const findStudentStub = sinon.fake.resolves(student)
    const listGoalsStub = sinon.fake.resolves([goal])

    const sut = new ListStudentGoalsUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { listByStudentId: listGoalsStub } as any
    )

    const result = await sut.perform({ userId: 'user-1' })

    assert.isTrue(result.isRight())
    if (result.isRight()) {
      assert.lengthOf(result.value, 1)
    }
  })
})
