# Guia de Testes Automatizados (Testing Guide)

> **Status:** `[IMPLEMENTADO / NORMATIVO]`  
> **Framework de Testes:** Japa v3 (`@japa/runner`, `@japa/assert`, `@japa/expect`, `@japa/api-client`, `@japa/browser-client`, `@japa/plugin-adonisjs`) + Sinon (`sinon: ^17.0.1`).

---

## 1. Pirâmide e Suítes de Testes

As suítes são configuradas em `adonisrc.ts` e inicializadas em `tests/bootstrap.ts`:

| Suíte | Padrão de Arquivo | Propósito | Dependência de Banco? | Timeout |
| :--- | :--- | :--- | :---: | :---: |
| **`unit`** | `app/modules/**/*.spec.ts` | Testes de Entidades, Value Objects e Casos de Uso | **NÃO** (Usa Sinon Stubs) | 2.000 ms |
| **`functional`** | `app/**/*.test.ts`, `tests/functional/**/*.test.ts` | Testes de Integração de Repositórios e Endpoints HTTP | **SIM** (Migrate & Seed) | 30.000 ms |
| **`browser`** | `app/modules/**/*.browser.ts` | Testes End-to-End no Navegador Real (Playwright) | **SIM** (Migrate, Seed & Server) | 60.000 ms |

---

## 2. Padrão Canônico de Testes Unitários de Casos de Uso

Os testes unitários devem isolar completamente o caso de uso de infraestrutura e banco de dados, utilizando o padrão **System Under Test (`makeSut`)** e **Stubs com Sinon**:

```typescript
import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { AuthenticateUserUseCaseImpl } from './authenticate_user_usecase_impl.js'
import { UserNotFoundError, PasswordMismatchError } from '../../domain/errors/index.js'
import { EventDispatcher } from '#core/domain/index'

interface SutTypes {
  sut: AuthenticateUserUseCaseImpl
  findUsernameRepositoryStub: any
  verifyPasswordMatchAdapterStub: any
}

const makeSut = (): SutTypes => {
  const findUsernameRepositoryStub = {
    findUsername: sinon.fake.resolves({ id: 'valid_id', password: 'hashed_password' })
  }
  const verifyPasswordMatchAdapterStub = {
    compare: sinon.fake.resolves(true)
  }
  const sut = new AuthenticateUserUseCaseImpl(
    findUsernameRepositoryStub as any,
    verifyPasswordMatchAdapterStub as any,
    EventDispatcher.getInstance()
  )

  return { sut, findUsernameRepositoryStub, verifyPasswordMatchAdapterStub }
}

test.group('AuthenticateUserUseCase', () => {
  test('should return Left(UserNotFoundError) when user is not found', async ({ assert }) => {
    const { sut, findUsernameRepositoryStub } = makeSut()
    sinon.replace(findUsernameRepositoryStub, 'findUsername', sinon.fake.resolves(undefined))

    const output = await sut.perform({
      username: 'non_existent@mail.com',
      password: 'any_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, UserNotFoundError)
  })

  test('should return Left(PasswordMismatchError) when password does not match', async ({ assert }) => {
    const { sut, verifyPasswordMatchAdapterStub } = makeSut()
    sinon.replace(verifyPasswordMatchAdapterStub, 'compare', sinon.fake.resolves(false))

    const output = await sut.perform({
      username: 'valid@mail.com',
      password: 'wrong_password',
    })

    assert.isTrue(output.isLeft())
    assert.instanceOf(output.value, PasswordMismatchError)
  })

  test('should return Right(userId) when authentication succeeds', async ({ assert }) => {
    const { sut } = makeSut()

    const output = await sut.perform({
      username: 'valid@mail.com',
      password: 'correct_password',
    })

    assert.isTrue(output.isRight())
    assert.deepEqual(output.value, { userId: 'valid_id' })
  })
})
```

---

## 3. Padrão de Testes de Integração HTTP (`functional`)

```typescript
import { test } from '@japa/runner'

test.group('Auth API Functional Tests', () => {
  test('should authenticate user and return api access token', async ({ client }) => {
    const response = await client.post('/api/security/auth/login').json({
      username: 'root@admin.com',
      password: 'SecretPassword123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      token: { type: 'bearer' },
    })
  })
})
```

---

## 4. Padrão de Testes de Navegador / E2E (`browser`)

Utiliza o navegador Playwright headless configurado no Japa Browser Client:

```typescript
import { test } from '@japa/runner'

test.group('Users Management Browser Test', () => {
  test('should display users list in admin panel', async ({ visit }) => {
    const page = await visit('/security/auth/login')
    await page.fillForm('form', {
      username: 'root@admin.com',
      password: 'password123',
    })
    await page.submitForm('form')

    await page.visit('/account/admin/settings/acl/users')
    await page.assertSee('Gestão de Utilizadores')
  })
})
```

---

## 5. Comandos para Execução dos Testes

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários (rápido, sem banco de dados)
node ace test --suite=unit

# Executar apenas testes funcionais
node ace test --suite=functional

# Executar testes de navegador E2E
node ace test --suite=browser

# Executar um arquivo de teste específico
node ace test --files=app/modules/auth/usecases/authenticate_user/authenticate_user_usecase_impl.spec.ts
```
