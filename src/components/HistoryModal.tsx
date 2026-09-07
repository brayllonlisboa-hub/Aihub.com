import React, { useState } from 'react';
import { ResolutionResult, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { History, X, Search, Trash2, ArrowRight, Calendar, AlertCircle, Star, Download } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  savedResolutions: ResolutionResult[];
  onSelect: (item: ResolutionResult) => void;
  onDelete: (id: string) => void;
  onClearAll?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  language,
  savedResolutions,
  onSelect,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const filtered = savedResolutions.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.problemPrompt.toLowerCase().includes(term) ||
      item.summary.toLowerCase().includes(term) ||
      item.recommended?.title?.toLowerCase().includes(term) ||
      item.solutions?.some((s) => s.title.toLowerCase().includes(term))
    );
  });

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedResolutions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resolveai_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                {t.historyModalTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {savedResolutions.length} {t.historyModalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Export Action */}
        {savedResolutions.length > 0 && (
          <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.historySearchPlaceholder}
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium bg-slate-50/50"
              />
            </div>
            <button
              type="button"
              onClick={handleExportAll}
              title="Export JSON"
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* List of Problems */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-4">
          {savedResolutions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-black text-slate-700">{t.emptyHistory}</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t.emptyHistorySub}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              {t.noResults} "{searchTerm}"
            </div>
          ) : (
            filtered.map((item) => {
              const feedbacksCount = item.feedbacks?.length || 0;
              return (
                <div
                  key={item.id}
                  className="pt-4 first:pt-0 flex items-start justify-between gap-3 group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="flex-1 text-left min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {item.severity.level}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.language.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {feedbacksCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {feedbacksCount} avaliado
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 line-clamp-1 tracking-tight">
                      {item.problemPrompt}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="mt-2 text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      <span className="text-blue-600">
                        {t.recommendedSolutionLabel}: {item.recommended?.title}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        5 {t.tabSolutions.toLowerCase()}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t.deletePrompt}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title={t.reopen}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
