import { SubscriptionPlanItem, FaqItem } from '../types';

export const PLANS_DATA: SubscriptionPlanItem[] = [
  {
    id: 'free',
    name: 'Grátis',
    tagline: 'Ideal para começar a resolver problemas pontuais do dia a dia.',
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    annualTotalPrice: 0,
    ctaText: 'Começar grátis',
    features: [
      'Recursos básicos de diagnóstico',
      'Limite diário de uso essencial',
      'Acesso às funções essenciais',
      'Central Criar: 3 vídeos, 10 imagens, 20 textos/dia',
      'Suporte padrão por email',
      'Até 3 soluções guiadas por problema',
      'Histórico local de resoluções',
    ],
    limits: {
      dailyUsage: '3 análises / dia',
      processingSpeed: 'Velocidade padrão',
      ads: 'Anúncios normais',
      support: 'Padrão (comunidade/email)',
      exportFormat: 'Cópia de texto simples',
    },
  },
  {
    id: 'basic',
    name: 'Básico',
    tagline: 'Mais frequência, maior limite de uso e recursos adicionais.',
    monthlyPrice: 5.99,
    annualMonthlyPrice: 4.79,
    annualTotalPrice: 57.50,
    ctaText: 'Assinar agora',
    features: [
      'Mais recursos que o plano grátis',
      'Limite de uso maior diário',
      'Central Criar: 8 vídeos, 30 imagens, 60 textos/dia',
      'Menos anúncios na interface',
      'Acesso a recursos extras de análise',
      '5 soluções detalhadas por problema',
      'Matriz comparativa de esforço e custo',
      'Histórico ampliado na nuvem local',
    ],
    limits: {
      dailyUsage: '15 análises / dia',
      processingSpeed: 'Velocidade normal+',
      ads: 'Menos anúncios (reduzido)',
      support: 'Padrão acelerado',
      exportFormat: 'Cópia & Impressão rápida',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'O plano mais equilibrado: sem anúncios, uso ampliado e alta prioridade.',
    monthlyPrice: 10.99,
    annualMonthlyPrice: 8.79,
    annualTotalPrice: 105.50,
    isPopular: true,
    ctaText: 'Assinar agora',
    features: [
      'Central Criar: 20 vídeos, 100 imagens, 200 textos/dia',
      'Central Criar: 50 áudios e 100 códigos/dia',
      'Uso ampliado para demandas rotineiras',
      'Todos os recursos principais desbloqueados',
      'Experiência 100% sem anúncios',
      'Processamento prioritário na fila de IA',
      'Recursos exclusivos de diagnóstico',
      'Suporte prioritário com resposta rápida',
      'Planos de ação estruturados com checklist',
    ],
    highlightFeatures: [
      '20 vídeos & 100 imagens/dia',
      'Sem anúncios',
      'Processamento prioritário',
    ],
    limits: {
      dailyUsage: '50 análises / dia',
      processingSpeed: 'Prioritária (2x mais rápida)',
      ads: 'Totalmente sem anúncios',
      support: 'Prioritário (chat e ticket)',
      exportFormat: 'PDF, Markdown & Impressão',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Potência total, recursos avançados exclusivos e suporte VIP dedicado.',
    monthlyPrice: 19.99,
    annualMonthlyPrice: 15.99,
    annualTotalPrice: 191.90,
    ctaText: 'Assinar agora',
    features: [
      'Central Criar: 100 vídeos, 500 imagens, 1.000 textos/dia',
      'Central Criar: 200 áudios e 500 códigos/dia',
      'Uso máximo sem preocupações de cota',
      'Todos os recursos Premium inclusos',
      'Processamento mais rápido com ultra prioridade',
      'Recursos avançados exclusivos (modo corporativo)',
      'Prioridade máxima na infraestrutura de IA',
      'Suporte VIP direto com especialistas',
      'Histórico ilimitado e aprendizado contínuo',
    ],
    highlightFeatures: [
      '100 vídeos & 500 imagens/dia',
      'Uso máximo',
      'Suporte VIP 24/7',
    ],
    limits: {
      dailyUsage: 'Ilimitado (uso justo)',
      processingSpeed: 'Ultra rápida dedicada',
      ads: 'Totalmente sem anúncios',
      support: 'VIP dedicado 24/7',
      exportFormat: 'Relatórios executivos completos',
    },
  },
];

export interface ComparisonRow {
  category: string;
  feature: string;
  free: string | boolean;
  basic: string | boolean;
  premium: string | boolean;
  pro: string | boolean;
  tooltip?: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  // Central Criar (Limites Diários)
  {
    category: 'Central Criar (Limites Diários)',
    feature: '🎬 Vídeos por dia',
    free: '3 / dia',
    basic: '8 / dia',
    premium: '20 / dia',
    pro: '100 / dia',
  },
  {
    category: 'Central Criar (Limites Diários)',
    feature: '🖼️ Imagens por dia',
    free: '10 / dia',
    basic: '30 / dia',
    premium: '100 / dia',
    pro: '500 / dia',
  },
  {
    category: 'Central Criar (Limites Diários)',
    feature: '✍️ Gerações de texto por dia',
    free: '20 / dia',
    basic: '60 / dia',
    premium: '200 / dia',
    pro: '1.000 / dia',
  },
  {
    category: 'Central Criar (Limites Diários)',
    feature: '🎙️ Gerações de áudio por dia',
    free: '5 / dia',
    basic: '15 / dia',
    premium: '50 / dia',
    pro: '200 / dia',
  },
  {
    category: 'Central Criar (Limites Diários)',
    feature: '💻 Solicitações de código por dia',
    free: '10 / dia',
    basic: '30 / dia',
    premium: '100 / dia',
    pro: '500 / dia',
  },

  // Capacidade & Uso
  {
    category: 'Capacidade & Uso',
    feature: 'Limite diário de análises',
    free: '3 análises/dia',
    basic: '15 análises/dia',
    premium: '50 análises/dia',
    pro: 'Ilimitado',
  },
  {
    category: 'Capacidade & Uso',
    feature: 'Velocidade de processamento',
    free: 'Padrão',
    basic: 'Otimizada',
    premium: 'Prioritária (2x)',
    pro: 'Ultra rápida dedicada',
  },
  {
    category: 'Capacidade & Uso',
    feature: 'Exibição de anúncios',
    free: 'Anúncios padrão',
    basic: 'Menos anúncios',
    premium: '100% Sem anúncios',
    pro: '100% Sem anúncios',
  },

  // Recursos de Análise
  {
    category: 'Recursos & Inteligência',
    feature: 'Soluções geradas por problema',
    free: 'Até 3 soluções',
    basic: '5 soluções completas',
    premium: '5 soluções + variações',
    pro: '5 soluções aprofundadas',
  },
  {
    category: 'Recursos & Inteligência',
    feature: 'Diagnóstico 10D completo',
    free: 'Parcial (essencial)',
    basic: true,
    premium: true,
    pro: true,
  },
  {
    category: 'Recursos & Inteligência',
    feature: 'Matriz comparativa de eficácia',
    free: false,
    basic: true,
    premium: true,
    pro: true,
  },
  {
    category: 'Recursos & Inteligência',
    feature: 'Plano de ação faseado passo a passo',
    free: 'Básico',
    basic: true,
    premium: true,
    pro: true,
  },
  {
    category: 'Recursos & Inteligência',
    feature: 'Recursos avançados exclusivos',
    free: false,
    basic: false,
    premium: true,
    pro: true,
  },

  // Exportação & Histórico
  {
    category: 'Exportação & Gestão',
    feature: 'Histórico salvo de resoluções',
    free: 'Últimas 5',
    basic: 'Últimas 30',
    premium: 'Ilimitado',
    pro: 'Ilimitado',
  },
  {
    category: 'Exportação & Gestão',
    feature: 'Exportação de relatórios',
    free: 'Copiar texto',
    basic: 'Texto e impressão',
    premium: 'PDF, Texto e Impressão',
    pro: 'Relatório Executivo Completo',
  },
  {
    category: 'Exportação & Gestão',
    feature: 'Calibração de feedback contínuo',
    free: true,
    basic: true,
    premium: true,
    pro: true,
  },

  // Suporte & Atendimento
  {
    category: 'Suporte & Atendimento',
    feature: 'Nível de suporte',
    free: 'Padrão (Email)',
    basic: 'Padrão acelerado',
    premium: 'Prioritário',
    pro: 'VIP dedicado',
  },
  {
    category: 'Suporte & Atendimento',
    feature: 'Tempo médio de resposta',
    free: 'Até 48h',
    basic: 'Até 24h',
    premium: 'Até 4h',
    pro: 'Imediato prioritário',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer: 'Sim, com total liberdade e sem nenhuma multa ou fidelidade! Você pode cancelar sua assinatura com apenas um clique a qualquer instante nas configurações. Se cancelar, continuará com acesso aos benefícios até o término do período já pago.',
  },
  {
    id: 'faq-2',
    question: 'Como funciona a economia na assinatura anual?',
    answer: 'Ao escolher o faturamento anual, você recebe 20% de desconto imediato em qualquer um dos planos pagos, o que equivale a 2 meses gratuitos no ano. O valor é cobrado anualmente em parcela única ou parcelado no cartão de crédito.',
  },
  {
    id: 'faq-3',
    question: 'O plano Grátis realmente não custa nada e nunca expira?',
    answer: 'Exatamente! O plano Grátis é 100% gratuito e não possui prazo de validade. Ele dá acesso às funções essenciais e ao limite diário básico de análises sem exigir dados de cartão de crédito.',
  },
  {
    id: 'faq-4',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Nossa infraestrutura está preparada para pagamentos rápidos e seguros via Pix (com liberação instantânea), Cartões de Crédito (Visa, Mastercard, Elo, American Express) com opção de parcelamento, e Boleto Bancário.',
  },
  {
    id: 'faq-5',
    question: 'Qual a diferença entre o plano Básico, Premium e Pro?',
    answer: 'O plano Básico é voltado para quem deseja mais limites e menos anúncios por um preço super acessível. O plano Premium é o nosso mais popular, com zero anúncios, processamento prioritário e recursos exclusivos. Já o Pro é o mais robusto, feito para usuários exigentes que necessitam de uso ilimitado, ultra velocidade e suporte VIP dedicado.',
  },
  {
    id: 'faq-6',
    question: 'O que significa o "Processamento Prioritário"?',
    answer: 'Significa que suas requisições passam na frente nas filas dos modelos de inteligência artificial em servidores otimizados, entregando diagnósticos profundos em segundos, sem tempo de espera mesmo em horários de pico.',
  },
  {
    id: 'faq-7',
    question: 'Meus dados e análises salvas são mantidos se eu mudar de plano?',
    answer: 'Com certeza. Todo o seu histórico, anotações de feedback e problemas resolvidos ficam preservados com segurança caso você faça upgrade, downgrade ou retorne ao plano grátis.',
  },
];
