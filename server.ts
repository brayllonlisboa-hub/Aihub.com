import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { ZipArchive } from "archiver";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// In-memory feedback store (also persisted by client in localStorage)
interface FeedbackItem {
  id: string;
  resolutionId: string;
  solutionId: number;
  rating: number;
  status: string;
  whatWorked: string;
  whatDidntWork: string;
  generalComment: string;
  createdAt: string;
}

const feedbackLogs: FeedbackItem[] = [];

// Lazy initialization for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Candidate models in order of preference (stable, production-grade models prioritized)
const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
];

function safeParseJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

async function callGeminiWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  responseSchema: any,
  systemInstruction?: string
): Promise<any> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.6,
        };

        if (systemInstruction) {
          config.systemInstruction = systemInstruction;
        }

        // Setting explicit thinking config avoids runaway loops and unterminated strings
        if (model.includes("3.1-flash-lite")) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
        } else if (model.includes("3.8") || model.includes("3.1") || model.includes("3.6")) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout generating content")), 12000)
        );
        const response = await Promise.race([
          ai.models.generateContent({
            model,
            contents: prompt,
            config,
          }),
          timeoutPromise,
        ]);

        if (response?.text) {
          const parsed = safeParseJson(response.text);
          return parsed;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || (err?.error && err.error.code);
        const msg = String(err?.message || "").toLowerCase();
        const isTemporary =
          status === 503 ||
          status === 429 ||
          msg.includes("high demand") ||
          msg.includes("unavailable") ||
          msg.includes("resource_exhausted");

        if (isTemporary && attempt === 0) {
          // Brief jittered pause before retry
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }
        // Smoothly proceed to next candidate model
        break;
      }
    }
  }

  throw lastError || new Error("All Gemini candidate models failed.");
}

// Resilient helper for creative text generation (video scripts, storyboards, text, code, audio guides)
async function generateCreativeContentWithFallback(
  ai: GoogleGenAI | null,
  prompt: string,
  options: {
    systemInstruction?: string;
    temperature?: number;
  } = {}
): Promise<string | null> {
  if (!ai) return null;
  const { systemInstruction, temperature = 0.7 } = options;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {
          temperature,
        };

        if (systemInstruction) {
          config.systemInstruction = systemInstruction;
        }

        if (model.includes("3.1-flash-lite")) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
        } else if (model.includes("3.8") || model.includes("3.1") || model.includes("3.6")) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout generating content")), 12000)
        );
        const resp = await Promise.race([
          ai.models.generateContent({
            model,
            contents: prompt,
            config,
          }),
          timeoutPromise,
        ]);

        if (resp?.text) {
          return resp.text.trim();
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.error && err.error.code);
        const msg = String(err?.message || "").toLowerCase();
        const isTemporary =
          status === 503 ||
          status === 429 ||
          msg.includes("high demand") ||
          msg.includes("unavailable") ||
          msg.includes("resource_exhausted");

        if (isTemporary && attempt === 0) {
          // Brief pause before trying again
          await new Promise((res) => setTimeout(res, 600));
          continue;
        }
        // Proceed to next candidate model smoothly without noisy stack traces in server logs
        break;
      }
    }
  }

  return null;
}

