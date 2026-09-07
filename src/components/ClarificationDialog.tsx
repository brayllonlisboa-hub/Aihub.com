import React, { useState } from 'react';
import { HelpCircle, ArrowRight, X, AlertCircle, Check } from 'lucide-react';
import { ClarifyResponse, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface ClarificationDialogProps {
  language: Language;
  clarifyData: ClarifyResponse;
  originalProblem: string;
  onProceed: (answers: Record<string, string>) => void;
  onSkip: () => void;
  onCancel: () => void;
  isResolving: boolean;
}

export const ClarificationDialog: React.FC<ClarificationDialogProps> = ({
  language,
  clarifyData,
  originalProblem,
  onProceed,
  onSkip,
  onCancel,
  isResolving,
}) => {
  const t = TRANSLATIONS[language];
  const questions = clarifyData.questions || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleOptionClick = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === option ? '' : option,
    }));
  };

  const handleInputChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const answeredCount = Object.values(answers).filter((v) => typeof v === 'string' && v.trim().length > 0).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {t.clarifyBadge}
                </span>
                {clarifyData.detectedCategory && (
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    {clarifyData.detectedCategory}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-1">
                {t.clarifyTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isResolving}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Explanatory Banner */}
        <div className="px-5 sm:px-6 py-3.5 bg-blue-50/70 border-b border-blue-100 text-xs text-blue-950 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {t.clarifyNotice}
          </p>
        </div>

        {/* Questions Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100">
          {questions.map((q, index) => {
            const currentAnswer = answers[q.id] || '';
            const stepNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
            return (
              <div key={q.id} className={index > 0 ? 'pt-5' : ''}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <label className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                    <span className="text-blue-600 font-black text-sm">
                      {stepNum}.
                    </span>
                    {q.question}
                  </label>
                </div>

                <p className="text-xs text-slate-500 mb-3 ml-7 font-medium">
                  <span className="font-bold text-slate-700">{t.whyItMatters} </span>
                  {q.whyItMatters}
                </p>

                {/* Suggested quick chips */}
                {q.suggestedOptions && q.suggestedOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5 ml-7">
                    {q.suggestedOptions.map((opt) => {
                      const isSelected = currentAnswer === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionClick(q.id, opt)}
                          className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Custom input */}
                <div className="ml-7">
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    placeholder={q.placeholder || t.customPlaceholder}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkip}
            disabled={isResolving}
            className="order-2 sm:order-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
          >
            {t.analyzeWithoutAnswering}
          </button>

          <div className="order-1 sm:order-2 flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              disabled={isResolving}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
            >
              {t.back}
            </button>
            <button
              type="button"
              id="btn-confirm-clarifications"
              onClick={() => onProceed(answers)}
              disabled={isResolving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-200 cursor-pointer disabled:opacity-50"
            >
              {isResolving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.resolvingButton}</span>
                </>
              ) : (
                <>
                  <span>
                    {t.generateCompleteAnalysis}
                    {answeredCount > 0 ? ` (${answeredCount} ${t.answeredCountLabel})` : ''}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
