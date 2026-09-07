import React from 'react';
import { Home, Sparkles, Compass, CreditCard, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface NotFoundViewProps {
  onNavigate: (view: AppView) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 text-blue-600 text-3xl font-black mb-6">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          Página não encontrada
        </h1>

        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed mb-8">
          O caminho solicitado não existe ou foi movido. Use os atalhos abaixo para continuar navegando no AI Hub com tranquilidade.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-blue-600">
                Início
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Diagnóstico de problemas</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-blue-600">
                Central Criar
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Estúdio de IA multimídia</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-blue-600">
                Dashboard
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Métricas e histórico</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('plans')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-amber-600">
                Planos & Preços
              </div>
              <div className="text-[11px] text-slate-400 font-medium">A partir de R$ 5,99</div>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a página principal</span>
        </button>
      </div>
    </div>
  );
};