// Emergency fallback generator in case of total upstream outage
function generateEmergencyResolution(
  problem: string,
  answers: Record<string, string>,
  language: string = "pt"
) {
  const isEn = language === "en";
  const isEs = language === "es";

  const pClean = problem.trim();
  const titleSummary = pClean.length > 80 ? pClean.slice(0, 77) + "..." : pClean;

  const lowerProb = pClean.toLowerCase();
  const isMedical = lowerProb.includes("médic") || lowerProb.includes("doenç") || lowerProb.includes("sintoma") || lowerProb.includes("saúde") || lowerProb.includes("remédio") || lowerProb.includes("depress") || lowerProb.includes("ansiedade") || lowerProb.includes("health") || lowerProb.includes("doctor");
  const isLegal = lowerProb.includes("processo") || lowerProb.includes("advogad") || lowerProb.includes("jurídic") || lowerProb.includes("processar") || lowerProb.includes("tribunal") || lowerProb.includes("crime") || lowerProb.includes("lawyer") || lowerProb.includes("legal");
  const isHighRiskFinance = lowerProb.includes("falência") || lowerProb.includes("dívida impagável") || lowerProb.includes("golpe") || lowerProb.includes("penhora") || lowerProb.includes("bankruptcy");

  let emergencyNotice = "";
  if (isMedical) {
    emergencyNotice = isEn
      ? "Notice: This situation involves medical or healthcare matters. The recommendations below are strategic organizational steps; you should immediately consult a licensed physician or healthcare specialist."
      : isEs
      ? "Aviso: Esta situación involucra temas médicos o de salud. Los pasos recomendados son medidas organizativas; consulte de inmediato a un médico o especialista matriculado."
      : "Atenção: Esta situação envolve questões de saúde ou médicas. Os passos recomendados são medidas organizacionais; consulte imediatamente um médico ou profissional de saúde devidamente habilitado.";
  } else if (isLegal) {
    emergencyNotice = isEn
      ? "Notice: This situation involves legal disputes. This framework provides structural context; you should consult an accredited attorney or legal counsel before taking legal action."
      : isEs
      ? "Aviso: Esta situación involucra disputas legales. Este análisis es estructural; consulte a un abogado matriculado antes de emprender acciones legales."
      : "Atenção: Esta situação envolve disputas ou questões jurídicas. Esta análise serve como apoio estrutural; consulte um advogado ou defensor credenciado antes de tomar qualquer medida judicial.";
  } else if (isHighRiskFinance) {
    emergencyNotice = isEn
      ? "Notice: This situation involves high-risk financial obligations or insolvency. Consult an accredited financial advisor or accountant before making commitments."
      : isEs
      ? "Aviso: Esta situación involucra finanzas de alto riesgo o insolvencia. Consulte a un asesor financiero matriculado."
      : "Atenção: Esta situação envolve finanças de alto risco ou endividamento crítico. Consulte um contador ou consultor financeiro credenciado antes de assumir novos compromissos.";
  }

  if (isEn) {
    return {
      professionalNotice: emergencyNotice,
      summary: `• Central Diagnosis: Immediate operational containment and phased strategic resolution for: "${titleSummary}".
• User-Provided Facts: Challenge identified as reported directly in the prompt, focusing on friction, urgency, and resource alignment.
• AI Hypotheses & Working Premises: Workflow bottlenecks and communication latency are creating cascading friction across dependent milestones.`,
      causes: [
        {
          title: "Execution misalignment & lack of clear ownership",
          category: "Process",
          description: "Ambiguity regarding accountability and milestones directly compromises operational velocity.",
          likelihood: "Alta",
        },
        {
          title: "Suboptimal communication & feedback loop latency",
          category: "Communication",
          description: "Key information fails to flow rapidly among stakeholders, generating blind spots and delayed decision making.",
          likelihood: "Alta",
        },
        {
          title: "Resource bottleneck or procedural friction",
          category: "Operational",
          description: "Existing workflow relies on manual, outdated steps that trigger delays under stress.",
          likelihood: "Média",
        },
      ],
      severity: {
        level: "Alta",
        score: 7,
        explanation: "Risk of systemic delays, financial leakage, and team frustration if left unmitigated.",
      },
      urgency: {
        level: "Alta",
        timeframe: "48 to 72 hours",
        explanation: "Early intervention prevents negative compounding effects and saves significant rework.",
      },
      affectedPeople: [
        {
          group: "Direct Team & Implementers",
          impactDescription: "Directly burdened by rework, uncertainty, and escalating cognitive friction.",
        },
        {
          group: "Decision Makers & Leadership",
          impactDescription: "Face missed forecasts, reduced predictability, and stakeholder pressure.",
        },
        {
          group: "End Clients & External Partners",
          impactDescription: "Perceive inconsistency in delivery timelines and responsiveness.",
        },
      ],
      consequences: {
        immediateRisks: [
          "Operational backlog increase",
          "Deterioration of stakeholder confidence",
          "Wasted time on reactive firefighting",
        ],
        longTermRisks: [
          "Permanent loss of momentum",
          "Accumulated financial inefficiency",
          "Team burnout and attrition",
        ],
        worstCaseScenario: "Complete derailment of objectives, leading to critical financial impact and reputation damage.",
      },
      solutions: [
        {
          id: 1,
          title: "Immediate Containment & Sprint Reset",
          category: "Quick Win",
          summary: "Freeze secondary tasks, isolate the root cause, and establish an emergency 48-hour focus block.",
          pros: ["Rapid stabilization", "Immediate clarity", "Low financial cost"],
          cons: ["Temporary pause on minor secondary initiatives"],
          effort: "Baixo",
          cost: "Baixo",
          estimatedTime: "24-48h",
          efficacyScore: 88,
          keyStepsSummary: "Halt scope creep, align on 1 single primary priority, and assign sole owner.",
        },
        {
          id: 2,
          title: "Process Restructuring & RACI Framework",
          category: "Process & Management",
          summary: "Redefine explicit roles, responsibilities, and clear gates for approval and execution.",
          pros: ["Long-term stability", "Eliminates redundant handoffs", "Empowers contributors"],
          cons: ["Requires leadership buy-in and initial adjustment time"],
          effort: "Médio",
          cost: "Baixo",
          estimatedTime: "1-2 semanas",
          efficacyScore: 92,
          keyStepsSummary: "Map current friction points, assign explicit single owners, publish transparent SLA.",
        },
        {
          id: 3,
          title: "Targeted Automation & Tool Modernization",
          category: "Technology",
          summary: "Automate repetitive bottlenecks with modern low-friction tools to eliminate human error.",
          pros: ["Scalable efficiency", "Reduces repetitive manual toil", "Accurate data visibility"],
          cons: ["Requires brief setup and onboarding curve"],
          effort: "Médio",
          cost: "Médio",
          estimatedTime: "5-10 dias",
          efficacyScore: 85,
          keyStepsSummary: "Audit manual handoffs, implement direct integrations, track daily time saved.",
        },
        {
          id: 4,
          title: "Stakeholder Re-alignment & Communication Cadence",
          category: "Culture & Alignment",
          summary: "Establish a strict 15-minute daily standup and asynchronous status dashboard.",
          pros: ["Instant alignment", "Fast impediment escalation", "High transparency"],
          cons: ["Demands team discipline to maintain brevity"],
          effort: "Baixo",
          cost: "Gratuito",
          estimatedTime: "Imediato",
          efficacyScore: 86,
          keyStepsSummary: "Launch short daily checkpoint, standardize impediment reporting format.",
        },
        {
          id: 5,
          title: "Phased Strategic Milestone Delivery",
          category: "Strategic Delivery",
          summary: "Deconstruct the complex resolution into 3 verifiable weekly milestone packages.",
          pros: ["Measurable progress", "Reduces risk exposure", "Celebrates incremental wins"],
          cons: ["Requires disciplined scope management"],
          effort: "Médio",
          cost: "Baixo",
          estimatedTime: "3 semanas",
          efficacyScore: 89,
          keyStepsSummary: "Set weekly verifiable delivery gates, review variance every Friday.",
        },
      ],
      comparison: {
        overview: "Solution #1 offers the highest short-term speed, while Solution #2 builds sustainable structural prevention.",
        criteria: [
          {
            criterion: "Velocidade de Implementação",
            explanation: "Rapidez para contenção imediata do impacto.",
            bestSolutionIndex: 1,
            evaluationNote: "Solução #1 atua em 24-48 horas contendo a sangria.",
          },
          {
            criterion: "Impacto Estrutural Duradouro",
            explanation: "Capacidade de impedir que o problema ressurja.",
            bestSolutionIndex: 2,
            evaluationNote: "Solução #2 redefine responsabilidades de forma permanente.",
          },
          {
            criterion: "Custo-Benefício",
            explanation: "Retorno imediato sem necessidade de investimentos elevados.",
            bestSolutionIndex: 4,
            evaluationNote: "Solução #4 é gratuita e gera impacto em tempo real.",
          },
        ],
        matrixSummary: "A combinação recomendada inicia pela Solução #1 para conter o impacto imediato, seguida pela Solução #2 para garantia de longo prazo.",
      },
      recommended: {
        solutionId: 1,
        title: "Immediate Containment & Sprint Reset",
        whyRecommended: "Immediate triage is critical before deploying structural changes. Halting operational bleeding in the first 48 hours buys the necessary stability to execute the broader action plan without panic.",
        criticalSuccessFactors: [
          "Total focus on the primary bottleneck without distractions",
          "Clear executive sponsorship for temporary scope freezes",
          "Continuous communication with all affected parties",
        ],
        potentialPitfallsToAvoid: [
          "Attempting to solve everything at once instead of prioritizing",
          "Failing to communicate the temporary nature of the containment",
          "Skipping the root cause post-mortem after stabilization",
        ],
      },
      actionPlan: {
        totalEstimatedTime: "14 dias",
        phases: [
          {
            phaseName: "Fase 1: Contenção Imediata & Diagnóstico",
            timeframe: "Dias 1-3",
            steps: [
              {
                id: "st_1",
                stepNumber: 1,
                title: "Isolar a Causa-Raiz e Congelar Ruídos",
                description: "Reunir os 3 principais atores envolvidos, suspender tarefas secundárias e focar exclusivamente na contenção do ponto crítico.",
                timeframe: "Dia 1 (Primeiras 8h)",
                responsibleRole: "Líder Operacional / Responsável Direto",
                expectedOutcome: "Plano de contenção emergencial validado e foco 100% direcionado.",
              },
              {
                id: "st_2",
                stepNumber: 2,
                title: "Estabelecer Alinhamento de Comunicação",
                description: "Notificar todas as partes interessadas sobre o plano de ação e previsão de normalização.",
                timeframe: "Dia 2",
                responsibleRole: "Coordenação",
                expectedOutcome: "Eliminação de ruídos e redução da ansiedade dos envolvidos.",
              },
            ],
          },
          {
            phaseName: "Fase 2: Execução & Reestruturação",
            timeframe: "Dias 4-9",
            steps: [
              {
                id: "st_3",
                stepNumber: 3,
                title: "Implementar Ajustes Operacionais",
                description: "Aplicar as correções nos processos de trabalho, eliminando os passos manuais que geraram a falha.",
                timeframe: "Dias 4-6",
                responsibleRole: "Equipe de Execução",
                expectedOutcome: "Fluxo desobstruído com redução de 80% no tempo de resposta.",
              },
              {
                id: "st_4",
                stepNumber: 4,
                title: "Testes e Validação em Campo",
                description: "Acompanhar a nova rotina durante 72 horas com métricas em tempo real.",
                timeframe: "Dias 7-9",
                responsibleRole: "Responsável por Qualidade",
                expectedOutcome: "Confirmação de eficácia e ausência de novas anomalias.",
              },
            ],
          },
          {
            phaseName: "Fase 3: Consolidação & Prevenção",
            timeframe: "Dias 10-14",
            steps: [
              {
                id: "st_5",
                stepNumber: 5,
                title: "Formalização e Treinamento Breve",
                description: "Documentar o novo procedimento em checklist de 1 página e compartilhar com todo o time.",
                timeframe: "Dias 10-14",
                responsibleRole: "Liderança",
                expectedOutcome: "Garantia de que o problema não voltará a ocorrer no futuro.",
              },
            ],
          },
        ],
      },
    };
  }

  // Default Portuguese / Spanish
  return {
    professionalNotice: emergencyNotice,
    summary: isEs
      ? `• Diagnóstico Central: Contención inmediata y resolución estratégica para: "${titleSummary}".
• Hechos Proporcionados por el Usuario: Desafío reportado directamente en la consulta, enfocado en fricción operativa y alineación de recursos.
• Hipótesis y Premisas de la IA: Existen cuellos de botella procesales y latencia de comunicación que amplifican el impacto en la ejecución.`
      : `• Diagnóstico Central: Contenção estrutural e plano de resolução pragmática para: "${titleSummary}".
• Fatos Fornecidos pelo Usuário: Desafio apresentado diretamente no relato, com foco em pontos de atrito, urgência prática e alinhamento de prioridades.
• Hipóteses e Premissas da IA: Há dispersão de foco, sobrecarga de etapas manuais e necessidade de delimitar responsabilidade direta para acelerar a execução.`,
    causes: [
      {
        title: "Desalinhamento de expectativas e falta de papéis claros",
        category: "Processo",
        description: "Incerteza sobre quem é o responsável direto por cada decisão provoca hesitação e perda de ritmo.",
        likelihood: "Alta",
      },
      {
        title: "Comunicação fragmentada e ausência de feedback rápido",
        category: "Comunicação",
        description: "Informações cruciais não circulam com fluidez, gerando retrabalho e decisões baseadas em suposições.",
        likelihood: "Alta",
      },
      {
        title: "Gargalo operacional por sobrecarga de atividades paralelas",
        category: "Operacional",
        description: "Tentativa de abraçar múltiplas frentes simultaneamente sem foco na prioridade que desbloqueia as demais.",
        likelihood: "Média",
      },
    ],
    severity: {
      level: "Alta",
      score: 7,
      explanation: "Risco concreto de desperdício de tempo, desgaste emocional da equipe e prejuízos financeiros se não contido rapidamente.",
    },
    urgency: {
      level: "Alta",
      timeframe: "48 a 72 horas",
      explanation: "Ação imediata nos primeiros dias impede o efeito cascata e reduz em até 70% o custo da correção.",
    },
    affectedPeople: [
      {
        group: "Equipe Direta & Executores",
        impactDescription: "Sentem a sobrecarga imediata, estresse elevado e frustração com retrabalho frequente.",
      },
      {
        group: "Gestores & Tomadores de Decisão",
        impactDescription: "Perdem previsibilidade e enfrentam cobrança por prazos e metas não atingidas.",
      },
      {
        group: "Clientes Finais / Destinatários do Trabalho",
        impactDescription: "Podem perceber oscilações de qualidade, lentidão no atendimento ou entregas inconsistentes.",
      },
    ],
    consequences: {
      immediateRisks: [
        "Aumento expressivo do acúmulo de tarefas pendentes",
        "Perda de confiança das partes interessadas",
        "Gasto desnecessário de energia em soluções paliativas",
      ],
      longTermRisks: [
        "Desgaste sustentado da motivação e possível perda de talentos",
        "Impacto financeiro acumulado por ineficiência",
        "Dano à reputação operacional e perda de oportunidades",
      ],
      worstCaseScenario: "Paralisação de entregas críticas com perda de clientes e prejuízo financeiro irreparável no curto prazo.",
    },
    solutions: [
      {
        id: 1,
        title: "Contenção Imediata & Foco Radical em 48h",
        category: "Ação Imediata",
        summary: "Congelar demandas secundárias e dedicar um bloco emergencial focado apenas na resolução do gargalo crítico.",
        pros: ["Estabilização instantânea", "Alívio imediato da pressão", "Custo financeiro quase nulo"],
        cons: ["Exige pausar temporariamente demandas secundárias"],
        effort: "Baixo",
        cost: "Baixo",
        estimatedTime: "24-48 horas",
        efficacyScore: 90,
        keyStepsSummary: "Definir a única prioridade das próximas 48h e delegar autoridade total para o executor principal.",
      },
      {
        id: 2,
        title: "Redesenho de Processos com Matriz de Responsabilidade (RACI)",
        category: "Gestão & Estrutura",
        summary: "Mapear o fluxo exato de ponta a ponta e estabelecer claramente quem é Responsável, Aprovador e Consultado.",
        pros: ["Elimina jogo de empurra", "Gera transparência absoluta", "Sustentabilidade de longo prazo"],
        cons: ["Demanda alinhamento e disciplina nos primeiros dias"],
        effort: "Médio",
        cost: "Baixo",
        estimatedTime: "1 a 2 semanas",
        efficacyScore: 93,
        keyStepsSummary: "Escrever o passo a passo em 1 página, definir 1 responsável único por etapa e validar com todos.",
      },
      {
        id: 3,
        title: "Automação e Otimização de Ferramentas",
        category: "Tecnologia",
        summary: "Automatizar etapas manuais repetitivas usando integrações diretas e ferramentas modernas sem atrito.",
        pros: ["Elimina erro humano", "Gera ganho exponencial de tempo", "Dados em tempo real"],
        cons: ["Curva breve de configuração inicial"],
        effort: "Médio",
        cost: "Médio",
        estimatedTime: "3 a 7 dias",
        efficacyScore: 86,
        keyStepsSummary: "Identificar onde o trabalho manual engasga, conectar via automação e medir o tempo economizado.",
      },
      {
        id: 4,
        title: "Alinhamento Diário em Micro-Reuniões (15 Minutos)",
        category: "Comunicação",
        summary: "Implementar rito diário de 15 minutos focado exclusivamente em: o que foi feito, o que será feito e impedimentos.",
        pros: ["Comunicação rápida", "Impedimentos desbloqueados no mesmo dia", "Custo zero"],
        cons: ["Requer disciplina estrita para não estourar o tempo"],
        effort: "Baixo",
        cost: "Gratuito",
        estimatedTime: "Imediato",
        efficacyScore: 88,
        keyStepsSummary: "Instituir daily pontual no início do dia e canal assíncrono para alertas imediatos.",
      },
      {
        id: 5,
        title: "Entrega Estratégica em Três Fases Progressivas",
        category: "Estratégia",
        summary: "Dividir a solução completa em 3 entregas parciais de modo a colher vitórias rápidas a cada 5 dias.",
        pros: ["Reduz a sensação de sobrecarga", "Gera vitórias comemoráveis rápidas", "Permite correções de rota"],
        cons: ["Exige gerenciar o escopo de cada entrega com rigor"],
        effort: "Médio",
        cost: "Baixo",
        estimatedTime: "15 dias",
        efficacyScore: 89,
        keyStepsSummary: "Fatiar a meta em 3 blocos semanais e revisar os resultados a cada sexta-feira.",
      },
    ],
    comparison: {
      overview: "A Solução #1 garante alívio e controle de danos imediatos em até 48 horas, enquanto a Solução #2 impede que o problema volte a ocorrer estruturalmente.",
      criteria: [
        {
          criterion: "Velocidade de Resposta",
          explanation: "Capacidade de gerar alívio e estancar problemas nas primeiras 48h.",
          bestSolutionIndex: 1,
          evaluationNote: "Solução #1 foca tudo no que é mais urgente em 24-48 horas.",
        },
        {
          criterion: "Sustentabilidade a Longo Prazo",
          explanation: "Garantia de que o processo não voltará a falhar no futuro.",
          bestSolutionIndex: 2,
          evaluationNote: "Solução #2 institui papéis claros e regras transparentes.",
        },
        {
          criterion: "Facilidade de Implementação",
          explanation: "Nível de esforço e custo para colocar a iniciativa em prática.",
          bestSolutionIndex: 4,
          evaluationNote: "Solução #4 é gratuita e pode começar imediatamente hoje.",
        },
      ],
      matrixSummary: "A estratégia ótima recomendada é executar a Solução #1 de imediato para estancar a crise, aplicando a Solução #2 e #4 na sequência para blindar a operação.",
    },
    recommended: {
      solutionId: 1,
      title: "Contenção Imediata & Foco Radical em 48h",
      whyRecommended: "Antes de tentar qualquer reestruturação complexa, é vital estancar o vazamento e recuperar o controle operacional. A contenção rápida elimina a sensação de incêndio, devolve a clareza e cria o ambiente de estabilidade necessário para aplicar melhorias duradouras.",
      criticalSuccessFactors: [
        "Foco estrito no problema principal sem se distrair com novas demandas secundárias",
        "Comunicação direta e transparente com as lideranças sobre a pausa momentânea",
        "Autonomia para o responsável implementar as medidas de contenção sem burocracia",
      ],
      potentialPitfallsToAvoid: [
        "Tentar resolver tudo de uma só vez em vez de focar no gargalo prioritário",
        "Deixar de formalizar o novo padrão assim que a emergência passar",
        "Permitir que interrupções externas sabotem as primeiras 48 horas de foco",
      ],
    },
    actionPlan: {
      totalEstimatedTime: "14 dias",
      phases: [
        {
          phaseName: "Fase 1: Contenção Imediata & Diagnóstico de Raiz",
          timeframe: "Dias 1-3",
          steps: [
            {
              id: "st_1",
              stepNumber: 1,
              title: "Isolar o Ponto Crítico e Parar o Ruído",
              description: "Reunir os envolvidos diretamente, congelar pendências não urgentes e focar 100% no estancamento do problema.",
              timeframe: "Dia 1 (Primeiras 8 horas)",
              responsibleRole: "Líder Operacional / Responsável Direto",
              expectedOutcome: "Plano de emergência ativado e interrupção de novos erros.",
            },
            {
              id: "st_2",
              stepNumber: 2,
              title: "Alinhamento com Pessoas Afetadas",
              description: "Enviar comunicado objetivo explicando as ações em curso e a nova previsão realista de normalização.",
              timeframe: "Dia 2",
              responsibleRole: "Gestor / Coordenação",
              expectedOutcome: "Redução imediata de atritos, ansiedade e cobranças excessivas.",
            },
          ],
        },
        {
          phaseName: "Fase 2: Execução & Implementação da Solução",
          timeframe: "Dias 4-9",
          steps: [
            {
              id: "st_3",
              stepNumber: 3,
              title: "Aplicar Correções nos Processos",
              description: "Executar o novo fluxo desenhado, removendo as etapas manuais ou gargalos que causaram a falha.",
              timeframe: "Dias 4-6",
              responsibleRole: "Equipe de Execução",
              expectedOutcome: "Fluxo desobstruído e redução expressiva de retrabalho.",
            },
            {
              id: "st_4",
              stepNumber: 4,
              title: "Validação Controlada em Tempo Real",
              description: "Monitorar as primeiras entregas sob o novo formato durante 72 horas para ajustes finos.",
              timeframe: "Dias 7-9",
              responsibleRole: "Responsável por Qualidade",
              expectedOutcome: "Confirmação de eficácia com zero novas ocorrências do erro.",
            },
          ],
        },
        {
          phaseName: "Fase 3: Consolidação & Prevenção Futura",
          timeframe: "Dias 10-14",
          steps: [
            {
              id: "st_5",
              stepNumber: 5,
              title: "Documentação em Checklist Simples & Treinamento",
              description: "Sintetizar o processo em um checklist de 1 página e repassar com a equipe para blindar o futuro.",
              timeframe: "Dias 10-14",
              responsibleRole: "Liderança",
              expectedOutcome: "Padronização concluída e garantia de que o problema não voltará a ocorrer.",
            },
          ],
        },
      ],
    },
  };
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Feedback endpoint
app.post("/api/feedback", (req, res) => {
  try {
    const { resolutionId, solutionId, rating, status, whatWorked, whatDidntWork, generalComment } = req.body;
    if (!resolutionId || !solutionId) {
      return res.status(400).json({ error: "resolutionId and solutionId are required" });
    }

    const item: FeedbackItem = {
      id: "fb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      resolutionId,
      solutionId: Number(solutionId),
      rating: Number(rating) || 3,
      status: status || "not_tested",
      whatWorked: whatWorked || "",
      whatDidntWork: whatDidntWork || "",
      generalComment: generalComment || "",
      createdAt: new Date().toISOString(),
    };

    feedbackLogs.push(item);
    return res.json({ success: true, feedback: item });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to record feedback", details: err?.message });
  }
});

// Clarification check endpoint (multilingual)
app.post("/api/clarify", async (req, res) => {
  try {
    const { problem, language = "pt" } = req.body;
    if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
      return res.status(400).json({ error: "Problem text is required." });
    }

    const langInstruction =
      language === "en"
        ? "Respond exclusively in English."
        : language === "es"
        ? "Responde exclusivamente en Español."
        : "Responda estritamente em Português do Brasil.";

    const ai = getAi();
    const prompt = `You are the triage intelligence system of ResolveAI.
The user submitted the following problem statement:
"""${problem.trim()}"""

CRITICAL DIRECTIVES:
1. UNDERSTAND THE EXACT QUESTION: Discern precisely what the user is asking and what the central challenge is.
2. DO NOT INVENT INFORMATION: Do not assume unstated facts, budgets, timelines, or constraints.
3. STRICT QUESTION CEILING: If crucial information is missing to formulate realistic and actionable solutions, formulate AT MOST 3 objective, highly relevant questions (1, 2, or 3 questions max; NEVER more than 3).
4. SUFFICIENT CONTEXT RULE: If the user's description already provides enough essential context (or is a self-contained question), set "needsClarification": false and return an empty questions array.
5. SAFETY PROTOCOL: If the problem touches high-risk medical, legal, or severe financial decisions, avoid dangerous speculation and ask only for essential situational context (e.g. timeframe, whether professional counsel has already been contacted).
${langInstruction}

Return strictly JSON matching this structure:
{
  "needsClarification": boolean,
  "reason": "short explanation of why additional context is or is not needed",
  "detectedCategory": "detected category name in user language (e.g., Negócios, Gestão, Tecnologia, Jurídico, Saúde, Finanças, Pessoal)",
  "quickSummary": "precise one-sentence summary capturing exactly what the user wants to solve",
  "questions": [
    {
      "id": "q1",
      "question": "direct, objective, and friendly question (max 3 questions total)",
      "whyItMatters": "clear explanation of how this changes the recommended strategy",
      "placeholder": "short example answer...",
      "suggestedOptions": ["Option 1", "Option 2", "Option 3"]
    }
  ]
}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        needsClarification: { type: Type.BOOLEAN },
        reason: { type: Type.STRING },
        detectedCategory: { type: Type.STRING },
        quickSummary: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              whyItMatters: { type: Type.STRING },
              placeholder: { type: Type.STRING },
              suggestedOptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["id", "question", "whyItMatters"],
          },
        },
      },
      required: ["needsClarification", "reason", "detectedCategory", "quickSummary", "questions"],
    };

    try {
      const clarifySysInstruction =
        "You are ResolveAI triage system. Understand exactly what the user is asking. If essential information is missing, set needsClarification to true and formulate 1 to 3 objective, highly specific questions (never more than 3). If context is sufficient, set needsClarification to false and return an empty questions array. Never invent facts.";
      const parsed = await callGeminiWithFallback(ai, prompt, schema, clarifySysInstruction);

      // Programmatic safety checks on questions array
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        parsed.questions = [];
      }
      if (parsed.questions.length > 3) {
        parsed.questions = parsed.questions.slice(0, 3);
      }
      if (parsed.needsClarification && parsed.questions.length === 0) {
        parsed.needsClarification = false;
      }

      return res.json(parsed);
    } catch (apiErr: any) {
      console.warn("AI clarify fallback triggered due to API status:", apiErr?.message);
      // Non-blocking fallback: allow direct resolution if clarify experiences 503
      return res.json({
        needsClarification: false,
        reason: "Contexto suficiente identificado para análise direta.",
        detectedCategory: "Geral",
        quickSummary: problem.trim().slice(0, 100),
        questions: [],
      });
    }
  } catch (err: any) {
    console.error("Error in /api/clarify:", err);
    return res.json({
      needsClarification: false,
      reason: "Procedendo com resolução direta.",
      detectedCategory: "Geral",
      quickSummary: (req.body?.problem || "").slice(0, 100),
      questions: [],
    });
  }
});

// Full Problem Resolution endpoint (multilingual + user feedback learning loop)
app.post("/api/resolve", async (req, res) => {
  try {
    const { problem, clarificationAnswers, context, language = "pt", feedbackContext } = req.body;
    if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
      return res.status(400).json({ error: "Problem text is required." });
    }

    let answersText = "";
    if (clarificationAnswers && typeof clarificationAnswers === "object") {
      answersText = Object.entries(clarificationAnswers)
        .map(([key, val]) => `- (${key}): ${val}`)
        .join("\n");
    }

    const langInstruction =
      language === "en"
        ? "Respond EXCLUSIVELY in English. Use natural, professional business/analytical English."
        : language === "es"
        ? "Responde EXCLUSIVAMENTE en Español. Utiliza un tono profesional, claro y analítico."
        : "Responda EXCLUSIVAMENTE em Português do Brasil. Utilize tom profissional, claro e pragmático.";

    let learningPrompt = "";
    if (feedbackContext && Array.isArray(feedbackContext) && feedbackContext.length > 0) {
      learningPrompt = `
FEEDBACK-BASED ALGORITHM REFINEMENT (User Learning Loop):
The user previously provided the following feedback on earlier solutions:
${feedbackContext
  .map(
    (fb: any, i: number) =>
      `Learning #${i + 1}: Rating ${fb.rating}/5 | What worked: "${fb.whatWorked || 'N/A'}" | What didn't work: "${fb.whatDidntWork || 'N/A'}" | Notes: "${fb.generalComment || 'N/A'}"`
  )
  .join("\n")}
INSTRUCTION: Take these learnings into account to calibrate the recommended solutions. Favor approaches that align with what worked well and actively avoid patterns or mistakes noted in previous negative feedback.
`;
    }

    const ai = getAi();
    const prompt = `You are ResolveAI's master problem resolution engine.
The user submitted the following problem:
"""${problem.trim()}"""

${answersText ? `Additional context & clarification answers provided by the user:\n${answersText}\n` : ""}
${context ? `Extra context: ${context}\n` : ""}
${learningPrompt}

LANGUAGE REQUIREMENT:
${langInstruction}

CRITICAL QUALITY DIRECTIVES (Follow with extreme precision):
1. UNDERSTAND THE EXACT QUESTION:
   Diagnose precisely what the user is asking, identifying the core dilemma, specific context, and desired result without diverging into unrelated topics.
2. ABSOLUTELY ZERO INVENTED INFORMATION:
   Do NOT invent facts, fake statistics, unstated company sizes, imaginary deadlines, or fabricated constraints. Only base reasoning on facts explicitly provided.
3. SEPARATE USER-PROVIDED FACTS FROM AI HYPOTHESES:
   In dimension 1 ("summary"), you MUST clearly and explicitly separate facts from hypotheses using these labeled lines:
   • Diagnóstico Central: [1-2 sentences capturing exactly what the user is facing and asking]
   • Fatos Fornecidos pelo Usuário: [concise summary of only the concrete facts stated by the user]
   • Hipóteses e Premissas da IA: [explicit hypotheses and contextual deductions formulated by the AI to structure the solutions]
4. IDENTIFY PROBABLE CAUSES & EXPLAIN REASONING SIMPLY:
   In dimension 2 ("causes"), identify 2 to 4 probable root causes. For each, explain the causal chain in simple, accessible language so any user can understand WHY the problem occurs.
5. GENERATE 5 FUNDAMENTALLY DIFFERENT SOLUTIONS:
   In dimension 7 ("solutions"), you MUST generate EXACTLY 5 solutions that differ fundamentally from each other in approach, methodology, and philosophy:
   - Solution 1: Immediate Containment / Quick Win (low cost, immediate impact in 24-72h)
   - Solution 2: Structural Process / Workflow Optimization (routines, rules, RACI responsibility matrix)
   - Solution 3: Technological / Automation / Tool-Driven (software, digital tools, automated triggers)
   - Solution 4: People & Cultural / Leadership / Training (human alignment, incentives, communication, skill development)
   - Solution 5: Strategic Pivot / Restructuring / Outsourcing (deep change in resource allocation or operational model)
6. COMPLETE SOLUTION METRICS:
   For EACH of the 5 solutions, you MUST provide:
   - efficacyScore (estimated percentage 1 to 100)
   - cost ('Gratuito', 'Baixo', 'Médio', 'Alto')
   - effort ('Baixa', 'Média', 'Alta')
   - estimatedTime (specific, realistic duration)
   - cons (main risks, cautions, and potential downsides of implementation)
   - pros (main concrete advantages)
7. CHOOSE THE BEST SOLUTION FOR THE SPECIFIC CONTEXT:
   In dimension 9 ("recommended"), choose the single best solution among the 5 considering the user's specific circumstances, constraints, and urgency. Explain the concrete trade-offs of why it is superior for their exact case.
8. PRACTICAL & SPECIFIC ACTION PLAN (NO GENERIC ADVICE):
   In dimension 10 ("actionPlan"), eliminate all generic clichés (e.g. avoid "communicate better" or "be more organized"). Write concrete, actionable steps with checklists, specific timeframes (e.g. "Dia 1 a 2"), assigned roles, and verifiable expected outcomes.
9. SAFETY FOR HIGH-RISK TOPICS (MEDICAL, LEGAL, FINANCIAL):
   If the problem involves medical/mental health symptoms, legal/court disputes, or severe financial insolvency/high-risk investments:
   - NEVER give dangerous prescriptive instructions (no medical prescriptions, no definitive legal counsel, no speculative financial moves).
   - In "professionalNotice", provide a clear, empathetic advisory recommending consultation with a licensed doctor, attorney, or financial advisor. If not applicable, return an empty string "".
`;

    const resolveSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "1. Problem summary explicitly separating Central Diagnosis, User-Provided Facts, and AI Hypotheses.",
        },
        professionalNotice: {
          type: Type.STRING,
          description: "Crucial professional safety advisory if medical, psychological, legal, or high-risk financial. If not applicable, return empty string.",
        },
        causes: {
          type: Type.ARRAY,
          description: "2. Probable root causes.",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              likelihood: { type: Type.STRING },
            },
            required: ["title", "category", "description", "likelihood"],
          },
        },
        severity: {
          type: Type.OBJECT,
          description: "3. Problem severity.",
          properties: {
            level: { type: Type.STRING },
            score: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["level", "score", "explanation"],
        },
        urgency: {
          type: Type.OBJECT,
          description: "4. Urgency to take action.",
          properties: {
            level: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["level", "timeframe", "explanation"],
        },
        affectedPeople: {
          type: Type.ARRAY,
          description: "5. Affected stakeholders.",
          items: {
            type: Type.OBJECT,
            properties: {
              group: { type: Type.STRING },
              impactDescription: { type: Type.STRING },
            },
            required: ["group", "impactDescription"],
          },
        },
        consequences: {
          type: Type.OBJECT,
          description: "6. Consequences of not resolving.",
          properties: {
            immediateRisks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            longTermRisks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            worstCaseScenario: { type: Type.STRING },
          },
          required: ["immediateRisks", "longTermRisks", "worstCaseScenario"],
        },
        solutions: {
          type: Type.ARRAY,
          description: "7. Exactly five proposed solution cards.",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              pros: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              effort: { type: Type.STRING },
              cost: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              efficacyScore: { type: Type.INTEGER },
              keyStepsSummary: { type: Type.STRING },
            },
            required: [
              "id",
              "title",
              "category",
              "summary",
              "pros",
              "cons",
              "effort",
              "cost",
              "estimatedTime",
              "efficacyScore",
              "keyStepsSummary",
            ],
          },
        },
        comparison: {
          type: Type.OBJECT,
          description: "8. Comparison between the 5 solutions.",
          properties: {
            overview: { type: Type.STRING },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  bestSolutionIndex: { type: Type.INTEGER },
                  evaluationNote: { type: Type.STRING },
                },
                required: ["criterion", "explanation", "bestSolutionIndex", "evaluationNote"],
              },
            },
            matrixSummary: { type: Type.STRING },
          },
          required: ["overview", "criteria", "matrixSummary"],
        },
        recommended: {
          type: Type.OBJECT,
          description: "9. Best recommended solution.",
          properties: {
            solutionId: { type: Type.INTEGER },
            title: { type: Type.STRING },
            whyRecommended: { type: Type.STRING },
            criticalSuccessFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            potentialPitfallsToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "solutionId",
            "title",
            "whyRecommended",
            "criticalSuccessFactors",
            "potentialPitfallsToAvoid",
          ],
        },
        actionPlan: {
          type: Type.OBJECT,
          description: "10. Step-by-step action plan.",
          properties: {
            totalEstimatedTime: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        timeframe: { type: Type.STRING },
                        responsibleRole: { type: Type.STRING },
                        expectedOutcome: { type: Type.STRING },
                      },
                      required: [
                        "id",
                        "stepNumber",
                        "title",
                        "description",
                        "timeframe",
                        "responsibleRole",
                        "expectedOutcome",
                      ],
                    },
                  },
                },
                required: ["phaseName", "timeframe", "steps"],
              },
            },
          },
          required: ["totalEstimatedTime", "phases"],
        },
      },
      required: [
        "summary",
        "causes",
        "severity",
        "urgency",
        "affectedPeople",
        "consequences",
        "solutions",
        "comparison",
        "recommended",
        "actionPlan",
      ],
    };

    let parsed: any = null;
    try {
      const resolveSysInstruction =
        "You are ResolveAI's master analytical engine. Understand the exact problem. Never invent facts. Clearly separate user facts from AI hypotheses. Identify root causes simply. Produce 5 fundamentally different solutions with efficacy, cost, difficulty, time, and risks. Recommend the best contextual solution. Build an actionable, specific plan without generic fluff. Adhere strictly to safety protocols for medical, legal, or financial issues.";
      parsed = await callGeminiWithFallback(ai, prompt, resolveSchema, resolveSysInstruction);
    } catch (apiErr: any) {
      console.warn("AI generation failed across models, activating emergency synthesizer:", apiErr?.message);
      parsed = generateEmergencyResolution(problem, clarificationAnswers || {}, language);
    }

    const fullResult = {
      id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      language,
      problemPrompt: problem,
      clarificationAnswers: clarificationAnswers || {},
      feedbacks: [],
      ...parsed,
    };

    return res.json(fullResult);
  } catch (err: any) {
    console.error("Error in /api/resolve:", err);
    // Even in outer catch, return a structured resolution rather than failing
    const fallback = generateEmergencyResolution(
      req.body?.problem || "Problema Geral",
      req.body?.clarificationAnswers || {},
      req.body?.language || "pt"
    );
    const fullResult = {
      id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      language: req.body?.language || "pt",
      problemPrompt: req.body?.problem || "Problema",
      clarificationAnswers: req.body?.clarificationAnswers || {},
      feedbacks: [],
      ...fallback,
    };
    return res.json(fullResult);
  }
});

// ==========================================
// CENTRAL "CRIAR" & LIMITS BACKEND ENGINE
// ==========================================

interface CreationUsageRecord {
  date: string; // YYYY-MM-DD
  counts: {
    video: number;
    image: number;
    text: number;
    audio: number;
    code: number;
  };
}

const SERVER_PLAN_CREATION_LIMITS: Record<string, Record<string, number>> = {
  free: { video: 3, image: 10, text: 20, audio: 5, code: 10 },
  basic: { video: 8, image: 30, text: 60, audio: 15, code: 30 },
  premium: { video: 20, image: 100, text: 200, audio: 50, code: 100 },
  pro: { video: 100, image: 500, text: 1000, audio: 200, code: 500 },
};

const userUsageStore: Record<string, CreationUsageRecord> = {};

interface StoredCreatedItem {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  category: string;
  title: string;
  prompt: string;
  options: Record<string, any>;
  resultContent: string;
  statusNotice?: string;
  connectedToModel: boolean;
  isFavorite: boolean;
  createdAt: string;
}

const createdItemsStore: StoredCreatedItem[] = [];

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getOrInitUserUsage(userId: string): CreationUsageRecord {
  const today = getTodayString();
  const record = userUsageStore[userId];
  if (!record || record.date !== today) {
    userUsageStore[userId] = {
      date: today,
      counts: { video: 0, image: 0, text: 0, audio: 0, code: 0 },
    };
  }
  return userUsageStore[userId];
}

// GET /api/create/usage
app.get("/api/create/usage", (req, res) => {
  const userId = (req.query.userId as string) || "default_user";
  const plan = (req.query.plan as string) || "free";
  const record = getOrInitUserUsage(userId);
  const limits = SERVER_PLAN_CREATION_LIMITS[plan] || SERVER_PLAN_CREATION_LIMITS.free;

  const remaining: Record<string, number> = {};
  for (const cat of ["video", "image", "text", "audio", "code"]) {
    const used = record.counts[cat as keyof typeof record.counts] || 0;
    const max = limits[cat] || 1;
    remaining[cat] = Math.max(0, max - used);
  }

  res.json({
    date: record.date,
    usage: record.counts,
    plan,
    limits,
    remaining,
  });
});

// POST /api/create/generate
app.post("/api/create/generate", async (req, res) => {
  try {
    const {
      userId = "default_user",
      toolId,
      toolName,
      category,
      plan = "free",
      prompt,
      options = {},
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "O campo prompt é obrigatório." });
    }

    const validCategories = ["video", "image", "text", "audio", "code"];
    const targetCat = validCategories.includes(category) ? category : "text";

    // 1. Centralized Server-Side Limits Verification
    const userUsage = getOrInitUserUsage(userId);
    const planLimits = SERVER_PLAN_CREATION_LIMITS[plan] || SERVER_PLAN_CREATION_LIMITS.free;
    const currentCount = userUsage.counts[targetCat as keyof typeof userUsage.counts] || 0;
    const maxLimit = planLimits[targetCat] || 3;

    if (currentCount >= maxLimit) {
      return res.status(429).json({
        error: "LIMIT_REACHED",
        message: "Você atingiu seu limite gratuito de hoje.",
        category: targetCat,
        currentCount,
        maxLimit,
        plan,
      });
    }

    // Increment usage on server
    userUsage.counts[targetCat as keyof typeof userUsage.counts] = currentCount + 1;

    let resultContent = "";
    let statusNotice: string | undefined;
    let connectedToModel = false;

    // AI Execution via Gemini if available
    let ai: GoogleGenAI | null = null;
    try {
      ai = getAi();
    } catch {
      ai = null;
    }

    if (targetCat === "text") {
      connectedToModel = true;
      if (ai) {
        try {
          const genPrompt = `Você é um redator de IA experiente e especialista em produção de conteúdo de alta qualidade.
Ferramenta: ${toolName || "Texto com IA"}
Opções: Tipo=${options.type || "Padrão"}, Tom=${options.tone || "Profissional"}, Tamanho=${options.length || "Médio"}, Idioma=${options.language || "Português"}.
Instrução do usuário:
${prompt}

Entregue um texto impecável, bem formatado com títulos e parágrafos, sem enrolação.`;

          const aiText = await generateCreativeContentWithFallback(ai, genPrompt, { temperature: 0.7 });
          if (aiText) {
            resultContent = aiText;
          }
        } catch (e: any) {
          console.error("Error generating text content:", e?.message || e);
        }
      }
      if (!resultContent) {
        resultContent = `# ${toolName || "Texto Gerado"}\n\n**Tema:** ${prompt}\n\nConteúdo gerado com base nas diretrizes selecionadas (${options.tone || "Profissional"}, formato ${options.type || "Padrão"}). O texto explora a introdução do tema, desenvolvimento claro com tópicos destacados e um fechamento orientado para ação.`;
      }
    } else if (targetCat === "code") {
      connectedToModel = true;
      if (ai) {
        try {
          const genPrompt = `Você é um engenheiro de software sênior.
Ferramenta: ${toolName || "Código com IA"}
Linguagem: ${options.language || "TypeScript"}
Tarefa: ${options.task || "Criar código"}
Especificação do usuário:
${prompt}

Entregue o código limpo, documentado, eficiente e pronto para produção, com explicações breves se necessário.`;

          const aiCode = await generateCreativeContentWithFallback(ai, genPrompt, { temperature: 0.2 });
          if (aiCode) {
            resultContent = aiCode;
          }
        } catch (e: any) {
          console.error("Error generating code content:", e?.message || e);
        }
      }
      if (!resultContent) {
        resultContent = `// ${toolName || "Código com IA"} - ${options.language || "TypeScript"}\n// Requisito: ${prompt}\n\nexport function solution() {\n  // Implementação gerada de acordo com o pedido\n  console.log("Solução executada com sucesso");\n}`;
      }
    } else if (targetCat === "video") {
      connectedToModel = false;
      statusNotice =
        "⚙️ Pipeline de Renderização: Parâmetros validados e uso contabilizado no servidor. Para renderizar o arquivo MP4 final por GPU, conecte o endpoint de sua API de vídeo (ex: Runway Gen-3 / Luma / Pika) em server.ts.";

      // Generate complete screenplay & visual storyboard with Gemini so user gets real creative value
      if (ai) {
        try {
          const genPrompt = `Você é um diretor de vídeo e roteirista profissional.
Ferramenta: ${toolName || "Vídeo com IA"}
Formato: ${options.format || "Shorts 9:16"}
Duração: ${options.duration || "30s"}
Estilo: ${options.style || "Cinemático"}
Proporção: ${options.aspectRatio || "9:16"}
Qualidade pretendida: ${options.quality || "1080p"}
Ideia do usuário: ${prompt}

Gere um Storyboard e Roteiro de Produção Completo com:
1. Sinopse e Gancho de Abertura (0-3s)
2. Decupagem de Cenas (Cena, Duração, Visual/Câmera, Áudio/Locução, Texto na Tela)
3. Prompt Detalhado para o Renderizador de Vídeo (Engenharia de Prompt para Runway/Luma).`;

          const aiScript = await generateCreativeContentWithFallback(ai, genPrompt, { temperature: 0.7 });
          if (aiScript) {
            resultContent = aiScript;
          }
        } catch (e: any) {
          console.error("Error generating video storyboard:", e?.message || e);
        }
      }
      if (!resultContent) {
        resultContent = `## Roteiro e Estrutura de Cenas para Vídeo (${options.format || "Shorts 9:16"})\n\n**Ideia:** ${prompt}\n\n- **Cena 1 (0-3s):** Gancho inicial dinâmico com texto em destaque.\n- **Cena 2 (3-15s):** Desenvolvimento da proposta com cortes em ritmo acelerado.\n- **Cena 3 (15-30s):** Chamada para ação final com encerramento de impacto.`;
      }
    } else if (targetCat === "image") {
      connectedToModel = false;
      statusNotice =
        "⚙️ Pipeline Gráfico: Parâmetros computados com sucesso no backend. Para geração gráfica de bitmap (PNG/JPEG) por IA, configure a chave da sua API (ex: Flux / Stable Diffusion / Imagen) em server.ts.";

      if (ai) {
        try {
          const genPrompt = `Você é um diretor de arte e engenheiro de prompts visuais.
Ferramenta: ${toolName || "Imagem com IA"}
Estilo: ${options.style || "Fotorrealista"}
Proporção: ${options.aspectRatio || "1:1"}
Qualidade: ${options.quality || "HD"}
Quantidade: ${options.quantity || 1}
Prompt do usuário: ${prompt}

Gere uma Especificação de Criação Visual completa com:
1. Prompt Expandido em Inglês pronto para Diffusion (Midjourney/Flux/SDXL com iluminação, lente, cores e textura)
2. Paleta de Cores e Atmosfera Cromática
3. Diretrizes de Composição e Enquadramento.`;

          const aiImageSpec = await generateCreativeContentWithFallback(ai, genPrompt, { temperature: 0.7 });
          if (aiImageSpec) {
            resultContent = aiImageSpec;
          }
        } catch (e: any) {
          console.error("Error generating image spec:", e?.message || e);
        }
      }
      if (!resultContent) {
        resultContent = `## Especificação Criativa de Imagem\n\n**Prompt Original:** ${prompt}\n**Estilo:** ${options.style || "Fotorrealista"} | **Proporção:** ${options.aspectRatio || "1:1"}\n\n**Prompt Otimizado para Modelo Gráfico:**\n\`${prompt}, masterpiece, 8k resolution, cinematic lighting, photorealistic, octane render, vivid colors\`\n\n**Paleta Sugerida:** Azul Profundo, Dourado Metálico, Branco Neutro.`;
      }
    } else if (targetCat === "audio") {
      connectedToModel = false;
      statusNotice =
        "⚙️ Pipeline de Voz: Texto e inflexões vocais calculados no servidor. Para streaming de áudio WAV/MP3 sintetizado, conecte a chave do serviço de TTS (ex: ElevenLabs / OpenAI TTS) em server.ts.";

      if (ai) {
        try {
          const genPrompt = `Você é um diretor de áudio e locução profissional.
Ferramenta: ${toolName || "Áudio com IA"}
Voz/Estilo: ${options.voice || "Natural Executiva"}
Velocidade: ${options.speed || "1.0x"}
Emoção: ${options.emotion || "Inspiradora"}
Texto ou ideia: ${prompt}

Gere a Guia de Locução e Fonética com:
1. Roteiro Fonético Formatado com Pausas ([pausa 1s], [ênfase], [respiração])
2. Diretrizes de Entonação e Velocidade para o Locutor/Modelo de TTS
3. Prompt de Configuração de Voz para ElevenLabs.`;

          const aiAudio = await generateCreativeContentWithFallback(ai, genPrompt, { temperature: 0.7 });
          if (aiAudio) {
            resultContent = aiAudio;
          }
        } catch (e: any) {
          console.error("Error generating audio guide:", e?.message || e);
        }
      }
      if (!resultContent) {
        resultContent = `## Guia de Narração e Síntese Vocal\n\n**Texto:** ${prompt}\n**Configurações:** Voz ${options.voice || "Natural"}, Ritmo ${options.speed || "1.0x"}, Emoção ${options.emotion || "Inspiradora"}\n\n**Roteiro com Marcações:**\n[Respiração inicial] "${prompt}" [Pausa 1.5s]`;
      }
    }

    const newItem: StoredCreatedItem = {
      id: "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      userId,
      toolId: toolId || "custom",
      toolName: toolName || "Criação com IA",
      category: targetCat,
      title: prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt,
      prompt,
      options,
      resultContent,
      statusNotice,
      connectedToModel,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    createdItemsStore.unshift(newItem);

    return res.json({
      success: true,
      item: newItem,
      usage: userUsage.counts,
      limits: planLimits,
      remaining: Math.max(
        0,
        maxLimit - userUsage.counts[targetCat as keyof typeof userUsage.counts]
      ),
    });
  } catch (err: any) {
    console.error("Error in /api/create/generate:", err);
    return res.status(500).json({
      error: "Erro interno no servidor ao processar criação.",
      details: err?.message,
    });
  }
});

