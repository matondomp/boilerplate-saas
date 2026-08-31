import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import { CourseNotFoundError, ExamAlreadyExistsError } from '../../domain/errors/index.js'
import { CourseEntity } from '../../domain/entities/index.js'
import { ContentSource } from '../../domain/value_objects/index.js'
import { CreateExamUseCaseImpl } from './create_exam_usecase_impl.js'

test.group('CreateExamUseCase', () => {
  const existingCourse = CourseEntity.hydrate(new UniqueEntityID('course-1'), {
    universityId: new UniqueEntityID('uni-1'),
    name: 'Engenharia Informática',
  })

  test('should return left when course not found', async ({ assert }) => {
    const findCourseStub = { findById: sinon.fake.resolves(null) }
    const findExamStub = { findByCourseYearPeriod: sinon.fake.resolves(null) }
    const createExamStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateExamUseCaseImpl(
      findCourseStub as any,
      findExamStub as any,
      createExamStub as any
    )

    const output = await sut.perform({
      courseId: 'invalid-course',
      year: 2024,
      period: 'Fase Regular',
      sourceType: ContentSource.OFFICIAL_EXAM,
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, CourseNotFoundError)
  })

  test('should return left when exam already exists for the course/year/period', async ({ assert }) => {
    const findCourseStub = { findById: sinon.fake.resolves(existingCourse) }
    const findExamStub = { findByCourseYearPeriod: sinon.fake.resolves({ id: 'exam-1' }) }
    const createExamStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateExamUseCaseImpl(
      findCourseStub as any,
      findExamStub as any,
      createExamStub as any
    )

    const output = await sut.perform({
      courseId: 'course-1',
      year: 2024,
      period: 'Fase Regular',
      sourceType: ContentSource.OFFICIAL_EXAM,
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, ExamAlreadyExistsError)
  })

  test('should create exam successfully on valid input', async ({ assert }) => {
    const findCourseStub = { findById: sinon.fake.resolves(existingCourse) }
    const findExamStub = { findByCourseYearPeriod: sinon.fake.resolves(null) }
    const createExamStub = { create: sinon.fake.resolves(undefined) }

    const sut = new CreateExamUseCaseImpl(
      findCourseStub as any,
      findExamStub as any,
      createExamStub as any
    )

    const output = await sut.perform({
      courseId: 'course-1',
      year: 2024,
      period: 'Fase Regular',
      sourceType: ContentSource.OFFICIAL_EXAM,
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createExamStub.create.calledOnce)
  })
})
