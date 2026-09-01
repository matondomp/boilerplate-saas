# Módulo `Addons::Diagnostic` (Módulo 03 — Diagnóstico e Avaliação Inicial)

## 📌 Visão Geral
O Módulo 03 permite que alunos vinculados a um `PreparationGoal` (Módulo 02) realizem diagnósticos de avaliação inicial para identificar evidências sobre seu nível atual de conhecimento por disciplina e tópico.

## 🏗️ Arquitetura & Entidades
- **`DiagnosticAssessmentEntity`**: Configuração do diagnóstico (Título, Duração em Minutos, Quantidade de Questões, Status `ACTIVE/DRAFT`).
- **`DiagnosticAttemptEntity`**: Tentativa realizada pelo aluno com controle estrito de estado (`IN_PROGRESS`, `COMPLETED`, `ABANDONED`, `TIME_EXPIRED`).
- **`DiagnosticQuestionSelectionEntity`**: Seleção inteligente e fixa de questões pré-calculada no início da tentativa.
- **`DiagnosticAnswerEntity`**: Resposta salva imediatamente após a escolha com validação backend-side de acerto/erro.
- **`DiagnosticResultEntity`**: Resultado final calculado com métricas globais (Score 0-20, percentual), por disciplina, por tópico e vetor de evidências para o Módulo 04.

## 🛡️ Segurança & Regras de Negócio
1. **Sem Retorno:** O backend impede que o aluno retorne para questões anteriores (`positionOrder`).
2. **Sem Revelação:** Gabarito e explicações didáticas só são visíveis após a conclusão.
3. **Timer Temporal:** Validação estrita do tempo decorrido no servidor.
4. **Histórico Imutável:** Tentativas e resultados são gravados como registros históricos.