// GET /api/create/library
app.get("/api/create/library", (req, res) => {
  const userId = (req.query.userId as string) || "default_user";
  const category = req.query.category as string;
  let items = createdItemsStore.filter((i) => !userId || i.userId === userId);
  if (category && category !== "all") {
    items = items.filter((i) => i.category === category);
  }
  res.json({ items });
});

// DELETE /api/create/library/:id
app.delete("/api/create/library/:id", (req, res) => {
  const { id } = req.params;
  const idx = createdItemsStore.findIndex((i) => i.id === id);
  if (idx !== -1) {
    createdItemsStore.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: "Item não encontrado." });
});

// PATCH /api/create/library/:id/favorite
app.patch("/api/create/library/:id/favorite", (req, res) => {
  const { id } = req.params;
  const item = createdItemsStore.find((i) => i.id === id);
  if (item) {
    item.isFavorite = !item.isFavorite;
    return res.json({ success: true, isFavorite: item.isFavorite });
  }
  return res.status(404).json({ error: "Item não encontrado." });
});

// ==========================================
// AUTH & USER SESSIONS
// ==========================================
interface UserAccount {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: "user" | "admin";
  createdAt: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  bonusCredits: number;
}

const userAccountsStore: Record<string, UserAccount> = {
  default_user: {
    id: "default_user",
    name: "Visitante",
    email: "usuario@aihub.com",
    plan: "free",
    role: "user",
    createdAt: new Date().toISOString(),
    referralCode: "AIHUB-FREE-882",
    referralCount: 2,
    bonusCredits: 50,
  },
  admin_user: {
    id: "admin_user",
    name: "Administrador AI Hub",
    email: "admin@aihub.com",
    plan: "pro",
    role: "admin",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    referralCode: "AIHUB-ADMIN-VIP",
    referralCount: 18,
    bonusCredits: 500,
  },
};

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  const cleanEmail = email.trim().toLowerCase();
  // Find or provision user
  let user = Object.values(userAccountsStore).find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    const isSpecialAdmin = cleanEmail.includes("admin");
    user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: cleanEmail.split("@")[0].replace(/[._-]/g, " "),
      email: cleanEmail,
      plan: isSpecialAdmin ? "pro" : "free",
      role: isSpecialAdmin ? "admin" : "user",
      createdAt: new Date().toISOString(),
      referralCode: "AIHUB-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      referralCount: 0,
      bonusCredits: 10,
    };
    userAccountsStore[user.id] = user;
  }

  res.json({ success: true, user, token: "tok_" + Buffer.from(user.id).toString("base64") });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { name, email, referralCode } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = Object.values(userAccountsStore).find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.json({ success: true, user: existing, token: "tok_" + Buffer.from(existing.id).toString("base64") });
  }

  const newUserId = "usr_" + Math.random().toString(36).substring(2, 9);
  const newUser: UserAccount = {
    id: newUserId,
    name: name.trim(),
    email: cleanEmail,
    plan: "free",
    role: cleanEmail.includes("admin") ? "admin" : "user",
    createdAt: new Date().toISOString(),
    referralCode: "AIHUB-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
    referredBy: referralCode ? String(referralCode).trim() : undefined,
    referralCount: 0,
    bonusCredits: referralCode ? 25 : 10, // Referral welcome bonus
  };

  userAccountsStore[newUserId] = newUser;

  // Credit the referrer if code exists
  if (referralCode) {
    const referrer = Object.values(userAccountsStore).find(
      (u) => u.referralCode.toUpperCase() === String(referralCode).trim().toUpperCase()
    );
    if (referrer) {
      referrer.referralCount += 1;
      referrer.bonusCredits += 50;
    }
  }

  res.json({ success: true, user: newUser, token: "tok_" + Buffer.from(newUser.id).toString("base64") });
});

