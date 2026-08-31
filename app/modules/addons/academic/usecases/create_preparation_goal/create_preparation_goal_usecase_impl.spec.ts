import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import {
  CourseInactiveError,
  CourseNotFoundError,
  PreparationGoalAlreadyExistsError,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../domain/errors/index.js'
import { CourseEntity, PreparationGoalEntity, UniversityEntity } from '../../domain/entities/index.js'
import { CourseStatus, PreparationGoalStatus, UniversityStatus } from '../../domain/value_objects/index.js'
import { CreatePreparationGoalUseCaseImpl } from './create_preparation_goal_usecase_impl.js'

test.group('CreatePreparationGoalUseCase', () => {
  const activeUni = UniversityEntity.hydrate(new UniqueEntityID('uni-1'), {
    name: 'Universidade Agostinho Neto',
    acronym: 'UAN',
    status: UniversityStatus.ACTIVE,
  })

  const activeCourse = CourseEntity.hydrate(new UniqueEntityID('course-1'), {
    universityId: new UniqueEntityID('uni-1'),
    name: 'Ciência da Computação',
    status: CourseStatus.ACTIVE,
  })

  test('should return left when university is not found', async ({ assert }) => {
    const findUniStub = { findById: sinon.fake.resolves(null) }
    const findCourseStub = { findById: sinon.fake.resolves(activeCourse) }
    const findGoalStub = { findByStudentAndCourse: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreatePreparationGoalUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      findGoalStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      studentId: 'student-1',
      universityId: 'invalid-uni',
      courseId: 'course-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityNotFoundError)
  })

  test('should return left when university is inactive', async ({ assert }) => {
    const inactiveUni = UniversityEntity.hydrate(new UniqueEntityID('uni-inact'), {
      name: 'Universidade Inativa',
      acronym: 'UI',
      status: UniversityStatus.INACTIVE,
    })
    const findUniStub = { findById: sinon.fake.resolves(inactiveUni) }
    const findCourseStub = { findById: sinon.fake.resolves(activeCourse) }
    const findGoalStub = { findByStudentAndCourse: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreatePreparationGoalUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      findGoalStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      studentId: 'student-1',
      universityId: 'uni-inact',
      courseId: 'course-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityInactiveError)
  })

  test('should return left when course is inactive', async ({ assert }) => {
    const inactiveCourse = CourseEntity.hydrate(new UniqueEntityID('course-inact'), {
      universityId: new UniqueEntityID('uni-1'),
      name: 'Curso Inativo',
      status: CourseStatus.INACTIVE,
    })
    const findUniStub = { findById: sinon.fake.resolves(activeUni) }
    const findCourseStub = { findById: sinon.fake.resolves(inactiveCourse) }
    const findGoalStub = { findByStudentAndCourse: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreatePreparationGoalUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      findGoalStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      studentId: 'student-1',
      universityId: 'uni-1',
      courseId: 'course-inact',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, CourseInactiveError)
  })

  test('should return left when student already has active goal for this course', async ({ assert }) => {
    const existingGoal = PreparationGoalEntity.hydrate(new UniqueEntityID('goal-1'), {
      studentId: new UniqueEntityID('student-1'),
      universityId: new UniqueEntityID('uni-1'),
      courseId: new UniqueEntityID('course-1'),
      status: PreparationGoalStatus.ACTIVE,
    })

    const findUniStub = { findById: sinon.fake.resolves(activeUni) }
    const findCourseStub = { findById: sinon.fake.resolves(activeCourse) }
    const findGoalStub = { findByStudentAndCourse: sinon.fake.resolves(existingGoal) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreatePreparationGoalUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      findGoalStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      studentId: 'student-1',
      universityId: 'uni-1',
      courseId: 'course-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, PreparationGoalAlreadyExistsError)
  })

  test('should create preparation goal successfully for student', async ({ assert }) => {
    const findUniStub = { findById: sinon.fake.resolves(activeUni) }
    const findCourseStub = { findById: sinon.fake.resolves(activeCourse) }
    const findGoalStub = { findByStudentAndCourse: sinon.fake.resolves(null) }
    const createRepoStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreatePreparationGoalUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      findGoalStub as any,
      createRepoStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      studentId: 'student-1',
      universityId: 'uni-1',
      courseId: 'course-1',
      targetExamPeriod: '2026',
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createRepoStub.create.calledOnce)
    assert.isTrue(eventDispatcherStub.publish.calledOnce)
  })
})
