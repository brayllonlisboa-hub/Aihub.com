import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { SubscriptionPlanItem, BillingCycle, PlanTier } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlanItem | null;
  billingCycle: BillingCycle;
  onActivatePlan: (planId: PlanTier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onActivatePlan,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('pix');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const isFree = plan.id === 'free';
  const price = billingCycle === 'annual' ? plan.annualMonthlyPrice : plan.monthlyPrice;
  const totalPrice = billingCycle === 'annual' ? plan.annualTotalPrice : plan.monthlyPrice;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onActivatePlan(plan.id);
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-6 text-white relative">
          <button
            id="btn-close-checkout-modal"
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
              {isFree ? 'Acesso Gratuito' : 'Checkout Seguro'}
            </span>
            {billingCycle === 'annual' && !isFree && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950">
                Economia de 20%
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black tracking-tight">
            Plano {plan.name}
          </h3>
          <p className="text-blue-100 text-xs mt-1">
            {plan.tagline}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                {isFree ? 'Plano Grátis Confirmado!' : `Plano ${plan.name} Ativado!`}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                {isFree
                  ? 'Você já pode aproveitar todas as funções essenciais e limites diários gratuitos do ResolveAI.'
                  : `Seu plano ${plan.name} foi configurado na simulação. Todos os recursos adicionais, limites expandidos e prioridade estão ativos.`}
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs text-slate-700 mb-6 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Plano selecionado:</span>
                  <span>{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ciclo de faturamento:</span>
                  <span>{billingCycle === 'annual' ? 'Anual' : 'Mensal'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="font-bold text-blue-600">
                    {isFree ? 'R$ 0,00' : `R$ ${totalPrice.toFixed(2).replace('.', ',')} / ${billingCycle === 'annual' ? 'ano' : 'mês'}`}
                  </span>
                </div>
              </div>

              <button
                id="btn-confirm-success-close"
                onClick={handleResetAndClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wide transition-all shadow-md shadow-blue-200 cursor-pointer"
              >
                Começar a usar agora
              </button>
            </div>
          ) : (
            /* Standard Checkout View */
            <div className="space-y-5">
              {/* Pricing breakdown summary card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Resumo do Investimento
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">
                      R$ {price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/mês</span>
                  </div>
                  {billingCycle === 'annual' && !isFree && (
                    <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                      Faturado anualmente: R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    {plan.limits.dailyUsage}
                  </span>
                </div>
              </div>

              {/* Free Plan Instant Activate vs Paid Methods */}
              {isFree ? (
                <div className="space-y-4 pt-1">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" /> Sem necessidade de cartão de crédito
                    </p>
                    O plano gratuito é ativado imediatamente sem cobrança. Você ganha acesso instantâneo ao ResolveAI com até 3 análises diárias e suporte padrão.
                  </div>

                  <button
                    id="btn-activate-free-plan"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Configurando acesso...' : 'Começar a usar gratuitamente'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Payment Methods tabs prepared for gateway */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Forma de Pagamento (Preparado para Integração)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'pix'
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <QrCode className="w-5 h-5 text-blue-600" />
                        <span className="text-xs">Pix</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Imediato</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'card'
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-xs">Cartão</span>
                        <span className="text-[10px] text-slate-400">Até 12x</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          paymentMethod === 'boleto'
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-xs">Boleto</span>
                        <span className="text-[10px] text-slate-400">1-2 dias</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Mock Preview Box */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                    {paymentMethod === 'pix' && (
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Chave Pix Copia e Cola & QR Code serão gerados dinamicamente via gateway.</span>
                      </div>
                    )}
                    {paymentMethod === 'card' && (
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Formulário tokenizado compatível com Stripe Elements / Mercado Pago SDK.</span>
                      </div>
                    )}
                    {paymentMethod === 'boleto' && (
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Código de barras emitido com confirmação bancária automática por webhook.</span>
                      </div>
                    )}

                    {/* Developer / Gateway connection notice */}
                    <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Estrutura pronta para conexão:</strong> basta plugar a chave do provedor de pagamento (Stripe, Mercado Pago ou Asaas) no backend.
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    id="btn-simulate-checkout-subscription"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm tracking-wide transition-all shadow-md shadow-blue-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processando solicitação...</span>
                      </div>
                    ) : (
                      <>
                        <span>Simular Assinatura do {plan.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Guarantees & Badges */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Criptografia SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
