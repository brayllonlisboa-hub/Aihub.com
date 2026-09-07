import React from 'react';
import {
  User,
  Sparkles,
  CreditCard,
  History,
  Heart,
  Share2,
  ArrowRight,
  TrendingUp,
  Clock,
  Video,
  Image as ImageIcon,
  FileText,
  Music,
  Code,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileCode,
  FolderArchive,
} from 'lucide-react';
import { UserProfile, UserUsageState, CreatedItem, ResolutionResult, AppView } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  usageState: UserUsageState;
  createdItems: CreatedItem[];
  savedResolutions: ResolutionResult[];
  onNavigate: (view: AppView) => void;
  onSelectResolution: (item: ResolutionResult) => void;
  onOpenReferral: () => void;
  onOpenPlans: () => void;
  onOpenHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  usageState,
  createdItems,
  savedResolutions,
  onNavigate,
  onSelectResolution,
  onOpenReferral,
  onOpenPlans,
  onOpenHistory,
}) => {
  const favoriteItems = createdItems.filter((i) => i.isFavorite);

  const planBadges: Record<string, { label: string; bg: string; text: string }> = {
    free: { label: 'Plano Gratuito', bg: 'bg-slate-100', text: 'text-slate-700' },
    basic: { label: 'Plano Básico', bg: 'bg-blue-100', text: 'text-blue-700' },
    premium: { label: 'Plano Premium', bg: 'bg-amber-100', text: 'text-amber-800' },
    pro: { label: 'Plano Pro VIP', bg: 'bg-purple-100', text: 'text-purple-800' },
  };

  const currentBadge = planBadges[user.plan] || planBadges.free;

  const categoryIcons: Record<string, any> = {
    video: Video,
    image: ImageIcon,
    text: FileText,
    audio: Music,
    code: Code,
  };

  const categoryLabels: Record<string, string> = {
    video: 'Vídeos',
    image: 'Imagens',
    text: 'Textos',
    audio: 'Áudios',
    code: 'Códigos',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* User Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-200">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Olá, {user.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${currentBadge.bg} ${currentBadge.text}`}
              >
                {currentBadge.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {user.email} • Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenPlans}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Fazer Upgrade de Plano</span>
          </button>
          <button
            type="button"
            onClick={onOpenReferral}
            className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-blue-200 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Indicar Amigos ({user.bonusCredits} créditos)</span>
          </button>
        </div>
      </div>

      {/* Quick Numbers Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Resoluções Criadas
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {savedResolutions.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Diagnósticos completos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Criações de Mídia
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {createdItems.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Vídeos, imagens, textos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Itens Favoritados
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {favoriteItems.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>Salvos com estrela</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Amigos Indicados
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {user.referralCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Share2 className="w-3 h-3 text-purple-500" />
            <span>+{user.bonusCredits || 0} créditos bônus</span>
          </div>
        </div>
      </div>

      {/* Free Daily Quotas & Limits Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Seus Limites Diários Gratuitos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Reiniciados automaticamente todos os dias às 00:00.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPlans}
            className="self-start sm:self-auto text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Aumentar cotas com planos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {(['video', 'image', 'text', 'audio', 'code'] as const).map((cat) => {
            const used = usageState.usage[cat] || 0;
            const limit = usageState.limits[cat] || 10;
            const remaining = Math.max(0, limit - used);
            const percentage = Math.min(100, Math.round((used / limit) * 100));
            const Icon = categoryIcons[cat];

            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-blue-600" />
                    {categoryLabels[cat]}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {used}/{limit}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage >= 90
                        ? 'bg-rose-500'
                        : percentage >= 70
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  {remaining > 0 ? `${remaining} restantes hoje` : 'Limite diário atingido'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Resolutions & Recent Creations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Problem Solves */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Resoluções Recentes</span>
            </h2>
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline cursor-pointer"
            >
              Ver todas ({savedResolutions.length})
            </button>
          </div>

          {savedResolutions.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-3">
                Você ainda não realizou diagnósticos de problemas.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Resolver meu primeiro problema
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedResolutions.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectResolution(item)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.severity.level}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600">
                        {item.problemPrompt}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">
                      {item.summary}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent AI Creations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Criações Recentes</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:underline cursor-pointer"
            >
              Abrir Estúdio Criar
            </button>
          </div>

          {createdItems.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-3">
                Você ainda não gerou vídeos, imagens ou códigos com IA.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('create')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Criar com IA agora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {createdItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">
                      {item.prompt}
                    </p>
                  </div>
                  {item.isFavorite && (
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Website Files Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                <FileCode className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Salvar Arquivos do Site (HTML, CSS e JavaScript)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Baixe os arquivos de produção prontos do seu site (index.html, CSS e JavaScript compilados) ou o pacote completo com todo o código-fonte para publicar ou hospedar onde quiser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/api/export/dist-zip"
              download
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-blue-900/40 hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar HTML + CSS + JS (.ZIP)</span>
            </a>
            <a
              href="/api/export/site-zip"
              download
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-purple-300" />
              <span>Projeto Completo (.ZIP)</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-bold text-blue-300 block mb-1">1. index.html</span>
            <span className="text-slate-400">Estrutura HTML completa com meta tags, Open Graph para redes sociais e título otimizado.</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-bold text-purple-300 block mb-1">2. assets/*.css</span>
            <span className="text-slate-400">Folha de estilo completa minificada com todas as diretrizes de design, Tailwind e responsividade.</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">3. assets/*.js</span>
            <span className="text-slate-400">Lógica interativa, estúdio de criação IA, diagnósticos, navegação e animações.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
