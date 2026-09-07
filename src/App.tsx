import React, { useState, useEffect } from 'react';
import {
  ResolutionResult,
  ClarifyResponse,
  Language,
  SolutionFeedback,
  PlanTier,
  CategoryUsageCounts,
  CreatedItem,
  UserProfile,
  UserUsageState,
  AppView,
} from './types';
import { detectLanguage, setStoredLanguage, TRANSLATIONS } from './i18n/translations';
import {
  getSavedResolutions,
  saveResolution,
  deleteResolution,
  saveFeedbackToResolution,
} from './utils/storage';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ClarificationDialog } from './components/ClarificationDialog';
import { AnalysisView } from './components/AnalysisView';
import { HistoryModal } from './components/HistoryModal';
import { PricingView } from './components/PricingView';
import { CreationView } from './components/CreationView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { NotFoundView } from './components/NotFoundView';
import { AuthModal } from './components/AuthModal';
import { ReferralModal } from './components/ReferralModal';
import { SettingsModal } from './components/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AlertCircle, X, Sparkles, Compass, Shield, Heart } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [view, setView] = useState<AppView>('home');
  const [savedResolutions, setSavedResolutions] = useState<ResolutionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ResolutionResult | null>(null);

  // User Profile & Authentication State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('aihub_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: 'local_user',
      name: 'Visitante',
      email: 'visitante@aihub.com',
      plan: 'free',
      role: 'user',
      createdAt: new Date().toISOString(),
      referralCode: 'AIHUB-FREE-882',
      referralCount: 1,
      bonusCredits: 25,
    };
  });

  const currentPlan: PlanTier = user.plan || 'free';

  // Creation Studio State
  const [creationUsage, setCreationUsage] = useState<CategoryUsageCounts>(() => {
    try {
      const stored = localStorage.getItem('aihub_creation_usage');
      return stored ? JSON.parse(stored) : { video: 0, image: 0, text: 0, audio: 0, code: 0 };
    } catch {
      return { video: 0, image: 0, text: 0, audio: 0, code: 0 };
    }
  });

  const [savedCreations, setSavedCreations] = useState<CreatedItem[]>(() => {
    try {
      const stored = localStorage.getItem('aihub_creation_library');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Clarification and resolution loading states
  const [isLoading, setIsLoading] = useState(false);
  const [pendingProblem, setPendingProblem] = useState('');
  const [clarifyData, setClarifyData] = useState<ClarifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals visibility state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Initialize and sync
  useEffect(() => {
    const detected = detectLanguage();
    setLanguage(detected);
    const history = getSavedResolutions();
    setSavedResolutions(history);

    // Sync creation usage and library with backend
    const syncCreationData = async () => {
      try {
        const [usageRes, libRes] = await Promise.all([
          fetch(`/api/create/usage?userId=${user.id}&plan=${currentPlan}`),
          fetch(`/api/create/library?userId=${user.id}`),
        ]);

        if (usageRes.ok) {
          const uData = await usageRes.json();
          if (uData?.counts) {
            setCreationUsage(uData.counts);
            localStorage.setItem('aihub_creation_usage', JSON.stringify(uData.counts));
          }
        }

        if (libRes.ok) {
          const lData = await libRes.json();
          if (Array.isArray(lData?.items)) {
            setSavedCreations(lData.items);
            localStorage.setItem('aihub_creation_library', JSON.stringify(lData.items));
          }
        }
      } catch (err) {
        console.error('Error syncing creation data from backend:', err);
      }
    };

    syncCreationData();
  }, [user.id, currentPlan]);

  // Persist user on changes
  useEffect(() => {
    try {
      localStorage.setItem('aihub_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setStoredLanguage(newLang);
  };

  const handleNavigate = (newView: AppView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlan = (planId: PlanTier) => {
    setUser((prev) => {
      const updated = { ...prev, plan: planId };
      try {
        localStorage.setItem('aihub_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    const guestUser: UserProfile = {
      id: 'guest_' + Math.random().toString(36).substring(2, 7),
      name: 'Visitante',
      email: 'visitante@aihub.com',
      plan: 'free',
      role: 'user',
      createdAt: new Date().toISOString(),
      referralCode: 'AIHUB-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      referralCount: 0,
      bonusCredits: 10,
    };
    setUser(guestUser);
    try {
      localStorage.setItem('aihub_user', JSON.stringify(guestUser));
    } catch {}
  };

  const handleClearLocalData = () => {
    localStorage.removeItem('resolveai_history');
    localStorage.removeItem('aihub_creation_library');
    localStorage.removeItem('aihub_creation_usage');
    setSavedResolutions([]);
    setSavedCreations([]);
    setCreationUsage({ video: 0, image: 0, text: 0, audio: 0, code: 0 });
    setSettingsModalOpen(false);
    setView('home');
  };

  // Creation Central Handlers
  const handleItemGenerated = (newItem: CreatedItem) => {
    setSavedCreations((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.id !== newItem.id)];
      try {
        localStorage.setItem('aihub_creation_library', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setCreationUsage((prev) => {
      const cat = newItem.category;
      const updated = {
        ...prev,
        [cat]: (prev[cat] || 0) + 1,
      };
      try {
        localStorage.setItem('aihub_creation_usage', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteCreationItem = async (id: string) => {
    setSavedCreations((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('aihub_creation_library', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      await fetch(`/api/create/library/${id}?userId=${user.id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete creation item from server:', e);
    }
  };

  const handleToggleFavoriteCreation = async (id: string) => {
    let newFavState = false;
    setSavedCreations((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          newFavState = !item.isFavorite;
          return { ...item, isFavorite: newFavState };
        }
        return item;
      });
      try {
        localStorage.setItem('aihub_creation_library', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      await fetch(`/api/create/library/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, isFavorite: newFavState }),
      });
    } catch (e) {
      console.error('Failed to update favorite on server:', e);
    }
  };

  // Step 1: User submits problem from Home
  const handleProblemSubmit = async (problemText: string) => {
    setError(null);
    setIsLoading(true);
    setPendingProblem(problemText);

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemPrompt: problemText,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao processar análise preliminar.');
      }

      const data: ClarifyResponse = await res.json();

      if (data.needsClarification && data.questions && data.questions.length > 0) {
        setClarifyData(data);
        setIsLoading(false);
      } else {
        await executeResolution(problemText, {});
      }
    } catch (err: any) {
      console.error('Clarify error, falling back to direct resolution:', err);
      await executeResolution(problemText, {});
    }
  };

  // Step 2: Final Resolution Execution
  const executeResolution = async (problemText: string, answers: Record<string, string>) => {
    setError(null);
    setIsLoading(true);
    setClarifyData(null);

    try {
      const res = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemPrompt: problemText,
          language,
          clarificationAnswers: answers,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Erro ao gerar análise completa.');
      }

      const result: ResolutionResult = await res.json();

      saveResolution(result);
      setSavedResolutions(getSavedResolutions());

      setCurrentResult(result);
      setView('analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Resolution Error:', err);
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarificationProceed = (answers: Record<string, string>) => {
    executeResolution(pendingProblem, answers);
  };

  const handleClarificationSkip = () => {
    executeResolution(pendingProblem, {});
  };

  const handleSelectHistoryItem = (item: ResolutionResult) => {
    setCurrentResult(item);
    setView('analysis');
    setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteResolution(id);
    setSavedResolutions(getSavedResolutions());
    if (currentResult?.id === id) {
      setCurrentResult(null);
      setView('home');
    }
  };

  const handleNewProblem = () => {
    setCurrentResult(null);
    setPendingProblem('');
    setClarifyData(null);
    setError(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveFeedback = async (feedback: SolutionFeedback) => {
    if (!currentResult) return;
    saveFeedbackToResolution(currentResult.id, feedback);

    setCurrentResult((prev) => {
      if (!prev) return null;
      const existing = prev.feedbacks || [];
      return {
        ...prev,
        feedbacks: [...existing.filter((f) => f.solutionId !== feedback.solutionId), feedback],
      };
    });

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolutionId: currentResult.id,
          solutionId: feedback.solutionId,
          rating: feedback.rating,
          status: feedback.status,
          whatWorked: feedback.whatWorked,
          whatDidntWork: feedback.whatDidntWork,
          generalComment: feedback.generalComment,
        }),
      });
    } catch (err) {
      console.error('Failed to post feedback to backend:', err);
    }
  };

  const t = TRANSLATIONS[language];

  // User limits calculation for Dashboard
  const usageLimitsMap: Record<PlanTier, CategoryUsageCounts> = {
    free: { video: 3, image: 10, text: 20, audio: 5, code: 10 },
    basic: { video: 15, image: 50, text: 100, audio: 25, code: 50 },
    premium: { video: 50, image: 200, text: 500, audio: 100, code: 200 },
    pro: { video: 9999, image: 9999, text: 9999, audio: 9999, code: 9999 },
  };

  const currentLimits = usageLimitsMap[currentPlan];
  const userUsageState: UserUsageState = {
    date: new Date().toISOString().split('T')[0],
    usage: creationUsage,
    plan: currentPlan,
    limits: currentLimits,
    remaining: {
      video: Math.max(0, currentLimits.video - (creationUsage.video || 0)),
      image: Math.max(0, currentLimits.image - (creationUsage.image || 0)),
      text: Math.max(0, currentLimits.text - (creationUsage.text || 0)),
      audio: Math.max(0, currentLimits.audio - (creationUsage.audio || 0)),
      code: Math.max(0, currentLimits.code - (creationUsage.code || 0)),
    },
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Header */}
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          currentView={view}
          onNavigate={handleNavigate}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenReferral={() => setReferralModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'login');
            setAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          user={user}
          historyCount={savedResolutions.length}
          isAnalyzing={isLoading}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-rose-800 text-sm font-medium transition-all animate-in fade-in">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {pendingProblem && (
                  <button
                    onClick={() => executeResolution(pendingProblem, {})}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Try Again' : language === 'es' ? 'Reintentar' : 'Tentar Novamente'}
                  </button>
                )}
                <button
                  onClick={() => setError(null)}
                  className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1 w-full">
          {view === 'plans' ? (
            <PricingView
              currentPlan={currentPlan}
              onSelectPlan={handleSelectPlan}
              onBackToHome={handleNewProblem}
            />
          ) : view === 'create' ? (
            <CreationView
              currentPlan={currentPlan}
              usageCounts={creationUsage}
              savedItems={savedCreations}
              onOpenPlans={() => handleNavigate('plans')}
              onItemGenerated={handleItemGenerated}
              onDeleteItem={handleDeleteCreationItem}
              onToggleFavorite={handleToggleFavoriteCreation}
            />
          ) : view === 'dashboard' ? (
            <DashboardView
              user={user}
              usageState={userUsageState}
              createdItems={savedCreations}
              savedResolutions={savedResolutions}
              onNavigate={handleNavigate}
              onSelectResolution={handleSelectHistoryItem}
              onOpenReferral={() => setReferralModalOpen(true)}
              onOpenPlans={() => handleNavigate('plans')}
              onOpenHistory={() => setHistoryOpen(true)}
            />
          ) : view === 'admin' ? (
            <AdminView onNavigate={handleNavigate} />
          ) : view === '404' ? (
            <NotFoundView onNavigate={handleNavigate} />
          ) : view === 'analysis' && currentResult ? (
            <AnalysisView
              language={language}
              result={currentResult}
              onNewProblem={handleNewProblem}
              onSaveFeedback={handleSaveFeedback}
            />
          ) : (
            <HomeView
              language={language}
              onSubmit={handleProblemSubmit}
              isLoading={isLoading}
              savedResolutions={savedResolutions}
              onSelectSaved={handleSelectHistoryItem}
              onOpenPlans={() => handleNavigate('plans')}
              onOpenCreate={() => handleNavigate('create')}
              onOpenDashboard={() => handleNavigate('dashboard')}
              onOpenReferral={() => setReferralModalOpen(true)}
            />
          )}
        </main>

        {/* Clarification Dialog Modal */}
        {clarifyData && (
          <ClarificationDialog
            language={language}
            clarifyData={clarifyData}
            originalProblem={pendingProblem}
            onProceed={handleClarificationProceed}
            onSkip={handleClarificationSkip}
            onCancel={() => setClarifyData(null)}
            isResolving={isLoading}
          />
        )}

        {/* History Modal */}
        <HistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          language={language}
          savedResolutions={savedResolutions}
          onSelect={handleSelectHistoryItem}
          onDelete={handleDeleteHistoryItem}
        />

        {/* Auth Modal (Cadastro & Login) */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Referral Modal (Indicação & Ganhe) */}
        <ReferralModal
          isOpen={referralModalOpen}
          onClose={() => setReferralModalOpen(false)}
          user={user}
          onUpdateUser={setUser}
        />

        {/* Settings Modal (Configurações) */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          user={user}
          language={language}
          onLanguageChange={handleLanguageChange}
          onUpdateUser={setUser}
          onClearLocalData={handleClearLocalData}
        />

        {/* Site Footer */}
        <footer className="py-6 px-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 font-medium">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white font-black text-xs">
                AI
              </div>
              <span className="font-bold text-slate-700">AI Hub</span>
              <span className="text-slate-400">— Plataforma Completa de Inteligência Artificial</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => handleNavigate('plans')}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Planos & Assinaturas</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className="hover:text-blue-600 cursor-pointer inline-flex items-center gap-1"
              >
                <Compass className="w-3 h-3" />
                <span>Dashboard</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNavigate('admin')}
                className="hover:text-purple-600 cursor-pointer inline-flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                <span>Área Admin</span>
              </button>
              <span>•</span>
              <span>PT • EN • ES</span>
              <span>•</span>
              <span>Modelos com Redundância</span>
              <span>•</span>
              <span>Segurança Server-Side</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
