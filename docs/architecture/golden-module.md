# Módulo de Referência (Golden Module)

> **Golden Module Eleito:** `app/modules/admin/settings/acl/roles_management`  
> **Módulo Complementar (Auth):** `app/modules/auth`  
> **Status:** `[IMPLEMENTADO]` — Serve como modelo canônico de engenharia para criação de novos módulos.

---

## 1. Por Que Este Módulo é o Golden Module?

O módulo `roles_management` implementa com pureza exemplar todos os 10 pilares arquiteturais do boilerplate:
1. **Entidades com Invariantes Encapsuladas:** Validação de regras no construtor de fábrica (`static create`) e método de hidratação sem validação para persistência (`static hydrate`).
2. **Value Objects e Identificadores Tipados:** Uso estrito de `UniqueEntityID`.
3. **Casos de Uso com Namespaces Tipados:** `Input`, `Output` (usando `Either`), `Errors` e `Contract`.
4. **Portas Secundárias em `ports/`:** O caso de uso depende apenas de interfaces abstratas de repositório e transação.
5. **Transações Desacopladas:** Uso do `TransactionAdapter` para garantir atomicidade entre Role e Permissions.
6. **Despacho de Eventos de Domínio:** Emissão de `RoleCreatedEvent` via `IEventDispatcher`.
7. **Mappers Bidirecionais:** Separação estrita entre modelo de domínio (`RoleEntity`) e modelo de banco de dados (`CoreRoleModel`).
8. **Factories como Composition Root:** Injeção manual explícita de dependências sem acoplamento oculto.
9. **Controladores Adaptados:** Uso de `routeAdapter` com metadados para auditoria Sentry e tratamento unificado de erros.
10. **Testes Unitários Puros com Mocks/Stubs:** Testes com `sinon` e `@japa/runner` sem necessidade de banco de dados ativo.

---

## 2. Anatomia Detalhada dos Arquivos do Golden Module

### 2.1. Entidade de Domínio (`domain/entities/role_entity.ts`)

```typescript
import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  PermissionAreMissingError,
  RoleDescriptionRequiredError,
  RoleNameRequiredError,
} from '#modules/admin/settings/acl/roles_management/domain/errors/index'

type Errors = RoleNameRequiredError | RoleDescriptionRequiredError | PermissionAreMissingError

export interface RoleProps {
  name: string
  slug?: string
  description: string
  internal?: boolean
  permissions: UniqueEntityID[]
  user?: UniqueEntityID
}

export class RoleEntity extends Entity<RoleProps> {
  get name(): string { return this.props.name }
  get isInternal(): boolean { return this.props.internal ?? false }
  get description(): string { return this.props.description }
  get slug(): string { return this.props.slug as string }
  get permissions(): UniqueEntityID[] { return this.props.permissions }
  get user(): UniqueEntityID | undefined { return this.props.user }

  changeName(name: string): void { this.props.name = name }
  changeDescription(description: string): void { this.props.description = description }
  updatePermissions(permissions: UniqueEntityID[]): void { this.props.permissions = permissions }

  validate(): Either<Errors, boolean> {
    if (!this.props.name || !this.props.name.length) {
      return left(new RoleNameRequiredError())
    }
    if (!this.props.description || !this.props.description.length) {
      return left(new RoleDescriptionRequiredError())
    }
    if (!this.props.permissions || this.props.permissions.length <= 0) {
      return left(new PermissionAreMissingError())
    }
    return right(true)
  }

  // Fábrica para novas instâncias com validação de invariantes
  static create(prop: RoleProps): Either<Errors, RoleEntity> {
    const roleEntity = new RoleEntity({
      name: prop.name,
      description: prop.description,
      permissions: prop.permissions,
      user: prop.user,
      internal: false,
    })

    const validation = roleEntity.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(roleEntity)
  }

  // Hidratação a partir da base de dados (ignora validação de criação)
  static hydrate(id: UniqueEntityID, props: RoleProps, options?: Options): RoleEntity {
    return new RoleEntity(props, id, options)
  }
}
```

---

### 2.2. Contrato do Caso de Uso (`domain/usecases/create_role/create_role_usecase.ts`)

