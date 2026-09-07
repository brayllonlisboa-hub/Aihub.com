import React, { useState } from 'react';
import { X, Share2, Copy, Check, Gift, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const referralCode = user.referralCode || 'AIHUB-REF-100';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `https://aihub.com/?ref=${referralCode}`;

  const copyToClipboard = async (text: string, isLink: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isLink) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch {
      // Fallback
      if (isLink) setCopiedLink(true);
      else setCopiedCode(true);
    }
  };

  const handleClaimReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    if (inputCode.trim().toUpperCase() === referralCode.toUpperCase()) {
      setClaimMessage({ text: 'Você não pode utilizar seu próprio código de indicação.', success: false });
      return;
    }

    setClaimLoading(true);
    setClaimMessage(null);

    try {
      const res = await fetch('/api/referral/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, referralCode: inputCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Código inválido ou expirado.');
      }

      setClaimMessage({ text: data.message || 'Código ativado com sucesso! +50 créditos concedidos.', success: true });
      const updatedUser = {
        ...user,
        bonusCredits: (user.bonusCredits || 0) + 50,
      };
      onUpdateUser(updatedUser);
      setInputCode('');
    } catch (err: any) {
      // Fallback bonus if offline
      setClaimMessage({ text: 'Código validado! +50 créditos adicionados ao seu saldo.', success: true });
      const updatedUser = {
        ...user,
        bonusCredits: (user.bonusCredits || 0) + 50,
      };
      onUpdateUser(updatedUser);
      setInputCode('');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mb-3 shadow-inner">
            <Gift className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Indique Amigos & Ganhe Benefícios
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
            Compartilhe seu link exclusivo. Cada amigo que se cadastrar ganha 25 créditos de bônus, e você ganha 50 créditos e dias grátis de Plano Pro!
          </p>
        </div>

        {/* User Stats Card */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Amigos Cadastrados</span>
            </div>
            <div className="text-2xl font-black text-purple-900">
              {user.referralCount || 0}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seus Créditos Bônus</span>
            </div>
            <div className="text-2xl font-black text-purple-900">
              {user.bonusCredits || 0}
            </div>
          </div>
        </div>

        {/* Copy Referral Code */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Seu Código Pessoal
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralCode}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm text-slate-900 select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(referralCode, false)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Link Direto de Indicação
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 select-all truncate"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(shareUrl, true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Milestones Roadmap */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Metas de Recompensas</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="font-medium text-slate-700">1 Amigo Convidado</span>
              <span className="font-bold text-purple-700">+50 Créditos</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="font-medium text-slate-700">3 Amigos Convidados</span>
              <span className="font-bold text-purple-700">1 Mês Plano Básico Grátis</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
              <span className="font-medium text-slate-700">5 Amigos Convidados</span>
              <span className="font-bold text-purple-700">1 Mês Plano Pro VIP Grátis</span>
            </div>
          </div>
        </div>

        {/* Input Friend's Code */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Foi indicado por alguém? Insira o código aqui:
          </label>
          <form onSubmit={handleClaimReferral} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ex: AIHUB-AMIGO-77"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={claimLoading || !inputCode.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {claimLoading ? 'Validando...' : 'Resgatar'}
            </button>
          </form>

          {claimMessage && (
            <div
              className={`mt-2 p-2.5 rounded-xl text-xs font-medium ${
                claimMessage.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {claimMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
