# Guia de Segurança e Auditoria (Security Guide)

> **Status:** `[IMPLEMENTADO / AUDITADO]`  
> **Última Auditoria de Segurança:** 15 de Agosto de 2026

---

## 1. Classificação do Estado de Segurança da Plataforma

| Mecanismo de Segurança | Classificação | Evidência no Código | Detalhes |
| :--- | :---: | :--- | :--- |
| **Hash Criptográfico de Senhas** | `IMPLEMENTADO` | `config/hash.ts` | Scrypt com parâmetros seguros (`cost: 16384`, `blockSize: 8`, `saltSize: 16`). |
| **Proteção Contra Força Bruta** | `IMPLEMENTADO` | `base_sign_in_controller.ts` | Rate limiter com Redis: 3 tentativas a cada 5 min por IP + Usuário. |
| **Controle de Acesso Baseado em Papéis (RBAC / ACL)** | `IMPLEMENTADO` | `can_middleware.ts` | Validação estrita de permissões do perfil associado ao usuário. |
| **Proteção CSRF / XSS / HSTS** | `IMPLEMENTADO` | `config/shield.ts` | AdonisJS Shield ativado para todas as rotas web de sessão. |
| **Proteção Contra Path Traversal** | `IMPLEMENTADO` | `start/routes/std.ts` | Regex `/(?:^\|[\\/])\.\.(?:[\\/]\|$)/` bloqueia tentativas de leitura arbitrária de arquivos de storage. |
| **Sanitização de Erros em Produção** | `IMPLEMENTADO` | `capture_errors_decorator.ts` | Em produção, detalhes internos de exceção são enviados ao Sentry e uma mensagem genérica amigável é retornada ao cliente. |
| **Prevenção de SQL Injection** | `IMPLEMENTADO` | Lucid ORM / Knex | Consultas parametrizadas via bindings do Lucid/Knex. |
| **Isolamento Multi-Tenant por Organização** | `PARCIALMENTE IMPLEMENTADO` | Entidades com `userId` | Isolamento atual é baseado em propriedade do usuário (`userId`). Suporte a `organizationId` ou multi-tenancy avançado deve ser reforçado nos novos módulos. |
| **Rotação Periódica de Segredos** | `RECOMENDAÇÃO` | `.env.example` | Recomenda-se utilizar cofres de segredos (HashiCorp Vault ou AWS Secrets Manager) em ambientes de produção. |

---

## 2. Padrões Obrigatórios de Segurança para Desenvolvedores

### 2.1. Nunca Expor Senhas ou Hashes em Respostas
No Model Lucid do usuário, a coluna de senha deve ser ocultada:
```typescript
@column({ serializeAs: null })
declare password: string
```

### 2.2. Proteger Todas as Rotas Administrativas com `middleware.can()`
Nunca crie uma rota de mutação (POST, PUT, DELETE) sem associar o middleware de permissão correspondente:
```typescript
router.post('/users/create', routeAdapter(makeCreateUserControllerFactory(), {
  operation: 'admin-acl-create-user',
  description: '[Admin->Users] Create user',
})).middleware([middleware.auth(), middleware.can('admin-acl-create-user')])
```

### 2.3. Sanitização de Entrada de Dados com VineJS
Todo payload de entrada deve ser estritamente tipado e sanitizado:
```typescript
import vine from '@vinejs/vine'

export const userInputValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    fullName: vine.string().trim().minLength(3).maxLength(120),
  })
)
```

### 2.4. Validação de Ownership (Prevenção de IDOR)
Sempre valide se o recurso sendo modificado pertence ao usuário autenticado ou se o usuário possui permissão de administração geral:
```typescript
if (!auth.user.isSuperAdmin && resource.userId !== auth.user.id) {
  return left(new UnauthorizedAccessError())
}
```