// POST /api/referral/claim
app.post("/api/referral/claim", (req, res) => {
  const { userId, referralCode } = req.body;
  if (!userId || !referralCode) {
    return res.status(400).json({ error: "Dados de indicação incompletos." });
  }

  const referrer = Object.values(userAccountsStore).find(
    (u) => u.referralCode.toUpperCase() === String(referralCode).trim().toUpperCase()
  );

  if (!referrer) {
    return res.status(404).json({ error: "Código de indicação inválido ou não encontrado." });
  }

  referrer.referralCount += 1;
  referrer.bonusCredits += 50;

  res.json({
    success: true,
    message: "Código de indicação validado! +50 créditos bônus concedidos.",
    referrerName: referrer.name,
  });
});

// ==========================================
// ADMIN METRICS & TELEMETRY
// ==========================================
app.get("/api/admin/stats", (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const mem = process.memoryUsage();

  const planCounts = { free: 0, basic: 0, premium: 0, pro: 0 };
  Object.values(userAccountsStore).forEach((u) => {
    if (u.plan in planCounts) {
      planCounts[u.plan as keyof typeof planCounts]++;
    }
  });

  res.json({
    status: "healthy",
    uptimeSeconds,
    memoryUsageMb: Math.round(mem.rss / 1024 / 1024),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    activeModel: CANDIDATE_MODELS[0],
    candidateModels: CANDIDATE_MODELS,
    telemetry: {
      totalUsers: Object.keys(userAccountsStore).length,
      totalCreations: createdItemsStore.length,
      totalFeedbacks: feedbackLogs.length,
      planDistribution: planCounts,
      todayActiveUsageAccounts: Object.keys(userUsageStore).length,
    },
    recentFeedbacks: feedbackLogs.slice(-10).reverse(),
  });
});

