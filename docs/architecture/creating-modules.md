# Guia de Criação de Novos Módulos (Creating Modules Guide)

> **Status:** `[IMPLEMENTADO / NORMATIVO]`  
> **Referência Obrigatória:** [Golden Module](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md) e [Naming Conventions](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/standards/naming-conventions.md).

---

## 1. Quando Criar um Novo Módulo?

Crie um novo módulo quando:
1. Uma nova **capacidade de negócio independente** (Bounded Context) for introduzida (ex: `billing`, `inventory`, `pedagogy`, `invoicing`).
2. As tabelas do banco de dados representarem um domínio conceitual próprio.
3. As regras de negócio precisarem de ciclo de vida, permissões e telas exclusivas.

### Onde Alocar o Módulo?
- **`app/modules/`:** Para funcionalidades que são **núcleo do sistema** e universais para qualquer instalação (ex: `auth`, `admin`, `shared`).
- **`app/modules/addons/`:** Para funcionalidades de **negócio extensíveis, plugáveis ou específicas de um cliente** (ex: `crm`, `accounting`, `pedagogy`). Módulos em `addons/` podem possuir seu próprio `package.json` ou `module.json`.

---

## 2. Estrutura Canônica de Diretórios de um Módulo

Ao criar um módulo chamado `<module-name>`, crie exatamente a seguinte estrutura:

```text
app/modules/<optional-path>/<module-name>/
├── domain/                                 # [Camada 1: Domínio Puro]
│   ├── entities/                           # Entidades de domínio (regras e invariantes)
│   │   ├── <entity-name>_entity.ts
│   │   └── index.ts
│   ├── value_objects/                      # Objetos de valor imutáveis
│   │   ├── <vo-name>.ts
│   │   └── index.ts
│   ├── errors/                             # Erros estruturados do domínio
│   │   ├── <error-name>_error.ts
│   │   └── index.ts
│   ├── events/                             # Eventos de domínio (IDomainEvent)
│   │   ├── <event-name>_event.ts
│   │   └── index.ts
│   ├── usecases/                           # Contratos formais dos casos de uso
│   │   ├── <usecase-name>/
│   │   │   ├── <usecase-name>_usecase.ts
│   │   │   ├── <usecase-name>_usecase_input.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
│
├── usecases/                               # [Camada 2: Casos de Uso / Aplicação]
│   ├── <usecase-name>/
│   │   ├── <usecase-name>_usecase_impl.ts
│   │   ├── <usecase-name>_usecase_impl.spec.ts # Teste unitário obrigatório
│   │   ├── ports/                          # Interfaces de repositórios e serviços
│   │   │   ├── <repo-name>_repository.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
│
├── framework/                              # [Camada 3: Infraestrutura e Framework]
│   ├── infra/
│   │   ├── db/
│   │   │   ├── migrations/                 # Migrações Lucid (prefixo timestamp)
│   │   │   │   └── <timestamp>_create_<module>_<table-name>_table.ts
│   │   │   ├── models/                     # Models Lucid ORM
│   │   │   │   ├── <module>_<entity>_model.ts
│   │   │   │   └── index.ts
│   │   │   ├── mappers/                    # Conversores Domain <-> Persistence
│   │   │   │   ├── <entity>_mapper.ts
│   │   │   │   └── index.ts
│   │   │   ├── repositories/               # Implementações dos repositórios
│   │   │   │   ├── <repo-name>_repository_impl.ts
│   │   │   │   └── index.ts
│   │   │   └── seeders/                    # Seeders executáveis via ace db:sync
│   │   │       └── <module>_seeder.ts
│   │   ├── jobs/                           # Handlers do BullMQ
│   │   └── listeners/                      # Listeners de mensageria assíncrona
│   │
│   ├── main/
│   │   ├── controllers/                    # Controladores HTTP (AdonisJS)
│   │   │   ├── <controller-name>_controller.ts
│   │   │   └── index.ts
│   │   ├── factories/                      # Fábricas de injeção de dependência
│   │   │   ├── make_<action>_factory.ts
│   │   │   └── index.ts
│   │   ├── validators/                     # Schemas de validação VineJS
│   │   │   ├── <action>_validator.ts
│   │   │   └── index.ts
│   │   ├── i18n/                           # Dicionários de internacionalização
│   │   │   ├── pt.json
│   │   │   └── en.json
│   │   ├── events.ts                       # [AUTO-DISCOBERTAS] Registro de eventos
│   │   ├── routes.ts                       # [AUTO-DISCOBERTAS] Definição de rotas
│   │   └── startup.ts                      # [AUTO-DISCOBERTAS] Inicialização do módulo (opcional)
│   │
│   └── views/                              # [Camada 4: Interface Vue.js 3 / Inertia]
│       └── <feature>/
│           └── <page_name>_page.vue
│
└── readme.md                               # Documentação rápida local
```

