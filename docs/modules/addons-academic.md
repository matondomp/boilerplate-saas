# Documentação do Módulo: Addons::Academic (`app/modules/addons/academic`)

> **Localização:** `app/modules/addons/academic`  
> **Status:** `IMPLEMENTED`  
> **Data de Início:** 2026-08-28  
> **Última Atualização:** 2026-08-28  
> **Responsável / Autor:** Equipa de Engenharia / Antigravity AI  
> **Documentos de Referência:** [`docs/modules/module-01-master-prompt.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-master-prompt.md) e [`docs/modules/module-01-implementation-plan.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-implementation-plan.md)

---

## 1. Visão Geral e Objetivo de Negócio

O módulo `Addons::Academic` constitui a espinha dorsal acadêmica e pedagógica da plataforma de exames de acesso de Angola como um **Addon instalável e plugável** (`app/modules/addons/academic`).
Ele provê:
- Gestão cadastral e relacional da estrutura universitária (Universidades, Unidades Acadêmicas, Cursos, Disciplinas e Tópicos hierárquicos).
- Gestão de Exames independentes por curso/ano e banco de Questões com alternativas, soluções e explicações pedagógicas.
- Esteira de estados e moderação humana para conteúdo assistido por IA (`DRAFT -> PROCESSING -> AI_PROCESSED -> UNDER_REVIEW -> APPROVED -> PUBLISHED`).
- Versionamento imutável de itens com `QuestionRevision`.
- Gestão de múltiplos objetivos de estudo (`PreparationGoal`) por estudante.

---

## 2. Entidades de Domínio e Invariantes (`domain/`)

| Entidade / VO | Tipo | Propriedades Principais | Regras e Invariantes de Negócio |
| :--- | :---: | :--- | :--- |
| `UniversityEntity` | Aggregate Root | `id`, `name`, `acronym`, `status` | Nome obrigatório, não duplicar, inativação preserva histórico |
| `AcademicUnitEntity` | Entity | `id`, `universityId`, `name`, `type` | Pertence a universidade, opcional para cursos |
| `CourseEntity` | Aggregate Root | `id`, `universityId`, `academicUnitId`, `name`, `status` | Pertence a universidade, unicidade por universidade/nome |
| `SubjectEntity` | Aggregate Root | `id`, `name`, `description` | Área de conhecimento reutilizável em múltiplos cursos |
| `TopicEntity` | Entity | `id`, `subjectId`, `parentId`, `name`, `level`, `position` | Hierarquia em árvore por `parentId` sem ciclos |
| `ExamEntity` | Aggregate Root | `id`, `courseId`, `year`, `period`, `sourceType`, `status` | Único por curso/ano/período |
| `QuestionEntity` | Aggregate Root | `id`, `examId`, `subjectId`, `topicId`, `type`, `statement`, `difficulty`, `solution`, `explanation`, `status`, `version` | 1 correta para `SINGLE_CHOICE`, versionamento pós-publicação, sem bypass de revisão |
| `QuestionOptionEntity`| Entity | `id`, `questionId`, `label`, `content`, `position`, `isCorrect` | Rótulo (A-E), conteúdo obrigatório |
| `QuestionRevisionEntity`| Entity | `id`, `questionId`, `revisionNumber`, `authorId`, `changesSummary`, `snapshotData`, `reason` | Registro imutável de alterações em questão publicada |
| `QuestionRelationEntity`| Entity | `id`, `sourceQuestionId`, `targetQuestionId`, `relationType` | `SAME_AS` ou `SIMILAR_TO` sem fusão de registros |
| `PreparationGoalEntity`| Aggregate Root | `id`, `studentId`, `universityId`, `courseId`, `targetExamPeriod`, `status` | Múltiplos objetivos por estudante permitidos |

---

## 3. Casos de Uso e Portas Secundárias (`usecases/`)

| Caso de Uso | Entrada (`Input`) | Saída (`Output`) | Erros Possíveis (`Errors`) | Portas Requeridas (`ports/`) |
| :--- | :--- | :--- | :--- | :--- |
| `CreateUniversityUseCase` | `{ name, acronym }` | `Either<Errors, { id }>` | `UniversityAlreadyExistsError`, `UniversityNameRequiredError` | `FindUniversityByNameRepository`, `CreateUniversityRepository` |
| `CreateCourseUseCase` | `{ universityId, academicUnitId?, name }` | `Either<Errors, { id }>` | `UniversityNotFoundError`, `CourseAlreadyExistsError` | `FindUniversityByIdRepository`, `CreateCourseRepository` |
| `CreateSubjectUseCase` | `{ name, description? }` | `Either<Errors, { id }>` | `SubjectAlreadyExistsError` | `CreateSubjectRepository` |
| `CreateTopicUseCase` | `{ subjectId, parentId?, name, position? }` | `Either<Errors, { id }>` | `SubjectNotFoundError`, `TopicNotFoundError`, `TopicHierarchyCycleError` | `FindSubjectByIdRepository`, `FindTopicByIdRepository`, `CreateTopicRepository` |
| `CreateExamUseCase` | `{ courseId, year, period, sourceType, sourceMetadata? }` | `Either<Errors, { id }>` | `CourseNotFoundError`, `ExamAlreadyExistsError` | `FindCourseByIdRepository`, `CreateExamRepository` |
| `CreateQuestionUseCase` | `{ examId?, subjectId, topicId, type, statement, difficulty, solution, explanation, options, source, sourceMetadata? }` | `Either<Errors, { id }>` | `SubjectNotFoundError`, `TopicNotFoundError`, `InvalidQuestionOptionsError` | `CreateQuestionWithTransactionRepository`, `TransactionAdapter` |
| `UpdateQuestionUseCase` | `{ questionId, statement, solution, explanation, options, version, authorId, reason }` | `Either<Errors, boolean>` | `QuestionNotFoundError`, `OptimisticLockConflictError` | `FindQuestionByIdRepository`, `UpdateQuestionRepository`, `CreateQuestionRevisionRepository`, `TransactionAdapter` |
| `ChangeQuestionStatusUseCase` | `{ questionId, newStatus, authorId, reason? }` | `Either<Errors, boolean>` | `QuestionNotFoundError`, `InvalidStateTransitionError` | `FindQuestionByIdRepository`, `UpdateQuestionStatusRepository` |
| `CreatePreparationGoalUseCase` | `{ studentId, universityId, courseId, targetExamPeriod? }` | `Either<Errors, { id }>` | `UniversityInactiveError`, `CourseNotFoundError`, `PreparationGoalAlreadyExistsError` | `FindUniversityByIdRepository`, `FindCourseByIdRepository`, `CreatePreparationGoalRepository` |

