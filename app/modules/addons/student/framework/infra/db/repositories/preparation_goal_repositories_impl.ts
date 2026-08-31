import { PreparationGoalEntity } from '../../../../domain/entities/index.js'
import {
  CreatePreparationGoalRepository,
  FindStudentGoalByCourseAndYearRepository,
} from '../../../../usecases/create_preparation_goal/ports/index.js'
import {
  FindPreparationGoalByIdRepository,
  SetPrimaryGoalRepository,
} from '../../../../usecases/set_primary_preparation_goal/ports/index.js'
import { ListStudentGoalsRepository } from '../../../../usecases/list_student_goals/ports/index.js'
import { UpdatePreparationGoalRepository } from '../../../../usecases/manage_goal_lifecycle/ports/index.js'
import { StudentPreparationGoalModel } from '../models/index.js'
import { PreparationGoalMapper } from '../mappers/index.js'
import db from '@adonisjs/lucid/services/db'

export class PreparationGoalRepositoriesImpl
  implements
    CreatePreparationGoalRepository,
    FindStudentGoalByCourseAndYearRepository,
    FindPreparationGoalByIdRepository,
    SetPrimaryGoalRepository,
    ListStudentGoalsRepository,
    UpdatePreparationGoalRepository
{
  constructor(private readonly goalMapper = new PreparationGoalMapper()) {}

  async findByStudentCourseAndYear(
    studentId: string,
    courseId: string,
    targetYear: number
  ): Promise<PreparationGoalEntity | null> {
    const model = await StudentPreparationGoalModel.query()
      .where('studentId', studentId)
      .where('courseId', courseId)
      .where('targetYear', targetYear)
      .where('status', 'ACTIVE')
      .first()

    if (!model) return null
    return this.goalMapper.toDomain(model)
  }

  async findById(goalId: string): Promise<PreparationGoalEntity | null> {
    const model = await StudentPreparationGoalModel.find(goalId)
    if (!model) return null
    return this.goalMapper.toDomain(model)
  }

  async listByStudentId(studentId: string): Promise<PreparationGoalEntity[]> {
    const models = await StudentPreparationGoalModel.query()
      .where('studentId', studentId)
      .preload('university')
      .preload('course')
      .orderBy('isPrimary', 'desc')

    return models.map((m) => this.goalMapper.toDomain(m))
  }

  async create(goal: PreparationGoalEntity): Promise<void> {
    const model = await this.goalMapper.toPersistence(goal)
    await model.save()
  }

  async update(goal: PreparationGoalEntity): Promise<void> {
    const model = await this.goalMapper.toPersistence(goal)
    await model.save()
  }

  async setPrimary(studentId: string, primaryGoalId: string): Promise<void> {
    await db.transaction(async (trx) => {
      await StudentPreparationGoalModel.query({ client: trx })
        .where('studentId', studentId)
        .update({ isPrimary: false })

      await StudentPreparationGoalModel.query({ client: trx })
        .where('id', primaryGoalId)
        .where('studentId', studentId)
        .update({ isPrimary: true })
    })
  }
}
