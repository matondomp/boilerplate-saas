import { test } from '@japa/runner'
import sinon from 'sinon'
import { ListAdminStudentsUseCaseImpl } from './list_admin_students_usecase_impl.js'

test.group('ListAdminStudentsUseCase', () => {
  test('should return paginated list of students', async ({ assert }) => {
    const fakeResult = {
      data: [
        {
          id: 'student-1',
          userId: 'user-1',
          fullName: 'João Manuel',
          phone: '+244923111222',
          status: 'ACTIVE',
          goalsCount: 2,
          primaryGoal: { universityName: 'UAN', courseName: 'Engenharia Informática', targetYear: 2027 },
          createdAt: '2026-01-15T10:00:00.000Z',
        },
      ],
      meta: { total: 1, page: 1, perPage: 15, lastPage: 1 },
    }

    const sut = new ListAdminStudentsUseCaseImpl({
      listAdminStudents: sinon.fake.resolves(fakeResult),
    })

    const result = await sut.perform({ page: 1, search: 'João' })
    assert.isTrue(result.isRight())
    if (result.isRight()) {
      assert.lengthOf(result.value.data, 1)
      assert.equal(result.value.data[0].fullName, 'João Manuel')
    }
  })
})
