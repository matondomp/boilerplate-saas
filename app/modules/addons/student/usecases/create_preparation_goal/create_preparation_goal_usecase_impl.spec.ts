import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { CreatePreparationGoalUseCaseImpl } from './create_preparation_goal_usecase_impl.js'
import { StudentEntity } from '../../domain/entities/index.js'
import { CourseDoesNotBelongToUniversityError } from '../../domain/errors/index.js'

test.group('CreatePreparationGoalUseCase', () => {
  test('should create preparation goal successfully', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), {
      userId: new UniqueEntityID('user-1'),
    })

    const findStudentStub = sinon.fake.resolves(student)
    const createStudentStub = sinon.fake.resolves(undefined)
    const findUniStub = sinon.fake.resolves({ id: 'uni-1', isActive: true })
    const findCourseStub = sinon.fake.resolves({ id: 'course-1', universityId: 'uni-1', isActive: true })
    const findGoalStub = sinon.fake.resolves(null)
    const createGoalStub = sinon.fake.resolves(undefined)
    const eventDispatcherStub = { publish: sinon.fake.resolves(undefined) }

    const sut = new CreatePreparationGoalUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { create: createStudentStub } as any,
      { findUniversityById: findUniStub } as any,
      { findCourseById: findCourseStub } as any,
      { findByStudentCourseAndYear: findGoalStub } as any,
      { create: createGoalStub } as any,
      eventDispatcherStub as any
    )

    const result = await sut.perform({
      userId: 'user-1',
      universityId: 'uni-1',
      courseId: 'course-1',
      targetYear: 2027,
    })

    assert.isTrue(result.isRight())
    assert.isString(result.value.id)
    assert.isTrue(createGoalStub.calledOnce)
  })

  test('should return left when course does not belong to university', async ({ assert }) => {
    const student = StudentEntity.hydrate(new UniqueEntityID('student-1'), {
      userId: new UniqueEntityID('user-1'),
    })

    const findStudentStub = sinon.fake.resolves(student)
    const createStudentStub = sinon.fake.resolves(undefined)
    const findUniStub = sinon.fake.resolves({ id: 'uni-1', isActive: true })
    const findCourseStub = sinon.fake.resolves({ id: 'course-1', universityId: 'other-uni', isActive: true })
    const findGoalStub = sinon.fake.resolves(null)
    const createGoalStub = sinon.fake.resolves(undefined)
    const eventDispatcherStub = { publish: sinon.fake.resolves(undefined) }

    const sut = new CreatePreparationGoalUseCaseImpl(
      { findByUserId: findStudentStub } as any,
      { create: createStudentStub } as any,
      { findUniversityById: findUniStub } as any,
      { findCourseById: findCourseStub } as any,
      { findByStudentCourseAndYear: findGoalStub } as any,
      { create: createGoalStub } as any,
      eventDispatcherStub as any
    )

    const result = await sut.perform({
      userId: 'user-1',
      universityId: 'uni-1',
      courseId: 'course-1',
      targetYear: 2027,
    })

    assert.isTrue(result.isLeft())
    assert.instanceOf(result.value, CourseDoesNotBelongToUniversityError)
  })
})