```typescript
import { Either, UseCase } from '#core/domain/index'
import { RoleAlreadyExistError } from '../../errors/index.js'
import { CreateRoleUseCaseInput } from './create_role_usecase_input.js'

export type CreateRoleUseCase = UseCase<
  CreateRoleUseCaseInput,
  Either<RoleAlreadyExistError, boolean>
>
```

---

### 2.3. Implementação do Caso de Uso (`usecases/create_role/create_role_usecase_impl.ts`)

```typescript
import {
  CreateRoleUseCase,
  CreateRoleUseCaseInput,
} from '#modules/admin/settings/acl/roles_management/domain/index'
import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { RoleAlreadyExistError } from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import {
  CreateRoleWithTransactionRepository,
  FindRoleByNameRepository,
} from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { RoleCreatedEvent } from '#modules/admin/settings/acl/roles_management/domain/events/index'
import { TransactionAdapter } from '#core/ports/index'

export class CreateRoleUseCaseImpl implements CreateRoleUseCase {
  constructor(
    private readonly findRoleByNameRepository: FindRoleByNameRepository,
    private readonly createRoleWithTransactionRepository: CreateRoleWithTransactionRepository<any>,
    private readonly transactionAdapter: TransactionAdapter,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreateRoleUseCaseInput): Promise<Either<RoleAlreadyExistError, boolean>> {
    // 1. Criar entidade validando regras de domínio
    const roleEntityOrError = RoleEntity.create({
      name: input.name,
      description: input.description,
      permissions: input.permissions.map((p) => new UniqueEntityID(p)),
      user: new UniqueEntityID(input.userId),
    })

    if (roleEntityOrError.isLeft()) {
      return left(roleEntityOrError.value)
    }

    // 2. Verificar duplicidade de regra de negócio
    const roleAlreadyExists = await this.findRoleByNameRepository.findByName(
      roleEntityOrError.value.name
    )

    if (roleAlreadyExists) {
      return left(new RoleAlreadyExistError())
    }

    // 3. Persistir com transação ACID
    await this.transactionAdapter.useTransaction((trx) =>
      this.createRoleWithTransactionRepository.persistWithTransaction(roleEntityOrError.value, trx)
    )

    // 4. Disparar evento de domínio
    await this.eventDispatcher.publish(
      new RoleCreatedEvent({
        roleId: roleEntityOrError.value.id,
      })
    )

    return right(true)
  }
}
```

---

### 2.4. Repositório com Transação (`framework/infra/db/repositories/create_role_with_transaction_repository_impl.ts`)

```typescript
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { CreateRoleWithTransactionRepository } from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { UniqueEntityID } from '#core/domain/index'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class CreateRoleWithTransactionRepositoryImpl
  implements CreateRoleWithTransactionRepository<any>
{
  constructor(private readonly roleMapper: RoleMapper) {}

  async persistWithTransaction(
    roleEntity: RoleEntity,
    trx: TransactionClientContract
  ): Promise<void> {
    const roleModel = await this.roleMapper.toPersistence(roleEntity)

    roleModel.useTransaction(trx)
    await roleModel.save()

    await trx.table('core_role_permissions').insert(
      roleEntity.permissions
        .map((p) => p.toString())
        .map((p) => ({
          id: new UniqueEntityID().toString(),
          permission_id: p,
          role_id: roleEntity.id.toString(),
        }))
    )
  }
}
```

---

### 2.5. Fábrica de Composição (`framework/main/factories/make_create_role_controller_factory.ts`)

```typescript
import { CreateRoleController } from '../controllers/create_role_controller.js'
import { CreateRoleUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/create_role/create_role_usecase_impl'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import {
  FindRoleByNameRepositoryImpl,
  CreateRoleWithTransactionRepositoryImpl,
} from '#modules/admin/settings/acl/roles_management/framework/infra/db/index'
import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'

export const makeCreateRoleControllerFactory = (): CreateRoleController => {
  const roleMapper = new RoleMapper()

  return new CreateRoleController(
    new CreateRoleUseCaseImpl(
      new FindRoleByNameRepositoryImpl(roleMapper),
      new CreateRoleWithTransactionRepositoryImpl(roleMapper),
      new TransactionAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
}
```