---

## 3. Roteiro Passo a Passo de Implementação

Siga rigorosamente a ordem das fases abaixo:

### FASE 1: Registro Inicial e Planejamento
1. Acesse `docs/modules/module-registry.md` e adicione o módulo com status `IN_PROGRESS`.
2. Crie o arquivo `docs/modules/<module-name>.md` a partir de `docs/templates/module-template.md`.
3. Verifique as dependências necessárias e consulte a documentação oficial das versões instaladas em `package.json`.

---

### FASE 2: Modelagem do Domínio Puro (`domain/`)
1. **Entidades:** Crie as classes estendendo `Entity<Props>` ou `AggregateRoot<Props>`.
   - Adicione `static create(props): Either<Errors, Entity>` com validação de invariantes.
   - Adicione `static hydrate(id, props, options): Entity` para reconstituição.
2. **Erros de Domínio:** Crie classes de erro estendendo `Result<DomainError>`:
   ```typescript
   export class ClientTaxNumberInvalidError extends Result<DomainError> {
     constructor() {
       super(false, {
         message: 'crm.errors.tax_number_invalid',
         error: ClientTaxNumberInvalidError.name,
       })
     }
   }
   ```
3. **Contrato do Caso de Uso:** Crie a declaração de tipos:
   ```typescript
   export namespace CreateClientUseCase {
     export type Input = { name: string; taxNumber: string; userId: string }
     export type Output = Either<ClientTaxNumberInvalidError | ClientAlreadyExistsError, { id: string }>
     export type Contract = UseCase<Input, Output>
   }
   ```

---

### FASE 3: Implementação dos Casos de Uso & Testes Unitários (`usecases/`)
1. Crie as interfaces dos repositórios dentro de `usecases/<usecase-name>/ports/`.
2. Implemente a classe do usecase recebendo as portas no construtor.
3. Escreva o teste unitário (`*.spec.ts`) usando `@japa/runner` e `sinon` cobrindo todos os fluxos de sucesso e erro.
4. Execute os testes com `node ace test --suite=unit`.

---

### FASE 4: Banco de Dados & Persistência (`framework/infra/db/`)
1. **Migration:** Crie a migration dentro de `framework/infra/db/migrations/`:
   - Nome da tabela: `<module_prefix>_<table_name>` (ex: `crm_clients`).
   - Use colunas UUID (`id: varchar(36) PK`), `created_at`, `updated_at`, `deleted_at`.
2. **Model Lucid:** Crie o model em `framework/infra/db/models/`:
   - Defina `@column({ isPrimary: true }) declare id: string`.
3. **Mapper:** Crie a classe `Mapper<ClientEntity, ClientModel>` implementando `toDomain` e `toPersistence`.
4. **Repositório:** Implemente a interface do usecase port em `framework/infra/db/repositories/`.

---

### FASE 5: Controladores, Validações e Rotas (`framework/main/`)
1. **Validação VineJS:** Crie o schema de validação:
   ```typescript
   import vine from '@vinejs/vine'
   export const createClientValidator = vine.compile(
     vine.object({
       name: vine.string().trim().minLength(3),
       taxNumber: vine.string().trim(),
     })
   )
   ```
2. **Controller:** Implemente `Controller<HttpContext>`:
   - Valide a requisição com `request.validateUsing(validator)` ou `validate(request.body())`.
   - Invoque `usecase.perform(dto)`.
   - Trate o resultado com `Either` e configure resposta flash/JSON.
3. **Factory:** Crie a fábrica de montagem em `framework/main/factories/`.
4. **Rotas:** Declare as rotas em `framework/main/routes.ts`:
   ```typescript
   router.post('/clients', routeAdapter(makeCreateClientControllerFactory(), {
     operation: 'crm-create-client',
     description: '[CRM] Create a new client',
   })).middleware([middleware.auth(), middleware.can('crm-create-client')])
   ```
5. **i18n:** Adicione as traduções em `framework/main/i18n/pt.json` e `en.json`.

---

### FASE 6: Interface Inertia / Vue (`framework/views/`)
1. Crie os componentes Vue 3 em `framework/views/`.
2. Utilize TailwindCSS e DaisyUI/Flowbite conforme o design system.
3. Receba dados via props tipadas do Inertia e use `@inertiajs/vue3` (`router`, `useForm`).

---

### FASE 7: Validação e Atualização do Registro
1. Execute `npm run typecheck` e `npm run lint`.
2. Execute a suite de testes automatizados `npm test`.
3. Execute `node ace db:sync` para validar seeders e banco de dados.
4. Atualize `docs/modules/module-registry.md` alterando o status para `IMPLEMENTED` ou `NEEDS_REVIEW`.
5. Atualize `docs/architecture/dependency-map.md` se novas dependências foram geradas.
