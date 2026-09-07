import React, { useState } from 'react';
import { SolutionItem, SolutionFeedback, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CheckCircle2, AlertTriangle, Clock, Zap, ChevronDown, ChevronUp, Star, Award, MessageSquare } from 'lucide-react';

interface SolutionCardProps {
  solution: SolutionItem;
  isRecommended: boolean;
  language: Language;
  feedback?: SolutionFeedback;
  onOpenFeedback: (solution: SolutionItem) => void;
  onSelectSolution?: (solution: SolutionItem) => void;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  isRecommended,
  language,
  feedback,
  onOpenFeedback,
  onSelectSolution,
}) => {
  const t = TRANSLATIONS[language];
  const [expanded, setExpanded] = useState(false);

  // When recommended, match the Design HTML hero card styling:
  // "bg-blue-600 p-5 rounded-3xl text-white relative overflow-hidden"
  if (isRecommended) {
    return (
      <div className="bg-blue-600 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-blue-200 flex flex-col justify-between">
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
          {t.recommendedTag}
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">
            #{solution.id} • {solution.category}
          </p>

          <h4 className="text-xl sm:text-2xl font-black leading-tight tracking-tight mb-3">
            {solution.title}
          </h4>

          <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium mb-4">
            {solution.summary}
          </p>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-white/10 rounded-2xl mb-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 block">
                {t.time}
              </span>
              <span className="font-bold flex items-center gap-1 mt-0.5 truncate">
                <Clock className="w-3 h-3 shrink-0" />
                {solution.estimatedTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 block">
                {t.effort}
              </span>
              <span className="font-bold mt-0.5 inline-block">
                {solution.effort}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 block">
                {t.efficacy}
              </span>
              <span className="font-black mt-0.5 inline-block">
                {solution.efficacyScore}%
              </span>
            </div>
          </div>

          {/* Pros/Cons Toggle */}
          {expanded && (
            <div className="space-y-3 pt-3 border-t border-white/20 text-xs mb-4">
              <div>
                <h5 className="font-black uppercase tracking-widest text-emerald-200 mb-1">
                  {t.advantages}:
                </h5>
                <ul className="space-y-1 opacity-90">
                  {solution.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-black uppercase tracking-widest text-amber-200 mb-1">
                  {t.cautions}:
                </h5>
                <ul className="space-y-1 opacity-90">
                  {solution.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-white/20 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold underline underline-offset-2 opacity-90 hover:opacity-100 cursor-pointer"
          >
            {expanded ? t.lessDetails : t.moreDetails}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenFeedback(solution)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title={t.rateSolution}
            >
              <Star className={`w-3.5 h-3.5 ${feedback ? 'fill-amber-300 text-amber-300' : ''}`} />
              <span>{feedback ? `${feedback.rating}★` : t.rateSolution}</span>
            </button>

            {onSelectSolution && (
              <button
                type="button"
                onClick={() => onSelectSolution(solution)}
                className="px-3 py-1.5 rounded-xl bg-white text-blue-900 text-xs font-black transition-all hover:bg-blue-50 cursor-pointer"
              >
                {t.focusPlan}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Bold Typography card
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            #{solution.id} • {solution.category}
          </p>
          <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            {solution.efficacyScore}%
          </span>
        </div>

        <h4 className="text-lg sm:text-xl font-black leading-tight tracking-tight text-slate-900 mb-3">
          {solution.title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
          {solution.summary}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl mb-4 text-xs font-medium">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              {t.time}
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              {solution.estimatedTime}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              {t.effort}
            </span>
            <span className="font-bold text-slate-800 mt-0.5 inline-block">
              {solution.effort}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              {t.cost}
            </span>
            <span className="font-bold text-slate-800 mt-0.5 inline-block">
              {solution.cost}
            </span>
          </div>
        </div>

        {/* Pros/Cons Toggle */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs mb-4">
            <div>
              <h5 className="font-black uppercase tracking-widest text-emerald-700 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.advantages}</span>
              </h5>
              <ul className="space-y-1 text-slate-600">
                {solution.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-black uppercase tracking-widest text-rose-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.cautions}</span>
              </h5>
              <ul className="space-y-1 text-slate-600">
                {solution.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
        >
          <span>{expanded ? t.lessDetails : t.moreDetails}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenFeedback(solution)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              feedback
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
            }`}
            title={t.rateSolution}
          >
            <Star className={`w-3.5 h-3.5 ${feedback ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>{feedback ? `${feedback.rating}★` : t.rateSolution}</span>
          </button>

          {onSelectSolution && (
            <button
              type="button"
              onClick={() => onSelectSolution(solution)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black transition-colors cursor-pointer"
            >
              {t.focusPlan}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