---

## 4. Persistência de Dados (`framework/infra/db/`)

### Tabelas MySQL:
- `acad_universities`
- `acad_academic_units`
- `acad_courses`
- `acad_subjects`
- `acad_course_subjects`
- `acad_topics`
- `eval_exams`
- `eval_questions`
- `eval_question_options`
- `eval_question_revisions`
- `eval_question_relations`
- `student_preparation_goals`

---

## 5. Rotas, Controladores e Autorização (`framework/main/`)

| Método | Rota HTTP | Controller / Factory | Permissão ACL (`middleware.can`) | Metadados Sentry (`operation`) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/academic/universities` | `makeCreateUniversityControllerFactory()` | `academic:university:create` | `academic-create-university` |
| `GET` | `/api/v1/academic/universities` | `makeListUniversitiesControllerFactory()` | `academic:university:view` | `academic-list-universities` |
| `POST` | `/api/v1/academic/courses` | `makeCreateCourseControllerFactory()` | `academic:course:create` | `academic-create-course` |
| `POST` | `/api/v1/academic/exams` | `makeCreateExamControllerFactory()` | `academic:exam:create` | `academic-create-exam` |
| `POST` | `/api/v1/academic/questions` | `makeCreateQuestionControllerFactory()` | `academic:question:create` | `academic-create-question` |
| `PUT` | `/api/v1/academic/questions/:id` | `makeUpdateQuestionControllerFactory()` | `academic:question:edit` | `academic-update-question` |
| `PATCH`| `/api/v1/academic/questions/:id/status` | `makeChangeQuestionStatusControllerFactory()` | `academic:question:publish` | `academic-change-question-status` |
| `POST` | `/api/v1/student/goals` | `makeCreatePreparationGoalControllerFactory()` | `student:goal:create` | `student-create-goal` |
| `GET` | `/api/v1/student/goals` | `makeListPreparationGoalsControllerFactory()` | `student:goal:view` | `student-list-goals` |

---

## 6. Interfaces Web & Design System (`framework/views/`)

| View / Tela | Rota Web | Componentes Principais | Permissão ACL |
| :--- | :--- | :--- | :--- |
| **Universidades** | `/academic/universities` | `universities_page.vue`, `app_create_edit_university_modal.vue` | `academic-universities-view` |
| **Cursos** | `/academic/courses` | `courses_page.vue`, `app_create_edit_course_modal.vue` | `academic-courses-view` |
| **Disciplinas** | `/academic/subjects` | `subjects_page.vue`, `app_create_edit_subject_modal.vue` | `academic-subjects-view` |
| **Tópicos (Hierarquia)** | `/academic/topics` | `topics_page.vue`, `app_topic_tree_item.vue`, `app_create_edit_topic_modal.vue` | `academic-topics-view` |
| **Exames & Provas** | `/academic/exams` | `exams_page.vue`, `app_upload_exam_pdf_modal.vue`, `app_create_exam_modal.vue` | `academic-exams-view` |
| **Banco de Questões** | `/academic/questions` | `questions_page.vue`, `app_question_status_badge.vue` | `academic-questions-view` |
| **Editor de Questões** | `/academic/questions/new` / `:id/edit` | `question_editor_page.vue`, `app_question_options_editor.vue` | `academic-questions-manage` |
| **Moderação & Revisão**| `/academic/questions/:id/review` | `question_review_page.vue`, `app_question_preview_card.vue` | `academic-questions-review` |

---

## 7. Seeders de Permissões e Menus (`framework/infra/db/seeders/`)

- `00_insert_academic_permissions.ts`: Insere as permissões de acesso e gestão acadêmica.
- `01_associate_academic_permissions_with_root.ts`: Associa todas as novas permissões à role `root`.
- `02_insert_academic_menus.ts`: Insere os menus "Gestão Académica" e "Avaliações & Conteúdo" no `AccountLayout`.

---

## 8. Testes Automatizados

- [x] Testes Unitários de Entidade (`domain/entities/*.spec.ts`)
- [x] Testes Unitários de Casos de Uso (`usecases/*/*.spec.ts`)
- [ ] Testes de Integração de Repositório (`framework/test/integration/*.test.ts`)
