import React, { useState } from 'react';
import { SolutionItem, SolutionFeedback, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Star, X, Check, ThumbsUp, AlertCircle, Sparkles, Send } from 'lucide-react';

interface SolutionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: SolutionItem | null;
  resolutionId: string;
  language: Language;
  existingFeedback?: SolutionFeedback;
  onSubmitFeedback: (feedback: SolutionFeedback) => void;
}

export const SolutionFeedbackModal: React.FC<SolutionFeedbackModalProps> = ({
  isOpen,
  onClose,
  solution,
  resolutionId,
  language,
  existingFeedback,
  onSubmitFeedback,
}) => {
  if (!isOpen || !solution) return null;

  const t = TRANSLATIONS[language];

  const [rating, setRating] = useState<number>(existingFeedback?.rating || 4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [status, setStatus] = useState<SolutionFeedback['status']>(
    existingFeedback?.status || 'not_tested'
  );
  const [whatWorked, setWhatWorked] = useState(existingFeedback?.whatWorked || '');
  const [whatDidntWork, setWhatDidntWork] = useState(existingFeedback?.whatDidntWork || '');
  const [generalComment, setGeneralComment] = useState(existingFeedback?.generalComment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackData: SolutionFeedback = {
      id: existingFeedback?.id || 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      resolutionId,
      solutionId: solution.id,
      rating,
      status,
      whatWorked,
      whatDidntWork,
      generalComment,
      createdAt: new Date().toISOString(),
    };

    try {
      // Send to server
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
    } catch (e) {
      console.warn('Could not post feedback to server, saving locally', e);
    }

    onSubmitFeedback(feedbackData);
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
              #{solution.id}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                {t.feedbackModalTitle}
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                {solution.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learning banner */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex items-center gap-2.5 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="leading-snug">
            {t.feedbackModalDesc}
          </p>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              {t.rateUtilityLabel}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 rounded-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold font-mono text-slate-700 ml-2">
                {rating}/5 estrelas
              </span>
            </div>
          </div>

          {/* Status Radio Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              {t.outcomeStatusLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'worked', label: t.outcomeWorked, color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                { id: 'partially', label: t.outcomePartially, color: 'text-amber-700 border-amber-300 bg-amber-50' },
                { id: 'failed', label: t.outcomeFailed, color: 'text-rose-700 border-rose-300 bg-rose-50' },
                { id: 'not_tested', label: t.outcomeNotTested, color: 'text-slate-700 border-slate-300 bg-slate-50' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as any)}
                  className={`text-left p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    status === opt.id
                      ? `${opt.color} ring-2 ring-blue-500`
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {status === opt.id && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* What Worked */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {t.whatWorkedLabel}
            </label>
            <textarea
              rows={2}
              value={whatWorked}
              onChange={(e) => setWhatWorked(e.target.value)}
              placeholder={t.whatWorkedPlaceholder}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
            />
          </div>

          {/* What Failed / Missing */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {t.whatFailedLabel}
            </label>
            <textarea
              rows={2}
              value={whatDidntWork}
              onChange={(e) => setWhatDidntWork(e.target.value)}
              placeholder={t.whatFailedPlaceholder}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
            />
          </div>

          {/* General Notes for AI Tuning */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {t.generalNotesLabel}
            </label>
            <input
              type="text"
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              placeholder={t.generalNotesPlaceholder}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || showSuccess}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {showSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{t.feedbackThanks}</span>
                </>
              ) : isSubmitting ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.submitFeedback}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
