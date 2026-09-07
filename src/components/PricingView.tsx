import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  Shield,
  Crown,
  Rocket,
  ChevronDown,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Lock,
  Layers,
  Star,
} from 'lucide-react';
import { BillingCycle, PlanTier, SubscriptionPlanItem } from '../types';
import { PLANS_DATA, COMPARISON_ROWS, FAQ_ITEMS } from '../data/pricingData';
import { CheckoutModal } from './CheckoutModal';

interface PricingViewProps {
  currentPlan: PlanTier;
  onSelectPlan: (planId: PlanTier) => void;
  onBackToHome: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentPlan,
  onSelectPlan,
  onBackToHome,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonCategoryFilter, setComparisonCategoryFilter] = useState<string>('all');

  const handlePlanClick = (plan: SubscriptionPlanItem) => {
    setSelectedPlanForModal(plan);
    setIsModalOpen(true);
  };

  const handleActivatePlan = (planId: PlanTier) => {
    onSelectPlan(planId);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Grouped comparison categories
  const categories = ['all', ...Array.from(new Set(COMPARISON_ROWS.map((r) => r.category)))];
  const filteredComparisonRows =
    comparisonCategoryFilter === 'all'
      ? COMPARISON_ROWS
      : COMPARISON_ROWS.filter((r) => r.category === comparisonCategoryFilter);

  // Icon mapping for each plan
  const getPlanIcon = (id: PlanTier) => {
    switch (id) {
      case 'free':
        return <Zap className="w-5 h-5 text-slate-700" />;
      case 'basic':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'premium':
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 'pro':
        return <Rocket className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* Top Breadcrumb & Return to App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center justify-between">
          <button
            id="btn-back-home-pricing"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Voltar ao ResolveAI</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Plano ativo:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              {PLANS_DATA.find((p) => p.id === currentPlan)?.name || 'Grátis'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 text-center pt-8 sm:pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/80 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Preços Transparentes e Sem Surpresas</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Planos sob medida para destravar qualquer desafio
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Diagnósticos profundos, até 5 soluções estruturadas e planos de ação inteligentes. Escolha o plano ideal para a sua rotina pessoal ou profissional.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <button
              id="toggle-billing-monthly"
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cobrança Mensal
            </button>

            <button
              id="toggle-billing-annual"
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Cobrança Anual</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  billingCycle === 'annual'
                    ? 'bg-white text-blue-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Economize 20%
              </span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {billingCycle === 'annual'
              ? '✨ Desconto de 20% aplicado em todos os planos pagos (2 meses grátis)'
              : 'Você pode migrar para a assinatura anual a qualquer momento'}
          </p>
        </motion.div>
      </section>

      {/* Plans Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS_DATA.map((plan, index) => {
            const isCurrent = currentPlan === plan.id;
            const isPopular = !!plan.isPopular;
            const price = billingCycle === 'annual' ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const isFree = plan.id === 'free';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                id={`card-plan-${plan.id}`}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-100/70 lg:-translate-y-2 ring-4 ring-blue-50'
                    : 'bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300'
                }`}
              >
                {/* Popular Ribbon / Current badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                      <Star className="w-3 h-3 fill-white" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          isPopular
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : plan.id === 'pro'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getPlanIcon(plan.id)}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          {plan.name}
                        </h2>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                            (Seu plano atual)
                          </span>
                        )}
                      </div>
                    </div>

                    {plan.id === 'pro' && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        VIP
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 min-h-[34px] leading-relaxed mb-5">
                    {plan.tagline}
                  </p>

                  {/* Price Tag */}
                  <div className="py-3 border-y border-slate-100 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">R$</span>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/mês</span>
                    </div>

                    {/* Annual billing detail */}
                    {billingCycle === 'annual' && !isFree ? (
                      <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                        <span>R$ {plan.annualTotalPrice.toFixed(2).replace('.', ',')} faturado anualmente</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">
                        {isFree ? 'Gratuito para sempre' : 'Faturamento mensal flexível'}
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-6 flex-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      Recursos inclusos
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Specs Highlight */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 mb-6 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Limite diário:</span>
                      <span className="font-bold text-slate-800">{plan.limits.dailyUsage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Anúncios:</span>
                      <span className="font-bold text-slate-800">{plan.limits.ads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Suporte:</span>
                      <span className="font-bold text-slate-800">{plan.limits.support}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    id={`btn-plan-cta-${plan.id}`}
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 hover:shadow-lg'
                        : plan.id === 'pro'
                        ? 'bg-slate-900 hover:bg-indigo-600 text-white shadow-md'
                        : isFree
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        : 'bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </button>
                  <span className="text-[10px] text-center text-slate-400 block mt-2 font-medium">
                    {isFree ? 'Sem cartão de crédito' : 'Cancele a qualquer momento'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Matrix Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Comparativo Detalhado
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            Compare lado a lado todas as funcionalidades
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Veja exatamente o que cada plano oferece para tomar a melhor decisão para as suas necessidades.
          </p>

          {/* Filter category tabs for dense review */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setComparisonCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  comparisonCategoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos os Recursos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-6 text-xs font-black uppercase tracking-wider text-slate-500 w-2/5">
                    Recurso / Capacidade
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-700 text-center w-3/20">
                    Grátis
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-blue-600 text-center w-3/20">
                    Básico
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50/60 text-center w-3/20">
                    Premium ★
                  </th>
                  <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-center w-3/20">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredComparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      <div className="flex flex-col">
                        <span>{row.feature}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {row.category}
                        </span>
                      </div>
                    </td>

                    {/* Free column */}
                    <td className="py-4 px-4 text-center text-slate-600">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[2.5]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto stroke-[2]" />
                        )
                      ) : (
                        <span className="font-medium">{row.free}</span>
                      )}
                    </td>

                    {/* Basic column */}
                    <td className="py-4 px-4 text-center text-slate-700 font-medium">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[2.5]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto stroke-[2]" />
                        )
                      ) : (
                        <span>{row.basic}</span>
                      )}
                    </td>

                    {/* Premium column (Highlighted) */}
                    <td className="py-4 px-4 text-center text-blue-900 font-bold bg-blue-50/30">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <Check className="w-4 h-4 text-blue-600 mx-auto stroke-[3]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto stroke-[2]" />
                        )
                      ) : (
                        <span>{row.premium}</span>
                      )}
                    </td>

                    {/* Pro column */}
                    <td className="py-4 px-4 text-center text-slate-900 font-black">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[3]" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto stroke-[2]" />
                        )
                      ) : (
                        <span>{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Perguntas Frequentes (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            Tire todas as suas dúvidas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Entenda como funcionam as assinaturas, renovações e segurança no ResolveAI.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Ready to Integrate Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-block mb-3">
              Infraestrutura Pronta para Pagamentos
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Pronto para crescer com você
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Todos os limites, tiers de permissão e interfaces estão preparados para plugar seu gateway definitivo (Stripe, Mercado Pago ou Asaas) sem retrabalho.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              id="btn-footer-cta-free"
              onClick={() => handlePlanClick(PLANS_DATA[0])}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wide transition-all border border-white/20 cursor-pointer"
            >
              Começar Grátis
            </button>
            <button
              id="btn-footer-cta-premium"
              onClick={() => handlePlanClick(PLANS_DATA[2])}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-wide transition-all shadow-md cursor-pointer"
            >
              Assinar Premium
            </button>
          </div>
        </div>
      </section>

      {/* Checkout Integration Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlanForModal}
        billingCycle={billingCycle}
        onActivatePlan={handleActivatePlan}
      />
    </div>
  );
};
