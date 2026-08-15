# Guia de Desenvolvimento de APIs (API Development Guide)

> **Status:** `[IMPLEMENTADO / NORMATIVO]`

---

## 1. Estratégia Dupla: Rotas Web (Inertia SPA) vs Rotas API REST

O boilerplate atende a dois clientes principais:
1. **Frontend Web Monolítico (Inertia.js + Vue 3):**
   - Prefixos de rota: `/security/auth/*`, `/account/admin/*`, `/account/crm/*`.
   - Controladores renderizam páginas via `inertia.render('path/to/component', props)` ou retornam redirecionamentos com flash messages (`session.flash('alert', { success, message })`).
2. **APIs RESTful (Mobile / Integrações Externas / Chamadas Assíncronas):**
   - Prefixos de rota: `/api/*`.
   - Controladores retornam respostas puras em formato JSON estruturado.
   - Autenticação via Bearer Token (`guards: ['api']`).

---

## 2. Padrão Universal de Rotas com `routeAdapter`

Todas as rotas HTTP do projeto devem ser declaradas utilizando o `routeAdapter`:

```typescript
import { routeAdapter } from '#app/adapters/route_adapter'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { makeCreateRoleControllerFactory } from './factories/index.js'

router
  .group(() => {
    router
      .post(
        '/roles',
        routeAdapter(makeCreateRoleControllerFactory(), {
          operation: 'admin-acl-create-role',
          description: '[Admin->Settings->Roles] Create a new role',
        })
      )
      .as('roles.create')
      .middleware(middleware.can('admin-acl-create-role'))
  })
  .prefix('/api/admin/settings/acl')
  .middleware([middleware.auth({ guards: ['api'] })])
```

### Por Que Usar o `routeAdapter`?
- **Auditoria e Telemetria Automática:** Inicia e conclui uma transação no Sentry com `operation` e `description`.
- **Captura Padronizada de Erros:** O `CaptureErrorDecorator` intercepta `E_VALIDATION_ERROR` e erros inesperados, formatando adequadamente para JSON (se `/api/*`) ou flash session (se Web).
- **Header de Resposta:** Anexa automaticamente o cabeçalho `x-operation-name`.

---

## 3. Validação de Requisições com VineJS

A validação de payloads HTTP deve utilizar esquemas compilados com VineJS (`@vinejs/vine`):

```typescript
import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50),
    description: vine.string().trim().minLength(5).maxLength(255),
    permissions: vine.array(vine.string().uuid()),
  })
)
```

No Controller:
```typescript
const validation = await request.validateUsing(createRoleValidator)
```

---

## 4. Padrão de Respostas e Códigos de Status HTTP

| Status Code | Cenário | Formato de Resposta JSON (API) |
| :--- | :--- | :--- |
| **`200 OK`** | Consulta ou atualização bem sucedida | `{ "message": "Operação realizada com sucesso", "data": { ... } }` |
| **`201 Created`** | Criação de recurso bem sucedida | `{ "message": "Recurso criado com sucesso", "data": { "id": "..." } }` |
| **`400 Bad Request`** | Erro de validação ou payload malformado | `{ "message": ["O campo nome é obrigatório", ...] }` |
| **`401 Unauthorized`** | Não autenticado ou credenciais inválidas | `{ "message": "Credenciais inválidas ou sessão expirada" }` |
| **`403 Forbidden`** | Sem permissão de acesso (ACL) | `{ "message": "Você não possui permissão para executar esta ação" }` |
| **`404 Not Found`** | Recurso não encontrado | `{ "message": "Recurso não encontrado" }` |
| **`429 Too Many Requests`** | Bloqueio por excesso de requisições | `{ "message": "Muitas tentativas. Tente novamente em X segundos" }` |
| **`500 Internal Server Error`** | Erro não tratado no servidor | `{ "message": "Ocorreu um erro interno no servidor" }` |

---

## 5. Paginação, Ordenação e Filtros

Para listagens, utilize as interfaces padronizadas em `@core/ports/pagination.ts` e `@core/ports/search.ts`:

### Parâmetros de Query Padronizados:
- `page`: Número da página (padrão: 1)
- `perPage`: Itens por página (padrão: 15)
- `orderBy`: Campo para ordenação (ex: `name`, `createdAt`)
- `orderByDirection`: Direção (`asc` ou `desc`)
- `searchValue`: Termo de busca textual genérica

### Estrutura de Retorno Paginada:
```json
{
  "data": [
    { "id": "uuid-1", "name": "Administrador" },
    { "id": "uuid-2", "name": "Operador" }
  ],
  "pagination": {
    "page": 1,
    "perPage": 15,
    "total": 2,
    "sort": "name",
    "direction": "asc"
  }
}
```

---

## 6. Documentação Swagger / OpenAPI

O projeto tem o Swagger configurado via `adonisjs-6-swagger`. A especificação pode ser acessada através da rota configurada em `config/swagger.ts`. Toda nova rota de API deve declarar adequadamente os decorators OpenAPI para manter a documentação de endpoints viva e sincronizada.