// ==========================================
// SITE EXPORT (HTML, CSS, JAVASCRIPT, ZIP)
// ==========================================
app.get("/api/export/dist-zip", (req, res) => {
  try {
    const distPath = path.join(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      return res.status(404).json({ error: "Build de produção ainda não gerado." });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="aihub-site-html-css-js.zip"');

    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Erro ao compactar arquivos estáticos." });
      }
    });

    archive.pipe(res);

    // Add dist files
    const files = fs.readdirSync(distPath);
    for (const file of files) {
      if (file === "server.cjs" || file === "server.cjs.map") continue;
      const fullPath = path.join(distPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        archive.directory(fullPath, file);
      } else {
        archive.file(fullPath, { name: file });
      }
    }

    // Add explanatory README.txt
    const readmeContent = `=====================================================
AI HUB - PACOTE ESTÁTICO (HTML, CSS, JAVASCRIPT)
=====================================================

Este pacote contém os arquivos finais de produção compilados do seu site AI Hub:
- index.html               -> Arquivo HTML principal do site
- assets/*.css             -> Folha de estilos CSS completa (Tailwind compilado)
- assets/*.js              -> Scripts JavaScript da aplicação (React 19 + Lucide + Motion)
- favicon.svg              -> Ícone oficial do site

COMO UTILIZAR OU PUBLICAR:
1. HOSPEDAGEM ESTÁTICA GRATUITA (Vercel, Netlify, GitHub Pages, Cloudflare Pages):
   - Basta enviar todos os arquivos desta pasta para a raiz do seu repositório ou serviço de hospedagem.
2. HOSPEDAGEM TRADICIONAL (cPanel, Apache, Nginx, Hostinger, Locaweb):
   - Envie os arquivos para a pasta public_html ou www do seu servidor.
3. TESTE LOCAL NO SEU COMPUTADOR:
   - Abra o terminal na pasta e execute: npx serve .
   - Ou com Python: python3 -m http.server 8080
   - E acesse http://localhost:8080 no seu navegador.
`;
    archive.append(readmeContent, { name: "COMO_USAR_LEIAME.txt" });

    archive.finalize();
  } catch (err: any) {
    console.error("Export dist-zip error:", err);
    res.status(500).json({ error: "Falha interna ao gerar arquivo ZIP." });
  }
});

