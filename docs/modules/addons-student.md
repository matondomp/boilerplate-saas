# Módulo `Addons::Student` (Módulo 02)

## 📌 Visão Geral
O módulo **`Addons::Student`** representa a identidade do aluno na plataforma e a gestão dos seus objetivos de preparação para os exames de acesso universitários em Angola (`PreparationGoal`).

---

## 🏗️ Estrutura do Módulo

```text
app/modules/addons/student/
├── domain/
│   ├── entities/          (StudentEntity, StudentProfileEntity, PreparationGoalEntity)
│   ├── value_objects/     (StudentStatus, PreparationGoalStatus)
│   ├── errors/            (student_errors.ts)
│   ├── events/            (PreparationGoalCreatedEvent, PrimaryPreparationGoalChangedEvent)
│   └── usecases/          (Interfaces de contratos e DTOs)
├── usecases/
│   ├── create_preparation_goal/
│   ├── list_student_goals/
│   └── set_primary_preparation_goal/
└── framework/
    ├── infra/
    │   └── db/
    │       ├── migrations/
    │       ├── models/    (StudentModel, StudentProfileModel, StudentPreparationGoalModel)
    │       ├── mappers/   (StudentMapper, StudentProfileMapper, PreparationGoalMapper)
    │       └── repositories/ (StudentRepositoriesImpl, PreparationGoalRepositoriesImpl)
    ├── main/
    │   ├── validators/   (create_preparation_goal_validator.ts, set_primary_preparation_goal_validator.ts)
    │   ├── controllers/  (CreatePreparationGoalController, ListStudentGoalsController, SetPrimaryPreparationGoalController)
    │   ├── factories/
    │   └── routes.ts     (/api/v1/student/*)
    └── views/
        └── goals/        (goals_page.vue, app_create_goal_modal.vue)
```

---

## 🔒 Regras de Negócio & Segurança
1. **Identidade Isolada:** O `studentId` é derivado estritamente do utilizador autenticado (`ctx.auth.user.id`).
2. **Curso e Universidade Válidos:** O backend valida se o curso pertence à universidade e se ambos estão com status `ACTIVE`.
3. **Objetivo Principal Único:** Cada aluno pode ter no máximo 1 objetivo com `is_primary = true`, atualizado atomicamente via transação de banco de dados (`db.transaction`).
4. **Preservação de Histórico:** O cancelamento ou inativação do aluno/objetivo **nunca apaga o histórico acadêmico**.

---

## 📡 Endpoints HTTP (`/api/v1/student`)

| Método | Rota | Operação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/student/goals` | `student-create-goal` | Cria um novo objetivo de preparação |
| `GET` | `/api/v1/student/goals` | `student-list-goals` | Lista todos os objetivos do aluno autenticado |
| `PATCH` | `/api/v1/student/goals/primary` | `student-set-primary-goal` | Define o objetivo de preparação principal |
