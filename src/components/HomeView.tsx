import React, { useState } from 'react';
import {
  ArrowRight,
  Lightbulb,
  History,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Video,
  Image as ImageIcon,
  FileText,
  Music,
  Code,
  Compass,
  Gift,
} from 'lucide-react';
import { ResolutionResult, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HomeViewProps {
  language: Language;
  onSubmit: (problemText: string) => void;
  isLoading: boolean;
  savedResolutions: ResolutionResult[];
  onSelectSaved: (item: ResolutionResult) => void;
  onOpenPlans?: () => void;
  onOpenCreate?: () => void;
  onOpenDashboard?: () => void;
  onOpenReferral?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onSubmit,
  isLoading,
  savedResolutions,
  onSelectSaved,
  onOpenPlans,
  onOpenCreate,
  onOpenDashboard,
  onOpenReferral,
}) => {
  const t = TRANSLATIONS[language];
  const [problemText, setProblemText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim() || isLoading) return;
    onSubmit(problemText.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-16">
      {/* Brand & Introduction Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>AI Hub Pro</span>
          </div>

          {onOpenCreate && (
            <button
              type="button"
              id="btn-banner-create-home"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs group"
            >
              <Sparkles className="w-3 h-3 text-blue-200" />
              <span>Central ✨ Criar com IA</span>
              <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {onOpenPlans && (
            <button
              type="button"
              id="btn-banner-plans-home"
              onClick={onOpenPlans}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <span>Conheça nossos Planos</span>
              <ArrowRight className="w-3 h-3 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {onOpenReferral && (
            <button
              type="button"
              onClick={onOpenReferral}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Gift className="w-3 h-3 text-purple-600" />
              <span>Indique & Ganhe</span>
            </button>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900">
          AI<span className="text-blue-600">Hub</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          {t.heroDescription}
        </p>
      </div>

      {/* Main Input Card */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
          <label
            htmlFor="input-problem"
            className="block text-lg sm:text-xl font-black tracking-tight text-slate-900 mb-3"
          >
            {t.problemInputLabel}
          </label>

          <textarea
            id="input-problem"
            rows={5}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            disabled={isLoading}
            placeholder={t.problemPlaceholder}
            className="w-full resize-y min-h-[140px] text-slate-800 placeholder:text-slate-400 text-base sm:text-lg font-medium leading-relaxed bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
          />

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              {t.problemHint}
            </span>
            <span className="self-end text-slate-400 font-mono font-bold">
              {problemText.length} {t.charCount}
            </span>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          id="btn-resolve-problem"
          type="submit"
          disabled={!problemText.trim() || isLoading}
          className="w-full py-4 sm:py-5 px-8 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.resolvingButton}</span>
            </>
          ) : (
            <>
              <span>{t.resolveButton}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Ferramentas de IA Quick Grid */}
      {onOpenCreate && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ferramentas Criativas de IA</span>
            </h3>
            <button
              type="button"
              onClick={onOpenCreate}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline cursor-pointer"
            >
              Abrir Central Criar →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'video', label: 'Vídeo IA', icon: Video, desc: 'Roteiros & Cenas', bg: 'hover:border-red-300' },
              { id: 'image', label: 'Imagens', icon: ImageIcon, desc: 'Prompts & Logos', bg: 'hover:border-purple-300' },
              { id: 'text', label: 'Textos', icon: FileText, desc: 'Copywriting & E-mails', bg: 'hover:border-blue-300' },
              { id: 'audio', label: 'Áudios', icon: Music, desc: 'Locução & FX', bg: 'hover:border-amber-300' },
              { id: 'code', label: 'Códigos', icon: Code, desc: 'Full-stack & Scripts', bg: 'hover:border-emerald-300' },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={onOpenCreate}
                  className={`p-3.5 rounded-2xl bg-white border border-slate-200 ${tool.bg} hover:shadow-xs transition-all text-left group cursor-pointer`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center mb-2 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-600">
                    {tool.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    {tool.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Samples in Current Language */}
      <div className="mt-12">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center sm:text-left">
          {t.orTrySample}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.samples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProblemText(sample.text)}
              className="text-left p-4 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  {sample.tag}
                </span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Use scenario →' : language === 'es' ? 'Usar caso →' : 'Usar exemplo →'}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 mb-1 leading-snug">
                {sample.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent History Quick Shelf */}
      {savedResolutions.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.recentResolutions}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {t.savedLocally}
            </span>
          </div>

          <div className="space-y-2">
            {savedResolutions.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSaved(item)}
                className="w-full text-left p-4 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {item.severity.level}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600">
                      {item.problemPrompt}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {item.summary}
                  </p>
                </div>
                <div className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 flex items-center gap-1">
                  <span>{t.reopen}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3 Pillars (Bold Typography) */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200 text-center">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-black text-base">
            01
          </div>
          <h4 className="text-sm font-black text-slate-900 mb-1">{t.pillar1Title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.pillar1Desc}</p>
        </div>
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-black text-base">
            02
          </div>
          <h4 className="text-sm font-black text-slate-900 mb-1">{t.pillar2Title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.pillar2Desc}</p>
        </div>
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-black text-base">
            03
          </div>
          <h4 className="text-sm font-black text-slate-900 mb-1">{t.pillar3Title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.pillar3Desc}</p>
        </div>
      </div>
    </div>
  );
};
