# As 20 Regras Obrigatórias dos Agentes de IA (AI Rules)

> **Status:** `[LEI DE ENGENHARIA / MANDATÓRIO]`  
> Qualquer violação destas regras é considerada uma falha crítica de execução.

---

### REGRA 1 — CONSULTAR O MODULE REGISTRY PRIMEIRO
Antes de qualquer linha de código ou análise avulsa, abra `docs/modules/module-registry.md` para entender o estado e a localização do módulo afetado.

### REGRA 2 — NÃO RELER O PROJETO INTEIRO DESNECESSARIAMENTE
Nunca execute buscas cegas ou leituras em massa de todos os módulos. Expanda o contexto de arquivos estritamente para o módulo alvo e suas dependências diretas.

### REGRA 3 — PROCURAR MÓDULO SEMELHANTE / GOLDEN MODULE
Utilize o [Golden Module](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md) (`admin/settings/acl/roles_management`) como padrão de arquitetura e qualidade para qualquer nova funcionalidade.

### REGRA 4 — CONSULTAR A DOCUMENTAÇÃO ESPECÍFICA DO MÓDULO
Leia `docs/modules/<module-name>.md` para conhecer as entidades, casos de uso, endpoints e decisões técnicas já tomadas antes de intervir no código.

### REGRA 5 — VERIFICAR O `package.json`
Antes de importar qualquer pacote ou utilizar recursos avançados, confirme se o pacote está listado em `dependencies` ou `devDependencies`.

### REGRA 6 — VERIFICAR A VERSÃO INSTALADA
Confirme a versão exata do pacote instalado no `package.json` ou `package-lock.json`/`yarn.lock` (ex: AdonisJS v6, não v5).

### REGRA 7 — CONSULTAR A DOCUMENTAÇÃO OFICIAL DA DEPENDÊNCIA
Antes de escrever código que utilize uma biblioteca, consulte a documentação oficial da versão instalada via Context7, documentação oficial ou definições de tipo TypeScript (`.d.ts`).

### REGRA 8 — NUNCA INVENTAR APIs
É estritamente proibido inventar métodos, classes, parâmetros, opções de configuração, decorators ou assinaturas não existentes na versão instalada.

### REGRA 9 — RESPEITAR A CLEAN ARCHITECTURE E LIMITES DE CAMADA
- O Domínio (`domain/`) não importa Framework nem Banco de Dados.
- Os Casos de Uso (`usecases/`) dependem apenas de portas abstratas (`ports/`).
- O Framework (`framework/`) implementa os adaptadores e controladores.

### REGRA 10 — REUTILIZAR PADRÕES ESTABELECIDOS
Use sempre:
- `Either<Left, Right>` para retornos de usecase.
- `Result<DomainError>` para erros de negócio.
- `Mapper` para conversão entre Domínio e Lucid/Mongo.
- `routeAdapter` com `ControllerMetaData` para rotas HTTP.
- VineJS para validações de payload.

### REGRA 11 — NÃO DUPLICAR CÓDIGO
Reutilize modelos, adaptadores e contratos existentes em `@core` e `shared`.

### REGRA 12 — NÃO CRIAR ABSTRAÇÕES DESNECESSÁRIAS
Mantenha o código focado, direto e alinhado aos padrões existentes. Não crie camadas de indireção que não tenham propósito arquitetural claro.

### REGRA 13 — NÃO ALTERAR MÓDULOS NÃO RELACIONADOS
Mantenha as alterações estritamente contidas no escopo da tarefa solicitada.

### REGRA 14 — NÃO ADICIONAR DEPENDÊNCIAS SEM JUSTIFICAR
Não instale novos pacotes npm se o problema puder ser resolvido com as ferramentas já instaladas no projeto. Se uma nova dependência for indispensável, justifique-a formalmente.

### REGRA 15 — NÃO IGNORAR TESTES AUTOMATIZADOS
Todo caso de uso novo ou alterado DEVE possuir teste unitário correspondente (`*.spec.ts`) usando Japa e Sinon, cobrindo o caminho feliz e todos os ramos de erro.

### REGRA 16 — NÃO IGNORAR SEGURANÇA
Nunca exponha senhas ou dados sensíveis em responses, use hashes criptográficos (Scrypt) e aplique sanitização/validação com VineJS.

### REGRA 17 — NÃO IGNORAR AUTORIZAÇÃO (ACL)
Toda rota administrativa deve ser protegida por `middleware.auth()` e `middleware.can('<permission-slug>')`.

### REGRA 18 — NÃO IGNORAR O ISOLAMENTO DE USUÁRIO / TENANT
Certifique-se de que queries e mutações respeitem o `userId` ou escopo de acesso do usuário autenticado.

### REGRA 19 — APRESENTAR PLANO ANTES DE GRANDES ALTERAÇÕES
Para alterações arquiteturais, criação de módulos ou refatorações, apresente um plano técnico estruturado e obtenha aprovação antes de executar.

### REGRA 20 — ATUALIZAR A DOCUMENTAÇÃO E O MODULE REGISTRY
Sempre que implementar, modificar ou concluir um módulo, atualize imediatamente a documentação em `docs/modules/` e o [Module Registry](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md). Código e documentação nunca devem divergir.
