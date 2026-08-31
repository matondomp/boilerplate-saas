import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { GetPreparationGoalUseCaseImpl } from './get_preparation_goal_usecase_impl.js'
import { StudentEntity, PreparationGoalEntity } from '../../domain/entities/index.js'
import { PreparationGoalNotFoundError } from '../../domain/errors/index.js'

test.group('GetPreparationGoalUseCase', () => {
  test('should get goal successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), { userId: new UniqueEntityID('user-1') })
    const goal = PreparationGoalEntity.hydrate(new UniqueEntityID('goal-1'), {
      studentId: new UniqueEntityID('student-1'),
      universityId: new UniqueEntityID('uni-1'),
      courseId: new UniqueEntityID('course-1'),
      targetYear: 2027,
    })

    const sut = new GetPreparationGoalUseCaseImpl(
      { findByUserId: sinon.fake.resolves(student) } as any,
      { findById: sinon.fake.resolves(goal) } as any
    )

    const result = await sut.perform({ userId: 'user-1', goalId: 'goal-1' })
    assert.isTrue(result.isRight())
  })

  test('should return left when user does not own goal (IDOR protection)', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), { userId: new UniqueEntityID('user-1') })
    const otherGoal = PreparationGoalEntity.hydrate(new UniqueEntityID('goal-2'), {
      studentId: new UniqueEntityID('student-other'),
      universityId: new UniqueEntityID('uni-1'),
      courseId: new UniqueEntityID('course-1'),
      targetYear: 2027,
    })

    const sut = new GetPreparationGoalUseCaseImpl(
      { findByUserId: sinon.fake.resolves(student) } as any,
      { findById: sinon.fake.resolves(otherGoal) } as any
    )

    const result = await sut.perform({ userId: 'user-1', goalId: 'goal-2' })
    assert.isTrue(result.isLeft())
    assert.instanceOf(result.value, PreparationGoalNotFoundError)
  })
})
