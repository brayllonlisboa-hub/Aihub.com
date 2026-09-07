import React, { useState } from 'react';
import { ResolutionResult, SolutionItem, SolutionFeedback, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SolutionCard } from './SolutionCard';
import { ComparisonTable } from './ComparisonTable';
import { ActionPlanSection } from './ActionPlanSection';
import { SolutionFeedbackModal } from './SolutionFeedbackModal';
import {
  AlertTriangle,
  Clock,
  Users,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface AnalysisViewProps {
  language: Language;
  result: ResolutionResult;
  onNewProblem: () => void;
  onSaveFeedback: (feedback: SolutionFeedback) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  language,
  result,
  onNewProblem,
  onSaveFeedback,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'all' | 'solutions' | 'comparison' | 'plan'>('all');
  const [copied, setCopied] = useState(false);
  const [selectedSolutionForFeedback, setSelectedSolutionForFeedback] = useState<SolutionItem | null>(null);

  const recommendedSolutionItem =
    result.solutions.find((s) => s.id === result.recommended.solutionId) || result.solutions[0];

  const handleCopyReport = () => {
    const textReport = `
RESOLVEAI - RELATÓRIO DIAGNÓSTICO E SOLUÇÕES
Problema: ${result.problemPrompt}

1. RESUMO:
${result.summary}

2. CAUSAS PROVÁVEIS:
${result.causes.map((c, i) => `${i + 1}. [${c.category}] ${c.title}: ${c.description} (Probabilidade: ${c.likelihood})`).join('\n')}

3. GRAVIDADE: ${result.severity.level} (${result.severity.score}/10) - ${result.severity.explanation}
4. URGÊNCIA: ${result.urgency.level} (${result.urgency.timeframe}) - ${result.urgency.explanation}

5. PESSOAS AFETADAS:
${result.affectedPeople.map((p) => `- ${p.group}: ${p.impactDescription}`).join('\n')}

6. CONSEQUÊNCIAS DE NÃO RESOLVER:
- Imediatos: ${result.consequences.immediateRisks.join(', ')}
- Médio/Longo Prazo: ${result.consequences.longTermRisks.join(', ')}
- Pior Cenário: ${result.consequences.worstCaseScenario}

7. CINCO SOLUÇÕES ANALISADAS:
${result.solutions
  .map(
    (s) =>
      `#${s.id} ${s.title} (${s.category}) | Eficácia: ${s.efficacyScore}% | Prazo: ${s.estimatedTime} | Esforço: ${s.effort} | Custo: ${s.cost}\nResumo: ${s.summary}`
  )
  .join('\n\n')}

8. MELHOR SOLUÇÃO RECOMENDADA:
#${result.recommended.solutionId} - ${result.recommended.title}
Por que: ${result.recommended.whyRecommended}

9. PLANO DE AÇÃO PASSO A PASSO (Tempo Total: ${result.actionPlan.totalEstimatedTime}):
${result.actionPlan.phases
  .map(
    (ph) =>
      `\n[Fase: ${ph.phaseName} - ${ph.timeframe}]\n` +
      ph.steps.map((st) => `${st.stepNumber}. ${st.title} (${st.responsibleRole}): ${st.description} -> Meta: ${st.expectedOutcome}`).join('\n')
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFeedbackForSolution = (solutionId: number) => {
    return result.feedbacks?.find((f) => f.solutionId === solutionId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Banner Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            {t.completeAnalysis} • ID #{result.id.slice(-6)}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 line-clamp-1">
            {result.problemPrompt}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600" />
            <span>{copied ? t.copied : t.copyReport}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.print}</span>
          </button>
          <button
            type="button"
            onClick={onNewProblem}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.newProblem}</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: t.tabAll },
          { id: 'solutions', label: t.tabSolutions },
          { id: 'comparison', label: t.tabComparison },
          { id: 'plan', label: t.tabPlan },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID (Matches Bold Typography Theme Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Problem Diagnostics (Items 1, 2, 3, 4, 5, 6) */}
        {(activeTab === 'all' || activeTab === 'solutions') && (
          <section className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Problem Overview, Severity, Urgency, Affected */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">
                {t.sec1Title}
              </h3>

              {result.professionalNotice && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 mb-5 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block font-black text-amber-900 uppercase tracking-wider mb-0.5">
                      {language === 'en'
                        ? 'Professional Guidance Recommended'
                        : language === 'es'
                        ? 'Orientación Profesional Recomendada'
                        : 'Recomendação de Orientação Profissional'}
                    </strong>
                    <p className="font-medium text-amber-900/90 leading-relaxed">
                      {result.professionalNotice}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-900 mb-6 whitespace-pre-line">
                {result.summary}
              </p>

              {/* Metrics rows */}
              <div className="space-y-4 text-xs">
                {/* 3. Gravidade */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    {t.sec3Title.replace(/^\d+\.\s*/, '')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono font-bold">
                      {result.severity.score}/10
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                        result.severity.score >= 8
                          ? 'bg-red-100 text-red-700'
                          : result.severity.score >= 5
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {result.severity.level}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-2">
                  {result.severity.explanation}
                </p>

                {/* 4. Urgência */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 pt-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">
                    {t.sec4Title.replace(/^\d+\.\s*/, '')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono font-bold">
                      {result.urgency.timeframe}
                    </span>
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-black rounded-lg">
                      {result.urgency.level}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-2">
                  {result.urgency.explanation}
                </p>

                {/* 5. Pessoas afetadas */}
                <div className="pt-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    {t.sec5Title.replace(/^\d+\.\s*/, '')}
                  </span>
                  <div className="space-y-2">
                    {result.affectedPeople.map((af, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60"
                      >
                        <strong className="block text-slate-900 font-black text-xs">
                          {af.group}
                        </strong>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {af.impactDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Probable causes & Inaction Consequences in Dark Slate */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-6">
              {/* 2. Causas Prováveis */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  {t.sec2Title}
                </h3>
                <ul className="space-y-4">
                  {result.causes.map((c, i) => {
                    const numeral = i + 1 < 10 ? `0${i + 1}.` : `${i + 1}.`;
                    return (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="text-blue-400 font-black text-sm shrink-0">
                          {numeral}
                        </span>
                        <div>
                          <strong className="block text-xs font-black text-white">
                            {c.title}{' '}
                            <span className="text-[10px] font-normal text-slate-400">
                              ({c.category})
                            </span>
                          </strong>
                          <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
                            {c.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 6. Consequências de Não Resolver */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-red-400">
                  {t.sec6Title}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                      {t.immediateRisks}:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 font-medium pl-1 mt-0.5 space-y-1">
                      {result.consequences.immediateRisks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                      {t.worstCaseScenario}:
                    </span>
                    <p className="text-slate-400 italic text-xs mt-0.5 leading-relaxed">
                      "{result.consequences.worstCaseScenario}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RIGHT COLUMN: Solutions (7), Comparison (8), Recommended (9), Plan (10) */}
        <section
          className={`flex flex-col gap-8 ${
            activeTab === 'all' || activeTab === 'solutions'
              ? 'lg:col-span-8'
              : 'lg:col-span-12'
          }`}
        >
          {/* 7. CINCO POSSÍVEIS SOLUÇÕES */}
          {(activeTab === 'all' || activeTab === 'solutions') && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                    {t.sec7Title}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Soluções Analisadas
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.sec7Subtitle}
                </p>
              </div>

              {/* Solutions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.solutions.map((sol) => {
                  const isRec = sol.id === result.recommended.solutionId;
                  const feedback = getFeedbackForSolution(sol.id);
                  return (
                    <SolutionCard
                      key={sol.id}
                      solution={sol}
                      isRecommended={isRec}
                      language={language}
                      feedback={feedback}
                      onOpenFeedback={(s) => setSelectedSolutionForFeedback(s)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. MELHOR SOLUÇÃO RECOMENDADA SPOTLIGHT CARD */}
          {(activeTab === 'all' || activeTab === 'solutions') && (
            <div className="bg-white rounded-3xl border-2 border-blue-600 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                  {t.sec9Title}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-2">
                #{result.recommended.solutionId} — {result.recommended.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                {result.recommended.whyRecommended}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <h5 className="font-black uppercase tracking-widest text-emerald-800 mb-2">
                    {t.criticalSuccessFactors}
                  </h5>
                  <ul className="space-y-1.5 text-emerald-950 font-medium">
                    {result.recommended.criticalSuccessFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <h5 className="font-black uppercase tracking-widest text-amber-800 mb-2">
                    {t.commonPitfalls}
                  </h5>
                  <ul className="space-y-1.5 text-amber-950 font-medium">
                    {result.recommended.potentialPitfallsToAvoid.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 8. COMPARAÇÃO ENTRE AS SOLUÇÕES */}
          {(activeTab === 'all' || activeTab === 'comparison') && (
            <ComparisonTable
              language={language}
              solutions={result.solutions}
              comparison={result.comparison}
              recommendedId={result.recommended.solutionId}
            />
          )}

          {/* 10. PLANO DE AÇÃO PASSO A PASSO */}
          {(activeTab === 'all' || activeTab === 'plan') && (
            <ActionPlanSection
              language={language}
              actionPlan={result.actionPlan}
            />
          )}

          {/* Big Action Footer Button (from Bold Typography theme) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onNewProblem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-base uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.newProblem}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>

      {/* Solution Feedback Modal */}
      <SolutionFeedbackModal
        isOpen={!!selectedSolutionForFeedback}
        onClose={() => setSelectedSolutionForFeedback(null)}
        solution={selectedSolutionForFeedback}
        resolutionId={result.id}
        language={language}
        existingFeedback={
          selectedSolutionForFeedback
            ? getFeedbackForSolution(selectedSolutionForFeedback.id)
            : undefined
        }
        onSubmitFeedback={(fb) => {
          onSaveFeedback(fb);
          setSelectedSolutionForFeedback(null);
        }}
      />
    </div>
  );
};
