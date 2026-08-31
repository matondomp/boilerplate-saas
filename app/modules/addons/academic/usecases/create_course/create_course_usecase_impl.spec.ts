import { test } from '@japa/runner'
import sinon from 'sinon'
import { UniqueEntityID } from '#core/domain/index'
import {
  CourseAlreadyExistsError,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../domain/errors/index.js'
import { UniversityEntity } from '../../domain/entities/index.js'
import { UniversityStatus } from '../../domain/value_objects/index.js'
import { CreateCourseUseCaseImpl } from './create_course_usecase_impl.js'

test.group('CreateCourseUseCase', () => {
  const activeUni = UniversityEntity.hydrate(new UniqueEntityID('uni-1'), {
    name: 'Universidade Agostinho Neto',
    acronym: 'UAN',
    status: UniversityStatus.ACTIVE,
  })

  test('should return left when university does not exist', async ({ assert }) => {
    const findUniStub = { findById: sinon.fake.resolves(null) }
    const findCourseStub = { findByNameAndUniversity: sinon.fake.resolves(null) }
    const createCourseStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateCourseUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      createCourseStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      universityId: 'invalid-uni',
      name: 'Engenharia Informática',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityNotFoundError)
  })

  test('should return left when university is inactive', async ({ assert }) => {
    const inactiveUni = UniversityEntity.hydrate(new UniqueEntityID('uni-2'), {
      name: 'Universidade Inativa',
      acronym: 'UI',
      status: UniversityStatus.INACTIVE,
    })
    const findUniStub = { findById: sinon.fake.resolves(inactiveUni) }
    const findCourseStub = { findByNameAndUniversity: sinon.fake.resolves(null) }
    const createCourseStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateCourseUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      createCourseStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      universityId: 'uni-2',
      name: 'Engenharia Informática',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UniversityInactiveError)
  })

  test('should return left when course already exists in the same university', async ({ assert }) => {
    const findUniStub = { findById: sinon.fake.resolves(activeUni) }
    const findCourseStub = { findByNameAndUniversity: sinon.fake.resolves({ id: 'course-1' }) }
    const createCourseStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateCourseUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      createCourseStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      universityId: 'uni-1',
      name: 'Engenharia Informática',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, CourseAlreadyExistsError)
  })

  test('should create course successfully and return right with id', async ({ assert }) => {
    const findUniStub = { findById: sinon.fake.resolves(activeUni) }
    const findCourseStub = { findByNameAndUniversity: sinon.fake.resolves(null) }
    const createCourseStub = { create: sinon.fake.resolves(undefined) }
    const eventDispatcherStub = { publish: sinon.fake() }

    const sut = new CreateCourseUseCaseImpl(
      findUniStub as any,
      findCourseStub as any,
      createCourseStub as any,
      eventDispatcherStub as any
    )

    const output = await sut.perform({
      universityId: 'uni-1',
      name: 'Engenharia Informática',
    })

    assert.isTrue(output.isRight())
    assert.isDefined(output.value.id)
    assert.isTrue(createCourseStub.create.calledOnce)
    assert.isTrue(eventDispatcherStub.publish.calledOnce)
  })
})
