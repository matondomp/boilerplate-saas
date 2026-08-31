import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { randomUUID } from 'node:crypto'
import { CoreUserModel } from '#shared/framework/infra/db/models/core_user_model'
import {
  AcademicUniversityModel,
  AcademicUnitModel,
  AcademicCourseModel,
  AcademicSubjectModel,
  AcademicCourseSubjectModel,
  AcademicTopicModel,
  AcademicExamModel,
  AcademicQuestionModel,
  AcademicQuestionOptionModel,
  AcademicQuestionRevisionModel,
  AcademicQuestionRelationModel,
} from '../models/index.js'

export default class extends BaseSeeder {
  async run() {
    // 0. Obter Usuário Root para Auditoria
    const rootUser = await CoreUserModel.first()
    const authorId = rootUser ? rootUser.id : randomUUID()

    // 1. Universidades
    const uan = await AcademicUniversityModel.firstOrCreate(
      { name: 'Universidade Agostinho Neto' },
      {
        id: randomUUID(),
        name: 'Universidade Agostinho Neto',
        acronym: 'UAN',
        status: 'ACTIVE',
      }
    )

    const umn = await AcademicUniversityModel.firstOrCreate(
      { name: 'Universidade Mandume ya Ndemufayo' },
      {
        id: randomUUID(),
        name: 'Universidade Mandume ya Ndemufayo',
        acronym: 'UMN',
        status: 'ACTIVE',
      }
    )

    // 2. Unidade Acadêmica
    const cienciasUan = await AcademicUnitModel.firstOrCreate(
      { universityId: uan.id, name: 'Faculdade de Ciências Naturais' },
      {
        id: randomUUID(),
        universityId: uan.id,
        name: 'Faculdade de Ciências Naturais',
        type: 'FACULTY',
      }
    )

    // 3. Cursos
    const engenhariaInformatica = await AcademicCourseModel.firstOrCreate(
      { universityId: uan.id, name: 'Engenharia Informática' },
      {
        id: randomUUID(),
        universityId: uan.id,
        academicUnitId: cienciasUan.id,
        name: 'Engenharia Informática',
        status: 'ACTIVE',
      }
    )

    const cienciasComputacao = await AcademicCourseModel.firstOrCreate(
      { universityId: uan.id, name: 'Ciência da Computação' },
      {
        id: randomUUID(),
        universityId: uan.id,
        academicUnitId: cienciasUan.id,
        name: 'Ciência da Computação',
        status: 'ACTIVE',
      }
    )

    // 4. Disciplinas
    const matematica = await AcademicSubjectModel.firstOrCreate(
      { name: 'Matemática' },
      {
        id: randomUUID(),
        name: 'Matemática',
        description: 'Álgebra, Análise Matemática, Geometria e Funções para Exames de Acesso',
      }
    )

    const fisica = await AcademicSubjectModel.firstOrCreate(
      { name: 'Física' },
      {
        id: randomUUID(),
        name: 'Física',
        description: 'Mecânica Clássica, Eletromagnetismo e Óptica',
      }
    )

    // 5. Vincular Disciplinas aos Cursos (N:M)
    await AcademicCourseSubjectModel.firstOrCreate(
      { courseId: engenhariaInformatica.id, subjectId: matematica.id },
      {
        id: randomUUID(),
        courseId: engenhariaInformatica.id,
        subjectId: matematica.id,
      }
    )

    await AcademicCourseSubjectModel.firstOrCreate(
      { courseId: cienciasComputacao.id, subjectId: matematica.id },
      {
        id: randomUUID(),
        courseId: cienciasComputacao.id,
        subjectId: matematica.id,
      }
    )

    // 6. Árvore de Tópicos
    const algebra = await AcademicTopicModel.firstOrCreate(
      { subjectId: matematica.id, name: 'Álgebra e Polinômios' },
      {
        id: randomUUID(),
        subjectId: matematica.id,
        parentId: null,
        name: 'Álgebra e Polinômios',
        level: 1,
        position: 1,
      }
    )

    const equacoes2Grau = await AcademicTopicModel.firstOrCreate(
      { subjectId: matematica.id, name: 'Equações e Inequações do 2º Grau' },
      {
        id: randomUUID(),
        subjectId: matematica.id,
        parentId: algebra.id,
        name: 'Equações e Inequações do 2º Grau',
        level: 2,
        position: 1,
      }
    )

    const formulasRaizes = await AcademicTopicModel.firstOrCreate(
      { subjectId: matematica.id, name: 'Fórmula Resolvente e Relações de Viète' },
      {
        id: randomUUID(),
        subjectId: matematica.id,
        parentId: equacoes2Grau.id,
        name: 'Fórmula Resolvente e Relações de Viète',
        level: 3,
        position: 1,
      }
    )

    const geometria = await AcademicTopicModel.firstOrCreate(
      { subjectId: matematica.id, name: 'Geometria e Trigonometria' },
      {
        id: randomUUID(),
        subjectId: matematica.id,
        parentId: null,
        name: 'Geometria e Trigonometria',
        level: 1,
        position: 2,
      }
    )

    // 7. Exame de Admissão
    const exame2024 = await AcademicExamModel.firstOrCreate(
      { courseId: engenhariaInformatica.id, year: 2024, period: 'EXAM_1' },
      {
        id: randomUUID(),
        courseId: engenhariaInformatica.id,
        year: 2024,
        period: 'EXAM_1',
        sourceType: 'OFFICIAL_EXAM',
        status: 'READY',
      }
    )

    // 8. Questão 1 (PUBLISHED)
    let q1 = await AcademicQuestionModel.query()
      .where('statement', 'like', '%2x² - 8x + 6 = 0%')
      .first()

    if (!q1) {
      q1 = await AcademicQuestionModel.create({
        id: randomUUID(),
        examId: exame2024.id,
        subjectId: matematica.id,
        topicId: formulasRaizes.id,
        type: 'SINGLE_CHOICE',
        statement: 'Determine as raízes reais da equação quadrática 2x² - 8x + 6 = 0.',
        difficulty: 'MEDIUM',
        source: 'OFFICIAL_EXAM',
        status: 'PUBLISHED',
        version: 2,
        solution: 'Dividindo por 2: x² - 4x + 3 = 0. Delta = 16 - 12 = 4. x = (4 ± 2) / 2 => x1 = 3, x2 = 1.',
        explanation: 'Utiliza-se a fórmula de Bhaskara / Resolvente. Como o delta é positivo, existem duas soluções reais distintas.',
        sourceMetadata: {
          isAiGenerated: true,
          aiConfidenceScore: 0.96,
          sourceExam: 'UAN 2024 - Engenharia Informática',
        },
      })

      // Alternativas Q1
      await AcademicQuestionOptionModel.createMany([
        { id: randomUUID(), questionId: q1.id, label: 'A', content: 'x = 1 ou x = 3', position: 0, isCorrect: true },
        { id: randomUUID(), questionId: q1.id, label: 'B', content: 'x = 2 ou x = 4', position: 1, isCorrect: false },
        { id: randomUUID(), questionId: q1.id, label: 'C', content: 'x = -1 ou x = -3', position: 2, isCorrect: false },
        { id: randomUUID(), questionId: q1.id, label: 'D', content: 'x = 0 ou x = 6', position: 3, isCorrect: false },
      ])

      // Histórico de Revisão Q1
      if (authorId) {
        await AcademicQuestionRevisionModel.create({
          id: randomUUID(),
          questionId: q1.id,
          revisionNumber: 1,
          authorId: authorId,
          reason: 'Extração inicial via OCR/IA do exame UAN 2024',
          changesSummary: JSON.stringify({ status: 'DRAFT' }),
          snapshotData: { statement: q1.statement, version: 1 },
        })
      }
    }

    // 9. Questão 2 (UNDER_REVIEW com IA)
    let q2 = await AcademicQuestionModel.query()
      .where('statement', 'like', '%triângulo retângulo com hipotenusa 10 cm%')
      .first()

    if (!q2) {
      q2 = await AcademicQuestionModel.create({
        id: randomUUID(),
        examId: exame2024.id,
        subjectId: matematica.id,
        topicId: geometria.id,
        type: 'SINGLE_CHOICE',
        statement: 'Em um triângulo retângulo com hipotenusa medindo 10 cm e um cateto medindo 6 cm, qual é o valor do cosseno do ângulo adjacente ao cateto de 8 cm?',
        difficulty: 'HARD',
        source: 'OFFICIAL_EXAM',
        status: 'UNDER_REVIEW',
        version: 1,
        solution: 'Pelo Teorema de Pitágoras, o outro cateto é √(100 - 36) = 8 cm. O cosseno do ângulo adjacente ao cateto de 8 cm é Cateto Adjacente / Hipotenusa = 8/10 = 0.8.',
        explanation: 'Definição trigonométrica fundamental no triângulo retângulo: cos(θ) = cateto adjacente / hipotenusa.',
        sourceMetadata: {
          isAiGenerated: true,
          aiConfidenceScore: 0.91,
          sourceExam: 'UAN 2024 - Engenharia Informática',
        },
      })

      await AcademicQuestionOptionModel.createMany([
        { id: randomUUID(), questionId: q2.id, label: 'A', content: 'cos(θ) = 0.8', position: 0, isCorrect: true },
        { id: randomUUID(), questionId: q2.id, label: 'B', content: 'cos(θ) = 0.6', position: 1, isCorrect: false },
        { id: randomUUID(), questionId: q2.id, label: 'C', content: 'cos(θ) = 0.75', position: 2, isCorrect: false },
        { id: randomUUID(), questionId: q2.id, label: 'D', content: 'cos(θ) = 1.0', position: 3, isCorrect: false },
      ])

      // Relação de questão
      await AcademicQuestionRelationModel.create({
        id: randomUUID(),
        sourceQuestionId: q2.id,
        targetQuestionId: q1.id,
        relationType: 'SIMILAR_TO',
      })
    }
  }
}