---

### 2.6. Controlador HTTP (`framework/main/controllers/create_role_controller.ts`)

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { CreateRoleUseCase } from '#modules/admin/settings/acl/roles_management/domain/index'
import { CreateRoleValidation } from '../validations/create_role_validation.js'

export class CreateRoleController implements Controller<HttpContext> {
  constructor(private readonly createRoleUseCase: CreateRoleUseCase) {}

  async perform({ session, request, response, i18n, auth }: HttpContext): Promise<any> {
    if (!auth.user) {
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage('auth.unauthorized'),
      })
      return response.redirect().back()
    }

    const validation = await request.validateUsing(CreateRoleValidation).catch((e) => {
      session.flash('alert', {
        success: false,
        message: e.message,
      })
    })

    if (!validation) {
      return response.redirect().back()
    }

    const output = await this.createRoleUseCase.perform({
      name: validation.name,
      description: validation.description,
      permissions: validation.permissions,
      userId: auth.user.id,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })
      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.acl.role.role_created'),
    })

    if (validation.redirect) {
      return response.redirect('/account/admin/settings/acl/roles')
    }

    return response.redirect().back()
  }
}
```

---

### 2.7. Rotas e Autorização (`framework/main/routes.ts`)

```typescript
import { routeAdapter } from '#app/adapters/route_adapter'
import router from '@adonisjs/core/services/router'
import { makeCreateRoleControllerFactory } from './factories/index.js'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router
      .post(
        '/create',
        routeAdapter(makeCreateRoleControllerFactory(), {
          operation: 'admin-acl-create-role',
          description: '[Admin->Settings->Roles] Create a new role',
        })
      )
      .as('create')
      .middleware(middleware.can('admin-acl-create-role'))
  })
  .prefix('/account/admin/settings/acl/roles')
  .middleware([middleware.auth()])
  .as('account.admin.settings.acl.roles')
```

---

### 2.8. Teste Unitário com Sinon (`usecases/create_role/create_role_usecase_impl.spec.ts`)

```typescript
import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { CreateRoleUseCaseImpl } from './create_role_usecase_impl.js'
import { RoleAlreadyExistError } from '../../domain/errors/index.js'
import { EventDispatcher } from '#core/domain/index'

test.group('CreateRoleUseCase', () => {
  test('should return Left(RoleAlreadyExistError) when role name exists', async ({ assert }) => {
    const findRoleByNameStub = { findByName: sinon.fake.resolves({ id: 'existing' }) }
    const createRoleRepoStub = { persistWithTransaction: sinon.fake.resolves(undefined) }
    const transactionAdapterStub = { useTransaction: sinon.fake.yields({}) }
    const eventDispatcher = EventDispatcher.getInstance()

    const sut = new CreateRoleUseCaseImpl(
      findRoleByNameStub as any,
      createRoleRepoStub as any,
      transactionAdapterStub as any,
      eventDispatcher
    )

    const output = await sut.perform({
      name: 'Admin',
      description: 'System Administrator',
      permissions: ['perm-1'],
      userId: 'user-1',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, RoleAlreadyExistError)
  })
})
```

---

## 3. Checklist de Validação para Replicar Este Padrão

Quando for criar qualquer novo caso de uso ou módulo:
- [ ] O domínio possui `static create` com validação e `static hydrate` para persistência?
- [ ] O use case possui namespace com `Input`, `Output`, `Errors` e `Contract`?
- [ ] As dependências do use case estão isoladas em interfaces dentro de `ports/`?
- [ ] O repositório usa um `Mapper` para converter entidade de domínio em Model Lucid/MongoDB?
- [ ] O controller é instanciado em uma factory em `framework/main/factories/`?
- [ ] A rota está encapsulada por `routeAdapter(factory(), meta)` com `operation` e `description`?
- [ ] A rota está protegida por `middleware.auth()` e `middleware.can(...)` se exigir privilégios?
- [ ] Existe um teste unitário (`*.spec.ts`) usando stubs/mocks que cobre os ramos de sucesso e erro?
