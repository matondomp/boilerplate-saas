import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { SetPrimaryPreparationGoalUseCaseImpl } from './set_primary_preparation_goal_usecase_impl.js'
import { StudentEntity, PreparationGoalEntity } from '../../domain/entities/index.js'

test.group('SetPrimaryPreparationGoalUseCase', () => {
  test('should set primary goal successfully', async ({ assert }) => {
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
    const findGoalStub = sinon.fake.resolves(goal)
    const setPrimaryStub = sinon.fake.resolves(undefined)
    const eventDispatcherStub = { publish: sinon.fake.resolves(undefined) }

    const sut = new SetPrimaryPreparationGoalUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { findById: findGoalStub } as any,
      { setPrimary: setPrimaryStub } as any,
      eventDispatcherStub as any
    )

    const result = await sut.perform({
      userId: 'user-1',
      goalId: 'goal-1',
    })

    assert.isTrue(result.isRight())
    assert.isTrue(result.value)
    assert.isTrue(setPrimaryStub.calledOnce)
  })
})
