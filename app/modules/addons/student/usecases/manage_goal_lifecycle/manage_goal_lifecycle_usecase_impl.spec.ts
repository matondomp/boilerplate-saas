import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { PausePreparationGoalUseCaseImpl } from './pause_preparation_goal_usecase_impl.js'
import { ResumePreparationGoalUseCaseImpl } from './resume_preparation_goal_usecase_impl.js'
import { StudentEntity, PreparationGoalEntity } from '../../domain/entities/index.js'
import { PreparationGoalStatus } from '../../domain/value_objects/index.js'

test.group('ManageGoalLifecycleUseCase', () => {
  test('should pause and resume goal successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), { userId: new UniqueEntityID('user-1') })
    const goal = PreparationGoalEntity.hydrate(new UniqueEntityID('goal-1'), {
      studentId: new UniqueEntityID('student-1'),
      universityId: new UniqueEntityID('uni-1'),
      courseId: new UniqueEntityID('course-1'),
      targetYear: 2027,
      status: PreparationGoalStatus.ACTIVE,
    })

    const findStudentStub = sinon.fake.resolves(student)
    const findGoalStub = sinon.fake.resolves(goal)
    const updateGoalStub = sinon.fake.resolves(undefined)

    const pauseSut = new PausePreparationGoalUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { findById: findGoalStub } as any,
      { update: updateGoalStub } as any
    )

    const pauseResult = await pauseSut.perform({ userId: 'user-1', goalId: 'goal-1' })
    assert.isTrue(pauseResult.isRight())
    assert.equal(goal.status, PreparationGoalStatus.PAUSED)

    const resumeSut = new ResumePreparationGoalUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { findById: findGoalStub } as any,
      { update: updateGoalStub } as any
    )

    const resumeResult = await resumeSut.perform({ userId: 'user-1', goalId: 'goal-1' })
    assert.isTrue(resumeResult.isRight())
    assert.equal(goal.status, PreparationGoalStatus.ACTIVE)
  })
})
