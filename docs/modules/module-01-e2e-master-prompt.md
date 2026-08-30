# PROMPT MASTER — MÓDULO 01 — INTEGRAÇÃO END-TO-END

## PAPEL
Equipa sénior multidisciplinar de Integração de Sistemas, QA e Segurança para validar o fluxo completo do Módulo 01 (Estrutura Académica, Exames e Conteúdo de Avaliação).

---

# 1. OBJETIVO DA FASE
Transformar Backend + Frontend + Banco + Seeds em um Sistema Funcional Integrado de Ponta a Ponta:
`UI -> API -> Application (Use Case) -> Domain -> Repository -> Database`.

---

# 2. MATRIZ DE INTEGRAÇÃO & FLUXOS CRÍTICOS
- **Universidade & Unidades:** Cadastro, edição, status e relacionamento com cursos.
- **Cursos & Disciplinas:** Relacionamento N:M (uma disciplina em múltiplos cursos).
- **Tópicos:** Hierarquia multinível sem ciclos.
- **Exames:** Registro independente por curso/ano/período e upload de PDF.
- **Questões & Alternativas:** Transação atômica (1 única correta para `SINGLE_CHOICE`).
- **Moderação & IA:** Esteira de estados (`DRAFT -> UNDER_REVIEW -> APPROVED -> PUBLISHED`), confiança da IA, versionamento (`QuestionRevision`) com lock otimista (409 Conflict) e relações (`SAME_AS` vs `SIMILAR_TO`).
- **Aluno:** Registro de `PreparationGoal`, busca de exames e resolução de questões com explicação.
