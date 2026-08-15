# Módulo de Autenticação (`auth`)

> **Localização:** `app/modules/auth`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `auth` gerencia todo o ciclo de segurança de acesso dos usuários à aplicação. Ele provê:
1. **Autenticação Web Baseada em Sessão:** Cookies HTTP-Only com proteção CSRF via `@adonisjs/shield` e suporte a RememberMe (`core_remember_me_tokens`).
2. **Autenticação API REST:** Emissão e revogação de tokens opacos (`accessTokens`) usando o guard `tokensGuard` do AdonisJS.
3. **Proteção Contra Força Bruta:** Limitação de tentativas de login via `@adonisjs/limiter` no Redis (3 tentativas a cada 5 minutos por IP + Username).
4. **Fluxo de Recuperação e Redefinição de Senha:** Geração de token assinado, envio de email via Outbox/Queue (`CoreSendEmailJob`) e redefinição segura com hash Scrypt.

---

## 2. Estrutura Interna do Módulo

```text
app/modules/auth/
├── domain/
│   ├── entities/
│   ├── errors/
│   │   ├── password_mismatch_error.ts
│   │   ├── user_inactive_error.ts
│   │   └── user_not_found_error.ts
│   ├── events/
│   │   ├── password_reset_event.ts
│   │   └── user_logged_event.ts
│   └── usecases/
│       ├── authenticate_user_usecase.ts
│       ├── reset_password_use_case.ts
│       └── send_reset_password_usecase.ts
│
├── usecases/
│   ├── authenticate_user/
│   │   ├── authenticate_user_usecase_impl.ts
│   │   ├── authenticate_user_usecase_impl.spec.ts
│   │   └── ports/ (FindUsernameRepository, VerifyPasswordMatchAdapter)
│   ├── reset_password/
│   │   ├── reset_password_usecase_impl.ts
│   │   └── reset_password_usecase_impl.spec.ts
│   └── send_reset_password/
│       ├── send_reset_password_usecase_impl.ts
│       └── send_reset_password_usecase_impl.spec.ts
│
└── framework/
    ├── infra/ (adapters: hash_driver, listeners)
    ├── main/
    │   ├── controllers/
    │   │   ├── sign_in/ (base_sign_in, rest_api_controller, view_session_controller)
    │   │   ├── logout/ (base_logout, logout_api_controller, logout_web_controller)
    │   │   ├── reset_password_controller.ts
    │   │   ├── send_reset_password_controller.ts
    │   │   └── rest_api_auth_me_controller.ts
    │   ├── factories/ (makeSignInViewController, makeSignApiInController, makeResetPasswordFactory, etc.)
    │   ├── validators/ (sign_in_validator, reset_password_validator, send_reset_password_validator)
    │   ├── i18n/ (pt.json, en.json)
    │   ├── events.ts
    │   └── routes.ts
    └── views/ (login/login_page.vue, reset_password/send_reset_password_link_page.vue, etc.)
```

---

## 3. Endpoints Disponíveis

| Método | Endpoint | Proteção / Middleware | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/security/auth/login` | `middleware.guest()` | Renderiza a página de login Inertia (`login/login_page`) |
| `POST` | `/security/auth/login` | `middleware.guest()` | Autentica sessão web e cria cookie de sessão |
| `POST` | `/security/auth/logout` | `middleware.auth()` | Encerra a sessão web ativa |
| `GET` | `/security/auth/reset/password` | `middleware.guest()` | Renderiza formulário de solicitação de recuperação |
| `POST` | `/security/auth/reset/send-mail` | `middleware.guest()` | Envia link temporário de redefinição de senha por email |
| `GET` | `/security/auth/reset/password/:token`| `middleware.guest()` | Renderiza formulário de nova senha com o token |
| `POST` | `/security/auth/reset/password` | `middleware.guest()` | Altera a senha e invalida o token utilizado |
| `POST` | `/api/security/auth/login` | Livre | Autentica credenciais e retorna Token de Acesso API |
| `POST` | `/api/security/auth/logout` | `middleware.auth({ guards: ['api'] })` | Revoga o Token de Acesso API |
| `GET` | `/api/auth/me` | `middleware.auth({ guards: ['api'] })` | Retorna os dados do usuário autenticado |

---

## 4. Testes Automatizados

O módulo possui testes unitários implementados em `@japa/runner` com isolamento completo usando `sinon`:
- `app/modules/auth/usecases/authenticate_user/authenticate_user_usecase_impl.spec.ts`
- `app/modules/auth/usecases/reset_password/reset_password_usecase_impl.spec.ts`
- `app/modules/auth/usecases/send_reset_password/send_reset_password_usecase_impl.spec.ts`
