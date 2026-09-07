import { Language } from '../types';

export interface SampleProblem {
  title: string;
  text: string;
  tag: string;
}

export interface Translations {
  appName: string;
  appBadge: string;
  tagline: string;
  heroDescription: string;
  problemInputLabel: string;
  problemPlaceholder: string;
  problemHint: string;
  charCount: string;
  resolveButton: string;
  resolvingButton: string;
  orTrySample: string;
  recentResolutions: string;
  savedLocally: string;
  reopen: string;
  newProblem: string;
  history: string;
  modeProfessional: string;
  
  // Pillars
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;

  // Clarification
  clarifyBadge: string;
  clarifyTitle: string;
  clarifyNotice: string;
  whyItMatters: string;
  customPlaceholder: string;
  analyzeWithoutAnswering: string;
  back: string;
  generateCompleteAnalysis: string;
  answeredCountLabel: string;

  // Analysis View
  completeAnalysis: string;
  copyReport: string;
  copied: string;
  print: string;
  tabAll: string;
  tabSolutions: string;
  tabComparison: string;
  tabPlan: string;

  // 10 Dimensions
  sec1Title: string;
  sec2Title: string;
  sec3Title: string;
  sec4Title: string;
  sec5Title: string;
  sec6Title: string;
  sec7Title: string;
  sec7Subtitle: string;
  sec8Title: string;
  sec8Subtitle: string;
  sec9Title: string;
  sec10Title: string;
  sec10Subtitle: string;

  timeframeLabel: string;
  scoreOutOf10: string;
  immediateRisks: string;
  longTermRisks: string;
  worstCaseScenario: string;
  probabilityLabel: string;

  // Solution card
  recommendedTopPick: string;
  recommendedTag: string;
  efficacy: string;
  time: string;
  effort: string;
  cost: string;
  advantages: string;
  cautions: string;
  executionSummary: string;
  lessDetails: string;
  moreDetails: string;
  focusPlan: string;
  rateSolution: string;
  feedbackGiven: string;

  // Recommended spotlight
  whyRecommendedLabel: string;
  criticalSuccessFactors: string;
  commonPitfalls: string;
  viewInPlan: string;

  // Comparison
  comparisonSynthesis: string;
  colSolution: string;
  colEfficacy: string;
  colTime: string;
  colEffort: string;
  colCost: string;
  colStrength: string;
  winnerLabel: string;
  matrixConclusion: string;

  // Action plan
  totalTimeLabel: string;
  actionPlanTitle: string;
  actionPlanSubtitle: string;
  completedOf: string;
  responsibleLabel: string;
  goalLabel: string;
  stepLabel: string;

  // Feedback modal
  feedbackModalTitle: string;
  feedbackModalDesc: string;
  rateUtilityLabel: string;
  outcomeStatusLabel: string;
  outcomeWorked: string;
  outcomePartially: string;
  outcomeFailed: string;
  outcomeNotTested: string;
  whatWorkedLabel: string;
  whatWorkedPlaceholder: string;
  whatFailedLabel: string;
  whatFailedPlaceholder: string;
  generalNotesLabel: string;
  generalNotesPlaceholder: string;
  submitFeedback: string;
  feedbackThanks: string;
  feedbackLearningNotice: string;

  // History modal
  historyModalTitle: string;
  historyModalSubtitle: string;
  historySearchPlaceholder: string;
  emptyHistory: string;
  emptyHistorySub: string;
  noResults: string;
  close: string;
  recommendedSolutionLabel: string;
  deletePrompt: string;

