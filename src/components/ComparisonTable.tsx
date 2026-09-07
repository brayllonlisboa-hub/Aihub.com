import React from 'react';
import { SolutionItem, ComparisonCriterion, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Award, Zap, Clock, TrendingUp, CheckCircle } from 'lucide-react';

interface ComparisonTableProps {
  language: Language;
  solutions: SolutionItem[];
  comparison: {
    overview: string;
    criteria: ComparisonCriterion[];
    matrixSummary: string;
  };
  recommendedId: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  language,
  solutions,
  comparison,
  recommendedId,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            {t.sec8Title}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          {t.comparisonSynthesis}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
          {comparison.overview}
        </p>
      </div>

      {/* Desktop/Tablet Matrix Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3">{t.colSolution}</th>
              <th className="py-3 px-3">{t.colEfficacy}</th>
              <th className="py-3 px-3">{t.colTime}</th>
              <th className="py-3 px-3">{t.colEffort}</th>
              <th className="py-3 px-3">{t.colCost}</th>
              <th className="py-3 px-3">{t.colStrength}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {solutions.map((sol) => {
              const isRec = sol.id === recommendedId;
              return (
                <tr
                  key={sol.id}
                  className={`transition-colors ${
                    isRec
                      ? 'bg-blue-50/60 font-semibold text-blue-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                          isRec ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {sol.id}
                      </span>
                      <div>
                        <div className="font-black text-slate-900 leading-tight">
                          {sol.title}
                        </div>
                        {isRec && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                            ★ {t.winnerLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-blue-600">
                      {sol.efficacyScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-600">
                    {sol.estimatedTime}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{sol.effort}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{sol.cost}</td>
                  <td className="py-3.5 px-3 text-xs text-slate-500 max-w-[200px] truncate">
                    {sol.pros[0] || sol.summary}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Decision Criteria Breakdown */}
      {comparison.criteria && comparison.criteria.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {t.sec8Subtitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comparison.criteria.map((crit, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-black text-slate-900 tracking-tight">
                    {crit.criterion}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    Solução #{crit.bestSolutionIndex}
                  </span>
                </div>
                <p className="text-slate-600 font-medium mb-1">{crit.explanation}</p>
                <p className="text-[11px] text-slate-500 italic">
                  "{crit.evaluationNote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytical Verdict Conclusion */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
        <span className="font-black uppercase tracking-widest text-blue-400">
          {t.matrixConclusion}:
        </span>
        <p className="text-slate-300 leading-relaxed font-medium">
          {comparison.matrixSummary}
        </p>
      </div>
    </div>
  );
};