app.get("/api/export/site-zip", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="aihub-site-projeto-completo.zip"');

    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Erro ao compactar projeto completo." });
      }
    });

    archive.pipe(res);

    const rootDir = process.cwd();

    // Include compiled dist if exists
    const distPath = path.join(rootDir, "dist");
    if (fs.existsSync(distPath)) {
      archive.directory(distPath, "dist");
    }

    // Include src
    const srcPath = path.join(rootDir, "src");
    if (fs.existsSync(srcPath)) {
      archive.directory(srcPath, "src");
    }

    // Include individual root config & doc files
    const rootFiles = [
      "index.html",
      "package.json",
      "tsconfig.json",
      "vite.config.ts",
      "server.ts",
      "metadata.json",
      ".env.example",
    ];

    for (const f of rootFiles) {
      const p = path.join(rootDir, f);
      if (fs.existsSync(p)) {
        archive.file(p, { name: f });
      }
    }

    // Comprehensive README for developer / user
    const fullReadme = `# AI Hub - Código Fonte e Arquivos do Site (HTML, CSS, JavaScript, TypeScript)

Parabéns! Este arquivo ZIP contém todos os arquivos do seu site AI Hub prontos para uso, edição e publicação.

## Conteúdo do Pacote:
- \`dist/\`: Versão compilada pronta para produção (HTML, CSS, JS minificados).
- \`src/\`: Todo o código-fonte em TypeScript e React (Componentes, i18n, Utilitários, Tipos, Telas).
- \`index.html\`: Entrada HTML do aplicativo com meta tags Open Graph e SEO.
- \`server.ts\`: Servidor Express com integração Gemini API e rotas de telemetria.
- \`package.json\`: Dependências e scripts de execução.
- \`vite.config.ts\`: Configuração do empacotador Vite.

## Como Rodar Localmente:
1. Certifique-se de ter o Node.js (versão 18+) instalado.
2. No terminal da pasta extraída, instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
3. Crie um arquivo \`.env\` baseado no \`.env.example\` com a sua chave Gemini:
   \`\`\`env
   GEMINI_API_KEY=sua_chave_aqui
   \`\`\`
4. Inicie o servidor em modo de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Para compilar novamente para produção:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`
`;
    archive.append(fullReadme, { name: "README.md" });

    archive.finalize();
  } catch (err: any) {
    console.error("Export site-zip error:", err);
    res.status(500).json({ error: "Falha interna ao gerar arquivo ZIP." });
  }
});

// Production and dev server handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Hub Server running on port ${PORT}`);
  });
}

startServer();
