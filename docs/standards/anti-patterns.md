# Catálogo de Anti-Padrões Proibidos (Anti-Patterns)

> **Status:** `[LEI DE ENGENHARIA / PROIBIDO]`  
> **Propósito:** Registrar as práticas inadequadas identificadas ou potenciais que **NUNCA** devem ser reproduzidas no projeto.

---

### ANTI-PADRÃO 1: Lógica de Negócio em Controladores (Fat Controllers)
- ❌ **Incorreto:** Fazer validações complexas de negócio, queries diretas no banco ou regras de cálculo dentro do método `perform()` do Controller.
- ✅ **Correto:** O Controller deve apenas validar o payload HTTP com VineJS, delegar para `usecase.perform(dto)` e converter o retorno `Either` para resposta HTTP/Inertia.

---

### ANTI-PADRÃO 2: Acesso Direto a Models ORM Dentro de Casos de Uso
- ❌ **Incorreto:** Importar `CoreUserModel.find(...)` ou `ClientModel.query()` dentro do UseCase.
- ✅ **Correto:** O UseCase deve receber uma interface em `ports/` (ex: `FindClientRepository`) e trabalhar exclusivamente com a Entidade de Domínio.

---

### ANTI-PADRÃO 3: Lançamento Descontrolado de Exceções (`throw new Error`)
- ❌ **Incorreto:** Lançar `throw new Error('User not found')` no fluxo normal de negócio, forçando blocos `try/catch` descontrolados.
- ✅ **Correto:** Retornar `return left(new UserNotFoundError())` usando o padrão funcional `Either<Left, Right>`.

---

### ANTI-PADRÃO 4: Imports Relativos Cruzados Entre Módulos
- ❌ **Incorreto:** `import { Something } from '../../../../admin/settings/acl/roles_management/usecases/...'`
- ✅ **Correto:** Comunicação inter-módulos apenas via eventos (`Outbox/Inbox`), ou imports globais autorizados de `#core/*` e `#shared/*`.

---

### ANTI-PADRÃO 5: Copiar e Colar Metadados de Rota sem Ajuste
- ❌ **Incorreto:** Copiar rotas de outro módulo mantendo `operation: 'view-my-user-profile-page'` e `description: '[Admin->Common]...'` (ocorrência real identificada no módulo CRM).
- ✅ **Correto:** Definir strings únicas e descritivas para cada rota no `routeAdapter` para garantir telemetria precisa no Sentry.

---

### ANTI-PADRÃO 6: Ignorar Permissões de Acesso (Bypass de ACL)
- ❌ **Incorreto:** Criar rotas de gerenciamento administrativo apenas com `middleware.auth()` sem associar `middleware.can('permissao-especifica')`.
- ✅ **Correto:** Toda ação administrativa deve validar a permissão granular do perfil do usuário via `can_middleware`.

---

### ANTI-PADRÃO 7: Testes Unitários Acoplados a Banco de Dados Real
- ❌ **Incorreto:** Escrever testes em `*.spec.ts` que conectam no MySQL/MongoDB e falham se o banco estiver offline.
- ✅ **Correto:** Testes unitários (`*.spec.ts`) devem rodar em milissegundos utilizando Sinon stubs para todas as portas de repositório e adaptadores.

---

### ANTI-PADRÃO 8: Textos Fixos Sem Internacionalização (Hardcoded Strings)
- ❌ **Incorreto:** Retornar mensagens como `return { message: 'Usuário cadastrado com sucesso' }` direto no código TypeScript.
- ✅ **Correto:** Usar o sistema i18n: `return { message: i18n.formatMessage('admin.user.created_success') }`.

---

### ANTI-PADRÃO 9: Nomenclatura Fora do Padrão
- ❌ **Incorreto:** Criar pastas com maiúsculas (ex: `domain/Residence`) ou arquivos fora do formato `snake_case.ts`.
- ✅ **Correto:** Seguir estritamente o [Naming Conventions Guide](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/standards/naming-conventions.md).

---

### ANTI-PADRÃO 10: Registro Duplicado de Middlewares
- ❌ **Incorreto:** Registrar o mesmo middleware múltiplas vezes na pilha do kernel (ocorrência identificada em `start/kernel.ts` onde `detect_user_locale_middleware` está listado duas vezes).
- ✅ **Correto:** Manter a cadeia de execução de middlewares limpa e idempotente.
