# Convenções de Nomenclatura (Naming Conventions)

> **Status:** `[NORMATIVO / PADRÃO OFICIAL]`

---

## 1. Tabela de Convenções de Nomenclatura

| Elemento | Convenção / Formato | Exemplo Correto | Exemplo Incorreto |
| :--- | :--- | :--- | :--- |
| **Arquivos TypeScript** | `snake_case.ts` | `role_entity.ts`, `create_role_usecase_impl.ts` | `RoleEntity.ts`, `createRole.ts` |
| **Arquivos de Teste Unitário** | `snake_case.spec.ts` | `create_role_usecase_impl.spec.ts` | `createRole.test.ts` |
| **Arquivos de Teste Integração**| `snake_case.test.ts` | `view_logs.test.ts` | `viewLogs.spec.ts` |
| **Arquivos de Teste Browser** | `snake_case.browser.ts`| `extract_logs.test.browser.ts` | `browser_test.ts` |
| **Diretórios de Módulos** | `snake_case` | `roles_management`, `users_management` | `RolesManagement`, `Residence` |
| **Classes e Enums** | `PascalCase` | `RoleEntity`, `CreateRoleUseCaseImpl`, `MongoDb` | `roleEntity`, `create_role_impl` |
| **Interfaces de Domínio/Portas**| `PascalCase` / `IPascalCase`| `TransactionAdapter`, `IEventDispatcher` | `transaction_adapter`, `ITransaction_adapter` |
| **Métodos e Funções** | `camelCase` | `perform()`, `toDomain()`, `useTransaction()` | `Perform()`, `to_domain()` |
| **Variáveis e Constantes** | `camelCase` / `UPPER_SNAKE` | `roleEntity`, `MAX_ATTEMPTS` | `Role_Entity`, `max_attempts` |
| **Tabelas MySQL** | `snake_case` com prefixo | `core_users`, `core_roles`, `crm_clients` | `Users`, `tbl_roles`, `clients` |
| **Colunas de Tabelas** | `snake_case` (BD) / `camelCase` (Model)| `tax_number` (SQL) / `declare taxNumber: string` (Model) | `TaxNumber` (SQL) |
| **Rotas e URLs HTTP** | `kebab-case` | `/account/admin/settings/acl/roles` | `/account/admin/settings/acl/RolesList` |
| **Chaves de Tradução (i18n)** | `dot.notation.snake_case` | `admin.acl.role.role_created` | `adminAclRoleCreated` |
| **Eventos de Domínio** | `PascalCase` + sufixo `Event` | `RoleCreatedEvent`, `UserLoggedEvent` | `Role_Created`, `user_login` |

---

## 2. Padrão de Mensagens de Commit (Angular Conventional Commits)

Todas as alterações no repositório devem seguir a convenção:

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em minúsculas>
```

### Tipos Permitidos:
- `feat`: Adiciona uma nova funcionalidade ao sistema (ex: `feat(crm): adiciona caso de uso para criação de clientes`).
- `fix`: Corrige um bug ou comportamento incorreto (ex: `fix(auth): corrige tempo de expiração do token`).
- `docs`: Modificações ou adições na documentação (ex: `docs(architecture): adiciona guia de criação de módulos`).
- `test`: Adiciona ou corrige testes automatizados (ex: `test(roles): adiciona testes unitários para delete_bulk_roles`).
- `refactor`: Refatoração interna que não altera o comportamento externo.
- `chore`: Tarefas de manutenção, atualização de dependências e tooling.