  samples: SampleProblem[];
}

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    appName: 'AI Hub',
    appBadge: 'IA Hub Pro',
    tagline: 'Plataforma Completa de Inteligência Artificial & Resolução Estratégica',
    heroDescription: 'Descreva qualquer desafio pessoal, profissional ou de negócios. A inteligência artificial analisa causas, riscos, gravidade e estrutura cinco soluções completas com plano de ação passo a passo.',
    problemInputLabel: 'Qual problema você quer resolver?',
    problemPlaceholder: 'Exemplo: Nossa equipe de vendas está perdendo leads por demora no tempo de resposta inicial. Os clientes reclamam de espera e o processo de triagem ainda é totalmente manual...',
    problemHint: 'Quanto mais contexto você der, mais preciso será o plano. Se faltarem dados essenciais, faremos perguntas antes.',
    charCount: 'caracteres',
    resolveButton: 'Resolver problema',
    resolvingButton: 'Diagnosticando problema...',
    orTrySample: 'Ou experimente um exemplo prático:',
    recentResolutions: 'Suas Resoluções Recentes',
    savedLocally: 'Salvas localmente no navegador',
    reopen: 'Reabrir',
    newProblem: 'Novo Problema',
    history: 'Histórico',
    modeProfessional: 'Modo Profissional',

    pillar1Title: 'Diagnóstico Completo',
    pillar1Desc: 'Causas-raiz, gravidade, urgência e pessoas afetadas.',
    pillar2Title: '5 Soluções em Cartões',
    pillar2Desc: 'Prós, contras, custo, esforço e tempo estimado.',
    pillar3Title: 'Plano Passo a Passo',
    pillar3Desc: 'Cronograma acionável com tarefas e metas claras.',

    clarifyBadge: 'Refinamento Diagnóstico',
    clarifyTitle: 'Precisamos de alguns detalhes antes da solução',
    clarifyNotice: 'Diretriz AI Hub: Não inventamos dados. Para recomendar a solução mais viável para sua realidade, responda a estas perguntas rápidas ou toque nas sugestões abaixo.',
    whyItMatters: 'Por que importa:',
    customPlaceholder: 'Ou digite sua resposta aqui...',
    analyzeWithoutAnswering: 'Analisar sem responder agora →',
    back: 'Voltar',
    generateCompleteAnalysis: 'Gerar Análise Completa',
    answeredCountLabel: 'respondida',

    completeAnalysis: 'Análise Completa',
    copyReport: 'Copiar Relatório',
    copied: 'Copiado!',
    print: 'Imprimir',
    tabAll: 'Visão Completa',
    tabSolutions: '5 Soluções em Cartões',
    tabComparison: 'Comparação Analítica',
    tabPlan: 'Plano de Ação',

    sec1Title: '1. Resumo do Problema',
    sec2Title: '2. Causas Prováveis Identificadas',
    sec3Title: '3. Gravidade',
    sec4Title: '4. Urgência',
    sec5Title: '5. Pessoas Afetadas',
    sec6Title: '6. Consequências de Não Resolver',
    sec7Title: '7. Cinco Possíveis Soluções',
    sec7Subtitle: 'Apresentadas em cartões detalhados com análise de esforço, custos, prazos e eficácia estimada.',
    sec8Title: '8. Comparação Entre as Soluções',
    sec8Subtitle: 'Quadro comparativo avaliando velocidade, custo, sustentabilidade e impacto.',
    sec9Title: '9. Melhor Solução Recomendada',
    sec10Title: '10. Plano de Ação Passo a Passo',
    sec10Subtitle: 'Cronograma operacional estruturado em fases com tarefas verificáveis e papéis responsáveis.',

    timeframeLabel: 'Prazo',
    scoreOutOf10: 'Score',
    immediateRisks: 'Riscos Imediatos',
    longTermRisks: 'Riscos de Médio/Longo Prazo',
    worstCaseScenario: 'Pior Cenário Possível',
    probabilityLabel: 'Probabilidade',

    recommendedTopPick: 'Melhor Solução Recomendada pelo AI Hub',
    recommendedTag: 'Top Pick',
    efficacy: 'Eficácia',
    time: 'Tempo',
    effort: 'Esforço',
    cost: 'Custo',
    advantages: 'Vantagens',
    cautions: 'Atenção & Limitações',
    executionSummary: 'Execução resumida',
    lessDetails: 'Menos detalhes',
    moreDetails: 'Ver prós/contras completos',
    focusPlan: 'Focar no Plano',
    rateSolution: 'Avaliar Solução',
    feedbackGiven: 'Avaliado',

    whyRecommendedLabel: 'Por que foi recomendada',
    criticalSuccessFactors: 'Fatores Críticos de Sucesso',
    commonPitfalls: 'Armadilhas Comuns a Evitar',
    viewInPlan: 'Ver no Plano de Ação →',

    comparisonSynthesis: 'Síntese Comparativa das 5 Abordagens',
    colSolution: 'Solução',
    colEfficacy: 'Eficácia',
    colTime: 'Prazo',
    colEffort: 'Esforço',
    colCost: 'Custo',
    colStrength: 'Principal Ponto Forte',
    winnerLabel: 'Vencedor',
    matrixConclusion: 'Conclusão do confronto analítico',

    totalTimeLabel: 'Prazo Total',
    actionPlanTitle: 'Roteiro de Execução Passo a Passo',
    actionPlanSubtitle: 'Marque as etapas conforme forem executadas para acompanhar o progresso real.',
    completedOf: 'concluídos de',
    responsibleLabel: 'Responsável',
    goalLabel: 'Meta',
    stepLabel: 'Passo',

    feedbackModalTitle: 'Avaliação da Solução',
    feedbackModalDesc: 'Seu feedback calibra a inteligência do AI Hub para gerar recomendações cada vez mais precisas.',
    rateUtilityLabel: 'Como você avalia a utilidade e viabilidade desta solução?',
    outcomeStatusLabel: 'Status de implementação ou teste:',
    outcomeWorked: 'Funcionou muito bem',
    outcomePartially: 'Funcionou parcialmente',
    outcomeFailed: 'Não funcionou como esperado',
    outcomeNotTested: 'Ainda em planejamento / avaliação',
    whatWorkedLabel: 'O que funcionou bem nesta proposta?',
    whatWorkedPlaceholder: 'Ex: A estimativa de custo foi precisa, passos fáceis de aplicar...',
    whatFailedLabel: 'O que faltou ou não funcionou?',
    whatFailedPlaceholder: 'Ex: Faltou detalhar o tempo com a equipe, resistência interna...',
    generalNotesLabel: 'Sugestões adicionais para a IA:',
    generalNotesPlaceholder: 'Qualquer observação que nos ajude a personalizar soluções para o seu contexto...',
    submitFeedback: 'Salvar Feedback & Ensinar IA',
    feedbackThanks: 'Feedback salvo com sucesso!',
    feedbackLearningNotice: 'As preferências aprendidas serão aplicadas automaticamente às próximas análises.',

    historyModalTitle: 'Histórico de Resoluções',
    historyModalSubtitle: 'problemas diagnosticados e salvos no navegador',
    historySearchPlaceholder: 'Buscar por palavras-chave, soluções ou diagnósticos...',
    emptyHistory: 'Nenhum problema salvo no histórico.',
    emptyHistorySub: 'Os problemas diagnosticados aparecerão aqui automaticamente.',
    noResults: 'Nenhuma resolução encontrada para a busca.',
    close: 'Fechar',
    recommendedSolutionLabel: 'Solução recomendada',
    deletePrompt: 'Remover do histórico',

    samples: [
      {
        title: 'Equipe de vendas perdendo leads por demora',
        text: 'Nossa equipe comercial está perdendo mais de 30% dos leads por causa da demora no primeiro contato. O atendimento inicial ainda é manual e não temos plantão aos fins de semana.',
        tag: 'Vendas & Negócios',
      },
      {
        title: 'Queda de faturamento e custos crescentes',
        text: 'Nossa empresa teve uma queda de 25% no faturamento nos últimos 3 meses, enquanto os custos operacionais subiram 15%, deixando a margem de lucro quase nula.',
        tag: 'Finanças & Gestão',
      },
      {
        title: 'Equipe de tecnologia sobrecarregada',
        text: 'A equipe técnica está operando no limite, falhando em entregas há dois sprints seguidos e enfrentando desmotivação e risco de turnover.',
        tag: 'Liderança & Tech',
      },
      {
        title: 'Dificuldade de foco e procrastinação crônica',
        text: 'Não consigo manter o foco em tarefas estratégicas no dia a dia, acumulando pendências urgentes e sofrendo de esgotamento mental constante.',
        tag: 'Produtividade Pessoal',
      },
    ],
  },

  en: {
    appName: 'AI Hub',
    appBadge: 'AI Hub Pro',
    tagline: 'Complete Artificial Intelligence & Strategic Resolution Platform',
    heroDescription: 'Describe any personal, professional, or business challenge. The AI analyzes root causes, risks, severity, and crafts five actionable solutions with a step-by-step implementation plan.',
    problemInputLabel: 'What problem do you want to resolve?',
    problemPlaceholder: 'Example: Our sales team is losing qualified leads due to slow response times. Inquiries wait up to 24h and our qualification process is entirely manual...',
    problemHint: 'The more context you provide, the sharper the action plan. If essential details are missing, we will ask targeted questions first.',
    charCount: 'characters',
    resolveButton: 'Resolve Problem',
    resolvingButton: 'Diagnosing problem...',
    orTrySample: 'Or try a real-world scenario:',
    recentResolutions: 'Your Recent Resolutions',
    savedLocally: 'Saved locally in your browser',
    reopen: 'Reopen',
    newProblem: 'New Problem',
    history: 'History',
    modeProfessional: 'Professional Mode',

    pillar1Title: 'Complete Diagnosis',
    pillar1Desc: 'Root causes, severity, urgency, and affected stakeholders.',
    pillar2Title: '5 Solution Cards',
    pillar2Desc: 'Pros, cons, cost, effort, and estimated timeframe.',
    pillar3Title: 'Step-by-Step Plan',
    pillar3Desc: 'Actionable phased roadmap with milestones and responsibilities.',

    clarifyBadge: 'Diagnostic Refinement',
    clarifyTitle: 'We need a few details before generating solutions',
    clarifyNotice: 'AI Hub Policy: We do not invent facts. To tailor the most effective solution to your exact reality, answer these quick questions or tap the suggestions below.',
    whyItMatters: 'Why this matters:',
    customPlaceholder: 'Or type your custom answer here...',
    analyzeWithoutAnswering: 'Analyze with current info →',
    back: 'Back',
    generateCompleteAnalysis: 'Generate Complete Analysis',
    answeredCountLabel: 'answered',

    completeAnalysis: 'Complete Analysis',
    copyReport: 'Copy Report',
    copied: 'Copied!',
    print: 'Print',
    tabAll: 'Full Overview',
    tabSolutions: '5 Solution Cards',
    tabComparison: 'Analytical Comparison',
    tabPlan: 'Action Plan',

    sec1Title: '1. Problem Summary',
    sec2Title: '2. Probable Root Causes',
    sec3Title: '3. Severity',
    sec4Title: '4. Urgency',
    sec5Title: '5. Affected Stakeholders',
    sec6Title: '6. Consequences of Inaction',
    sec7Title: '7. Five Viable Solutions',
    sec7Subtitle: 'Presented in modular cards with effort, cost, timeline, and efficacy evaluation.',
    sec8Title: '8. Solution Comparison Matrix',
    sec8Subtitle: 'Comparative assessment across implementation speed, budget, sustainability, and ROI.',
    sec9Title: '9. Best Recommended Solution',
    sec10Title: '10. Step-by-Step Action Plan',
    sec10Subtitle: 'Phased operational roadmap with verifiable milestones, task ownership, and expected outcomes.',

    timeframeLabel: 'Timeframe',
    scoreOutOf10: 'Score',
    immediateRisks: 'Immediate Risks',
    longTermRisks: 'Medium/Long-Term Risks',
    worstCaseScenario: 'Worst-Case Scenario',
    probabilityLabel: 'Probability',

    recommendedTopPick: 'Top Recommendation by AI Hub',
    recommendedTag: 'Top Pick',
    efficacy: 'Efficacy',
    time: 'Time',
    effort: 'Effort',
    cost: 'Cost',
    advantages: 'Advantages',
    cautions: 'Cautions & Limits',
    executionSummary: 'Execution summary',
    lessDetails: 'Less details',
    moreDetails: 'View full pros & cons',
    focusPlan: 'Focus on Plan',
    rateSolution: 'Rate Solution',
    feedbackGiven: 'Rated',

    whyRecommendedLabel: 'Why this was recommended',
    criticalSuccessFactors: 'Critical Success Factors',
    commonPitfalls: 'Pitfalls to Avoid',
    viewInPlan: 'View in Action Plan →',

    comparisonSynthesis: 'Comparative Synthesis of the 5 Options',
    colSolution: 'Solution',
    colEfficacy: 'Efficacy',
    colTime: 'Timeframe',
    colEffort: 'Effort',
    colCost: 'Cost',
    colStrength: 'Key Core Strength',
    winnerLabel: 'Winner',
    matrixConclusion: 'Analytical Verdict',

    totalTimeLabel: 'Total Timeframe',
    actionPlanTitle: 'Step-by-Step Execution Plan',
    actionPlanSubtitle: 'Check off milestones as you execute to monitor tangible progress.',
    completedOf: 'completed of',
    responsibleLabel: 'Owner',
    goalLabel: 'Goal',
    stepLabel: 'Step',

    feedbackModalTitle: 'Solution Feedback & Rating',
    feedbackModalDesc: 'Your feedback directly trains and fine-tunes AI Hub to make future recommendations more accurate for your specific domain.',
    rateUtilityLabel: 'How useful and feasible is this proposed solution?',
    outcomeStatusLabel: 'Implementation status:',
    outcomeWorked: 'Worked very well',
    outcomePartially: 'Worked partially',
    outcomeFailed: 'Did not work as expected',
    outcomeNotTested: 'Still planning / evaluating',
    whatWorkedLabel: 'What worked well in this proposal?',
    whatWorkedPlaceholder: 'E.g., Realistic budget, well-structured rollout steps...',
    whatFailedLabel: 'What was missing or ineffective?',
    whatFailedPlaceholder: 'E.g., Underestimated team capacity, cultural inertia...',
    generalNotesLabel: 'Additional notes to train the AI:',
    generalNotesPlaceholder: 'Any context that helps personalize recommendations for you...',
    submitFeedback: 'Save Feedback & Train AI',
    feedbackThanks: 'Feedback saved successfully!',
    feedbackLearningNotice: 'Your feedback will be automatically factored into subsequent problem analyses.',

    historyModalTitle: 'Problem History',
    historyModalSubtitle: 'analyzed challenges saved in this browser',
    historySearchPlaceholder: 'Search by keywords, solutions, or diagnoses...',
    emptyHistory: 'No problems saved in history yet.',
    emptyHistorySub: 'Analyzed problems will appear here automatically.',
    noResults: 'No resolutions found matching your search.',
    close: 'Close',
    recommendedSolutionLabel: 'Recommended solution',
    deletePrompt: 'Remove from history',

    samples: [
      {
        title: 'Sales team losing leads due to response latency',
        text: 'Our sales team is losing over 30% of incoming inbound leads because first response time exceeds 18 hours. Triage is manual and weekends have zero coverage.',
        tag: 'Sales & Growth',
      },
      {
        title: 'Revenue decline with increasing overhead',
        text: 'Our company has experienced a 25% drop in revenue over the last quarter, while cloud and operational overhead surged by 15%, causing near-zero net margin.',
        tag: 'Finance & Strategy',
      },
      {
        title: 'Engineering team burnout & missed sprints',
        text: 'Our software engineering team is overloaded with technical debt, missing sprint commitments for two consecutive cycles, and showing alarming signs of burnout.',
        tag: 'Tech & Leadership',
      },
      {
        title: 'Chronic procrastination on high-leverage tasks',
        text: 'I constantly delay high-impact strategic work in favor of low-value busywork, leading to backlog pileup, deadline stress, and mental fatigue.',
        tag: 'Personal Productivity',
      },
    ],
  },

  es: {
    appName: 'AI Hub',
    appBadge: 'IA Hub Pro',
    tagline: 'Plataforma Completa de Inteligencia Artificial & Resolución Estratégica',
    heroDescription: 'Describe cualquier desafío personal, profesional o de negocios. La IA analiza causas de raíz, riesgos, gravedad y estructura cinco soluciones prácticas con un plan paso a paso.',
    problemInputLabel: '¿Qué problema quieres resolver?',
    problemPlaceholder: 'Ejemplo: Nuestro equipo comercial pierde clientes potenciales por demoras en responder. Los prospectos esperan horas y la clasificación de leads aún es totalmente manual...',
    problemHint: 'Cuanto más contexto proporciones, más certero será el plan. Si faltan datos clave, te haremos preguntas primero.',
    charCount: 'caracteres',
    resolveButton: 'Resolver problema',
    resolvingButton: 'Diagnosticando problema...',
    orTrySample: 'O prueba un caso práctico:',
    recentResolutions: 'Tus Resoluciones Recientes',
    savedLocally: 'Guardadas localmente en tu navegador',
    reopen: 'Reabrir',
    newProblem: 'Nuevo Problema',
    history: 'Historial',
    modeProfessional: 'Modo Profesional',

    pillar1Title: 'Diagnóstico Completo',
    pillar1Desc: 'Causas raíz, gravedad, urgencia y personas afectadas.',
    pillar2Title: '5 Soluciones en Tarjetas',
    pillar2Desc: 'Pros, contras, costo, esfuerzo y tiempo estimado.',
    pillar3Title: 'Plan Paso a Paso',
    pillar3Desc: 'Cronograma accionable con hitos y responsables claros.',

    clarifyBadge: 'Refinamiento Diagnóstico',
    clarifyTitle: 'Necesitamos algunos detalles antes de la solución',
    clarifyNotice: 'Directriz AI Hub: No inventamos datos. Para recomendar la mejor solución para tu caso real, responde estas breves preguntas o toca las sugerencias.',
    whyItMatters: 'Por qué importa:',
    customPlaceholder: 'O escribe tu respuesta aquí...',
    analyzeWithoutAnswering: 'Analizar con la información actual →',
    back: 'Volver',
    generateCompleteAnalysis: 'Generar Análisis Completo',
    answeredCountLabel: 'respondida',

    completeAnalysis: 'Análisis Completo',
    copyReport: 'Copiar Informe',
    copied: '¡Copiado!',
    print: 'Imprimir',
    tabAll: 'Vista Completa',
    tabSolutions: '5 Soluciones en Tarjetas',
    tabComparison: 'Comparación Analítica',
    tabPlan: 'Plan de Acción',

    sec1Title: '1. Resumen del Problema',
    sec2Title: '2. Causas Probables Identificadas',
    sec3Title: '3. Gravedad',
    sec4Title: '4. Urgencia',
    sec5Title: '5. Personas Afectadas',
    sec6Title: '6. Consecuencias de No Resolver',
    sec7Title: '7. Cinco Posibles Soluciones',
    sec7Subtitle: 'Presentadas en tarjetas con análisis de esfuerzo, costos, plazos y eficacia estimada.',
    sec8Title: '8. Comparación Entre las Soluciones',
    sec8Subtitle: 'Cuadro comparativo evaluando velocidad, costo, sostenibilidad e impacto.',
    sec9Title: '9. Mejor Solución Recomendada',
    sec10Title: '10. Plan de Acción Paso a Paso',
    sec10Subtitle: 'Cronograma operativo estructurado en fases con tareas comprobables y roles responsables.',

    timeframeLabel: 'Plazo',
    scoreOutOf10: 'Puntuación',
    immediateRisks: 'Riesgos Inmediatos',
    longTermRisks: 'Riesgos a Mediano/Largo Plazo',
    worstCaseScenario: 'Peor Escenario Posible',
    probabilityLabel: 'Probabilidad',

    recommendedTopPick: 'Mejor Solución Recomendada por AI Hub',
    recommendedTag: 'Top Pick',
    efficacy: 'Eficacia',
    time: 'Tiempo',
    effort: 'Esfuerzo',
    cost: 'Costo',
    advantages: 'Ventajas',
    cautions: 'Precauciones & Límites',
    executionSummary: 'Ejecución resumida',
    lessDetails: 'Menos detalles',
    moreDetails: 'Ver pros y contras completos',
    focusPlan: 'Enfocar en el Plan',
    rateSolution: 'Evaluar Solución',
    feedbackGiven: 'Evaluado',

    whyRecommendedLabel: 'Por qué fue recomendada',
    criticalSuccessFactors: 'Factores Críticos de Éxito',
    commonPitfalls: 'Errores Comunes a Evitar',
    viewInPlan: 'Ver en el Plan de Acción →',

    comparisonSynthesis: 'Síntesis Comparativa de las 5 Opciones',
    colSolution: 'Solución',
    colEfficacy: 'Eficacia',
    colTime: 'Plazo',
    colEffort: 'Esfuerzo',
    colCost: 'Costo',
    colStrength: 'Punto Fuerte Principal',
    winnerLabel: 'Ganador',
    matrixConclusion: 'Conclusión Analítica',

    totalTimeLabel: 'Plazo Total',
    actionPlanTitle: 'Ruta de Ejecución Paso a Paso',
    actionPlanSubtitle: 'Marca las tareas a medida que las completes para ver el avance real.',
    completedOf: 'completados de',
    responsibleLabel: 'Responsable',
    goalLabel: 'Meta',
    stepLabel: 'Paso',

    feedbackModalTitle: 'Evaluación de la Solución',
    feedbackModalDesc: 'Tu opinión entrena la inteligencia de AI Hub para entregar recomendaciones cada vez más precisas.',
    rateUtilityLabel: '¿Cómo evalúas la utilidad y viabilidad de esta propuesta?',
    outcomeStatusLabel: 'Estado de implementación o prueba:',
    outcomeWorked: 'Funcionó muy bien',
    outcomePartially: 'Funcionó parcialmente',
    outcomeFailed: 'No funcionó como se esperaba',
    outcomeNotTested: 'Aún en planificación / evaluación',
    whatWorkedLabel: '¿Qué funcionó bien en esta propuesta?',
    whatWorkedPlaceholder: 'Ej: Estimación de costos realista, pasos claros...',
    whatFailedLabel: '¿Qué faltó o no fue efectivo?',
    whatFailedPlaceholder: 'Ej: Subestimó la capacitación del equipo...',
    generalNotesLabel: 'Notas adicionales para la IA:',
    generalNotesPlaceholder: 'Cualquier detalle que ayude a personalizar futuras recomendaciones...',
    submitFeedback: 'Guardar Opinión & Entrenar IA',
    feedbackThanks: '¡Comentario guardado con éxito!',
    feedbackLearningNotice: 'Tus preferencias se aplicarán automáticamente a tus próximos análisis.',

    historyModalTitle: 'Historial de Problemas',
    historyModalSubtitle: 'desafíos analizados y guardados en tu navegador',
    historySearchPlaceholder: 'Buscar por palabras clave, diagnósticos o soluciones...',
    emptyHistory: 'No hay problemas guardados en el historial aún.',
    emptyHistorySub: 'Los problemas diagnosticados aparecerán aquí automáticamente.',
    noResults: 'No se encontraron resultados para la búsqueda.',
    close: 'Cerrar',
    recommendedSolutionLabel: 'Solución recomendada',
    deletePrompt: 'Eliminar del historial',

    samples: [
      {
        title: 'Equipo de ventas perdiendo prospectos por demora',
        text: 'Nuestro equipo de ventas pierde más del 30% de los leads debido a la demora en el primer contacto. La atención inicial es manual y no hay cobertura los fines de semana.',
        tag: 'Ventas & Crecimiento',
      },
      {
        title: 'Caída de facturación con costos al alza',
        text: 'Nuestra empresa experimentó una caída del 25% en ingresos en los últimos 3 meses, mientras que los costos operativos subieron un 15%, dejando un margen casi nulo.',
        tag: 'Finanzas & Gestión',
      },
      {
        title: 'Equipo de desarrollo sobrecargado y retrasos',
        text: 'El equipo de tecnología está al límite de su capacidad, acumulando retrasos en dos entregas consecutivas y con síntomas de agotamiento.',
        tag: 'Liderazgo & Tech',
      },
      {
        title: 'Dificultad para concentrarse y postergación',
        text: 'No logro concentrarme en tareas estratégicas en el día a dia, acumulando pendientes urgentes y sufriendo fatiga mental constante.',
        tag: 'Productividad Personal',
      },
    ],
  },
};

/**
 * Detects user language from navigator or returns stored preference
 */
export function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem('resolveai_language') as Language;
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) {
      return saved;
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('en')) return 'en';
  } catch (e) {
    // Fallback
  }
  return 'pt';
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem('resolveai_language', lang);
  } catch (e) {
    console.error('Failed to save language preference', e);
  }
}
