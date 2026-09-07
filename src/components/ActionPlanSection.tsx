import React, { useState } from 'react';
import { ActionPlanPhase, ActionPlanStep, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Check, Clock, User, Target } from 'lucide-react';

interface ActionPlanSectionProps {
  language: Language;
  actionPlan: {
    totalEstimatedTime: string;
    phases: ActionPlanPhase[];
  };
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({
  language,
  actionPlan,
}) => {
  const t = TRANSLATIONS[language];
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const allSteps = actionPlan.phases.flatMap((p) => p.steps);
  const totalCount = allSteps.length;
  const completedCount = allSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col space-y-8">
      {/* Header matching Bold Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
              Plan
            </span>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {t.actionPlanTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.totalTimeLabel}: {actionPlan.totalEstimatedTime} • {t.actionPlanSubtitle}
            </p>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shrink-0">
          <div className="text-2xl font-black text-blue-600 font-mono">
            {progressPercent}%
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {completedCount} {t.completedOf} {totalCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden -mt-4">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Phases and Steps with Big Bold Numerals */}
      <div className="space-y-8">
        {actionPlan.phases.map((phase, phaseIdx) => (
          <div key={phaseIdx} className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                Fase {phaseIdx + 1}: {phase.phaseName}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {phase.timeframe}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {phase.steps.map((step, stepIdx) => {
                const isDone = !!completedSteps[step.id];
                const numeral = step.stepNumber < 10 ? `0${step.stepNumber}` : `${step.stepNumber}`;

                return (
                  <div
                    key={step.id || stepIdx}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200/80 hover:border-blue-300'
                    }`}
                  >
                    {/* Big Bold Numerals (from theme) */}
                    <div className="text-2xl sm:text-3xl font-black text-slate-300 select-none shrink-0 w-8">
                      {numeral}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong
                          className={`text-sm font-black tracking-tight leading-snug ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </strong>

                        {/* Complete Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleStep(step.id)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-blue-600 text-white'
                              : 'border-2 border-slate-300 hover:border-blue-600 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-2">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {step.responsibleRole}
                        </span>
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {step.expectedOutcome}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
