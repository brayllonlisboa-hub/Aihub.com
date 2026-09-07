export type Language = 'pt' | 'en' | 'es';

export type SeverityLevel = 'Baixa' | 'Média' | 'Alta' | 'Crítica' | 'Low' | 'Medium' | 'High' | 'Critical' | 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type UrgencyLevel = string;
export type LevelEffortCost = 'Baixo' | 'Médio' | 'Alto' | 'Low' | 'Medium' | 'High' | 'Bajo' | 'Medio' | 'Alto';

export interface ProbableCause {
  title: string;
  category: string;
  description: string;
  likelihood: string; // Alta/Média/Possível or High/Medium/Possible
}

export interface AffectedStakeholder {
  group: string;
  impactDescription: string;
}

export interface SolutionItem {
  id: number;
  title: string;
  category: string;
  summary: string;
  pros: string[];
  cons: string[];
  effort: string;
  cost: string;
  estimatedTime: string;
  efficacyScore: number; // 1 to 100
  keyStepsSummary: string;
}

export interface ComparisonCriterion {
  criterion: string;
  explanation: string;
  bestSolutionIndex: number;
  evaluationNote: string;
}

export interface RecommendedSolution {
  solutionId: number;
  title: string;
  whyRecommended: string;
  criticalSuccessFactors: string[];
  potentialPitfallsToAvoid: string[];
}

export interface ActionPlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timeframe: string;
  responsibleRole: string;
  expectedOutcome: string;
  completed?: boolean;
}

export interface ActionPlanPhase {
  phaseName: string;
  timeframe: string;
  steps: ActionPlanStep[];
}

export interface SolutionFeedback {
  id: string;
  resolutionId: string;
  solutionId: number;
  rating: number; // 1 to 5
  status: 'worked' | 'partially' | 'failed' | 'not_tested';
  whatWorked: string;
  whatDidntWork: string;
  generalComment: string;
  createdAt: string;
}

export interface ResolutionResult {
  id: string;
  createdAt: string;
  language: Language;
  problemPrompt: string;
  clarificationAnswers?: Record<string, string>;

  // 1. Resumo do problema
  summary: string;

  // Orientação profissional para casos médicos, jurídicos ou financeiros de alto risco
  professionalNotice?: string;

  // 2. Causas prováveis
  causes: ProbableCause[];

  // 3. Gravidade
  severity: {
    level: string;
    score: number; // 1-10
    explanation: string;
  };

  // 4. Urgência
  urgency: {
    level: string;
    timeframe: string;
    explanation: string;
  };

  // 5. Pessoas afetadas
  affectedPeople: AffectedStakeholder[];

  // 6. Consequências de não resolver
  consequences: {
    immediateRisks: string[];
    longTermRisks: string[];
    worstCaseScenario: string;
  };

  // 7. Cinco possíveis soluções
  solutions: SolutionItem[];

  // 8. Comparação entre as soluções
  comparison: {
    overview: string;
    criteria: ComparisonCriterion[];
    matrixSummary: string;
  };

  // 9. Melhor solução recomendada
  recommended: RecommendedSolution;

  // 10. Plano de ação passo a passo
  actionPlan: {
    totalEstimatedTime: string;
    phases: ActionPlanPhase[];
  };

  // User Feedbacks attached to this resolution
  feedbacks?: SolutionFeedback[];
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  placeholder?: string;
  suggestedOptions?: string[];
}

export interface ClarifyResponse {
  needsClarification: boolean;
  reason?: string;
  questions?: ClarifyingQuestion[];
  detectedCategory?: string;
  quickSummary?: string;
}

// Subscription & Plans Types
export type PlanTier = 'free' | 'basic' | 'premium' | 'pro';
export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlanItem {
  id: PlanTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  annualTotalPrice: number;
  isPopular?: boolean;
  ctaText: string;
  features: string[];
  highlightFeatures?: string[];
  limits: {
    dailyUsage: string;
    processingSpeed: string;
    ads: string;
    support: string;
    exportFormat: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// Creation Central Types
export type CreationCategory = 'video' | 'image' | 'text' | 'audio' | 'code';

export interface CreationToolItem {
  id: string;
  name: string;
  description: string;
  category: CreationCategory;
  iconName: string;
  promptPlaceholder: string;
  popular?: boolean;
}

export type CategoryUsageCounts = Record<CreationCategory, number>;

export interface UserUsageState {
  date: string;
  usage: CategoryUsageCounts;
  plan: PlanTier;
  limits: CategoryUsageCounts;
  remaining: CategoryUsageCounts;
}

export interface CreatedItem {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  category: CreationCategory;
  title: string;
  prompt: string;
  options: Record<string, any>;
  resultContent: string;
  statusNotice?: string;
  connectedToModel: boolean;
  isFavorite: boolean;
  createdAt: string;
}

export type AppView = 'home' | 'analysis' | 'plans' | 'create' | 'dashboard' | 'admin' | '404';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  role: 'user' | 'admin';
  createdAt: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  bonusCredits: number;
}

export interface AdminTelemetry {
  status: string;
  uptimeSeconds: number;
  memoryUsageMb: number;
  geminiConfigured: boolean;
  activeModel: string;
  candidateModels: string[];
  telemetry: {
    totalUsers: number;
    totalCreations: number;
    totalFeedbacks: number;
    planDistribution: Record<string, number>;
    todayActiveUsageAccounts: number;
  };
  recentFeedbacks: any[];
}


