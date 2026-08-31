import { SubjectEntity, TopicEntity } from '../../../../domain/entities/index.js'
import {
  CreateSubjectRepository,
  FindSubjectByNameRepository,
} from '../../../../usecases/create_subject/ports/index.js'
import {
  CreateTopicRepository,
  FindSubjectByIdRepository,
  FindTopicByIdRepository,
} from '../../../../usecases/create_topic/ports/index.js'
import { AcademicSubjectModel, AcademicTopicModel } from '../models/index.js'
import { SubjectMapper, TopicMapper } from '../mappers/index.js'

export class SubjectTopicRepositoriesImpl
  implements
    FindSubjectByNameRepository,
    FindSubjectByIdRepository,
    CreateSubjectRepository,
    FindTopicByIdRepository,
    CreateTopicRepository
{
  constructor(
    private readonly subjectMapper: SubjectMapper = new SubjectMapper(),
    private readonly topicMapper: TopicMapper = new TopicMapper()
  ) {}

  async findByName(name: string): Promise<SubjectEntity | null> {
    const model = await AcademicSubjectModel.query()
      .where('name', name)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.subjectMapper.toDomain(model)
  }

  async findById(id: string): Promise<SubjectEntity | TopicEntity | null> {
    const subjectModel = await AcademicSubjectModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (subjectModel) {
      return this.subjectMapper.toDomain(subjectModel)
    }

    const topicModel = await AcademicTopicModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (topicModel) {
      return this.topicMapper.toDomain(topicModel)
    }

    return null
  }

  async create(entity: SubjectEntity | TopicEntity): Promise<void> {
    if (entity instanceof SubjectEntity) {
      const model = await this.subjectMapper.toPersistence(entity)
      await model.save()
    } else {
      const model = await this.topicMapper.toPersistence(entity)
      await model.save()
    }
  }

  async findTopicById(id: string): Promise<TopicEntity | null> {
    const model = await AcademicTopicModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.topicMapper.toDomain(model)
  }
}
