# Checklist de Revisão de Código (Code Review Guide)

> **Status:** `[NORMATIVO]`  
> **Uso:** Obrigatório para validação de Pull Requests, auditoria de código e aprovação de alterações propostas por Agentes de IA.

---

## 1. Arquitetura e Limites de Camada (Clean Architecture)

- [ ] **Independência do Domínio:** A pasta `domain/` está livre de qualquer importação de `@adonisjs/*`, `lucid`, `express` ou decorators de framework?
- [ ] **Isolamento do Caso de Uso:** O usecase depende exclusivamente de interfaces dentro de `ports/` e não de classes concretas de repositório?
- [ ] **Tratamento com Either:** O caso de uso retorna `Promise<Either<Errors, Data>>` em vez de lançar exceções genéricas?
- [ ] **Mappers Dedicados:** A conversão entre Domínio e Model de Banco ocorre dentro de uma classe `Mapper`?
- [ ] **Fábricas de Composição:** Os controllers são instanciados em factories (`framework/main/factories/`) onde todas as dependências são resolvidas manualmente?

---

## 2. Qualidade de Código e TypeScript

- [ ] **Tipagem Estrita:** Não foram introduzidos tipos `any` injustificados?
- [ ] **Namespaces de UseCase:** O contrato do usecase segue o padrão `Input`, `Output`, `Errors`, `Contract`?
- [ ] **Erros Estruturados:** Todos os erros de domínio estendem `Result<DomainError>` com chave i18n?
- [ ] **Sem Duplicação (DRY):** Utilizou os utilitários de `@core` e `shared` em vez de reimplementar funções comuns?
- [ ] **Validação com Linter:** O comando `npm run lint` executa sem erros ou warnings?
- [ ] **Typecheck:** O comando `npm run typecheck` executa sem falhas de tipo?

---

## 3. Banco de Dados e Persistência

- [ ] **Prefixo de Tabela:** O nome da tabela possui o prefixo do módulo (ex: `core_...` ou `crm_...`)?
- [ ] **Chave Primária UUID:** A chave primária é `varchar(36)` gerada por `UniqueEntityID`?
- [ ] **Colunas de Auditoria:** A migration inclui `created_at`, `updated_at` e `deleted_at`?
- [ ] **Transações ACID:** Operações com mutação em múltiplas tabelas utilizam `TransactionAdapter`?
- [ ] **Prevenção de N+1:** Relacionamentos no Lucid utilizam `preload()` adequado?

---

## 4. Segurança e Autorização

- [ ] **Proteção de Rota:** A rota possui `middleware.auth()` e `middleware.can(...)` se exigir privilégios administrativos?
- [ ] **Validação de Entrada:** Os dados da requisição são validados e sanitizados com esquema VineJS?
- [ ] **Proteção Contra Força Bruta:** Endpoints críticos de autenticação utilizam `limiter`?
- [ ] **Dados Sensíveis:** Senhas e tokens estão marcados com `serializeAs: null` e protegidos contra vazamento em logs?
- [ ] **Metadados Sentry:** A rota possui `operation` e `description` configurados no `routeAdapter`?

---

## 5. Testes Automatizados

- [ ] **Cobertura Unitária:** Existem testes unitários cobrindo o caminho de sucesso e todos os ramos de erro do usecase?
- [ ] **Isolamento com Stubs:** Os testes unitários utilizam Sinon stubs sem acoplar ao banco de dados real?
- [ ] **Sucesso dos Testes:** Todos os testes passam ao executar `npm test`?

---

## 6. Documentação e Memória do Projeto

- [ ] **Documentação do Módulo:** O arquivo `docs/modules/<module-name>.md` foi criado ou atualizado?
- [ ] **Module Registry:** O status do módulo foi atualizado em [docs/modules/module-registry.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md)?
- [ ] **Dependency Map:** Se novas integrações inter-módulos foram criadas, o diagrama em [docs/architecture/dependency-map.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/dependency-map.md) foi atualizado?
