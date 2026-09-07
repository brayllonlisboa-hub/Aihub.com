import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Film,
  FileVideo,
  Smartphone,
  Flame,
  Instagram,
  Youtube,
  Clapperboard,
  Tv,
  LayoutGrid,
  BookOpen,
  BadgePercent,
  Scissors,
  Maximize2,
  Palette,
  FileText,
  ScrollText,
  Sparkle,
  Share2,
  Megaphone,
  AlignLeft,
  Languages,
  Mic,
  Volume2,
  FileAudio,
  Sliders,
  Code2,
  HelpCircle,
  Bug,
  Braces,
  ArrowRightLeft,
  FolderOpen,
  AlertTriangle,
} from 'lucide-react';
import {
  CreationCategory,
  CreationToolItem,
  PlanTier,
  CategoryUsageCounts,
  CreatedItem,
} from '../types';
import {
  CATEGORY_METADATA,
  CREATION_TOOLS,
  PLAN_CREATION_LIMITS,
} from '../data/creationData';
import { CreationModal } from './CreationModal';
import { MyCreationsView } from './MyCreationsView';

interface CreationViewProps {
  currentPlan: PlanTier;
  usageCounts: CategoryUsageCounts;
  savedItems: CreatedItem[];
  onOpenPlans: () => void;
  onItemGenerated: (item: CreatedItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

// Icon helper
const getToolIcon = (iconName: string, className: string = 'w-5 h-5') => {
  const map: Record<string, React.ReactNode> = {
    Film: <Film className={className} />,
    FileVideo: <FileVideo className={className} />,
    Smartphone: <Smartphone className={className} />,
    Flame: <Flame className={className} />,
    Instagram: <Instagram className={className} />,
    Youtube: <Youtube className={className} />,
    Clapperboard: <Clapperboard className={className} />,
    Tv: <Tv className={className} />,
    LayoutGrid: <LayoutGrid className={className} />,
    BookOpen: <BookOpen className={className} />,
    BadgePercent: <BadgePercent className={className} />,
    Scissors: <Scissors className={className} />,
    Maximize2: <Maximize2 className={className} />,
    Palette: <Palette className={className} />,
    FileText: <FileText className={className} />,
    ScrollText: <ScrollText className={className} />,
    Sparkle: <Sparkle className={className} />,
    Share2: <Share2 className={className} />,
    Megaphone: <Megaphone className={className} />,
    AlignLeft: <AlignLeft className={className} />,
    Languages: <Languages className={className} />,
    Mic: <Mic className={className} />,
    Volume2: <Volume2 className={className} />,
    FileAudio: <FileAudio className={className} />,
    Sliders: <Sliders className={className} />,
    Code2: <Code2 className={className} />,
    HelpCircle: <HelpCircle className={className} />,
    Bug: <Bug className={className} />,
    Braces: <Braces className={className} />,
    ArrowRightLeft: <ArrowRightLeft className={className} />,
  };
  return map[iconName] || <Sparkles className={className} />;
};

export const CreationView: React.FC<CreationViewProps> = ({
  currentPlan,
  usageCounts,
  savedItems,
  onOpenPlans,
  onItemGenerated,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'my-creations'>('tools');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTool, setActiveModalTool] = useState<CreationToolItem | null>(null);
  const [modalInitialPrompt, setModalInitialPrompt] = useState('');
  const [modalInitialOptions, setModalInitialOptions] = useState<Record<string, any>>({});

  const currentLimits = PLAN_CREATION_LIMITS[currentPlan];

  const filteredTools = CREATION_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenTool = (tool: CreationToolItem, initialPrompt = '', initialOptions = {}) => {
    setActiveModalTool(tool);
    setModalInitialPrompt(initialPrompt);
    setModalInitialOptions(initialOptions);
  };

  const handleRegenerateFromLibrary = (
    tool: CreationToolItem,
    prompt: string,
    options: Record<string, any>
  ) => {
    setActiveTab('tools');
    handleOpenTool(tool, prompt, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Central Criar • Inteligência Artificial Generativa</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Limites resetam diariamente às 00:00</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900">
          Estúdio de Criação <span className="text-blue-600">ResolveAI</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Crie vídeos virais, imagens de alta conversão, textos persuasivos, locuções e códigos robustos.
          Todas as ferramentas possuem teste gratuito diário garantido sem cobrança por créditos.
        </p>

        {/* Current Plan & Limits Summary Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-800 flex items-center gap-2">
            <span className="text-slate-400">Seu plano atual:</span>
            <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-black uppercase text-[10px]">
              {currentPlan.toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            id="btn-upgrade-limits-banner"
            onClick={onOpenPlans}
            className="px-3.5 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-black transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs group"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Aumentar limites com Premium</span>
            <ArrowRight className="w-3 h-3 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Tabs: Ferramentas vs Meus Criados */}
      <div className="flex items-center justify-center border-b border-slate-200">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            type="button"
            id="tab-tools"
            onClick={() => setActiveTab('tools')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tools'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Ferramentas de IA</span>
          </button>

          <button
            type="button"
            id="tab-my-creations"
            onClick={() => setActiveTab('my-creations')}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my-creations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Meus Criados</span>
            {savedItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-600 text-white">
                {savedItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: TOOLS HUB */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          {/* Category Bar with Daily Usage Counters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Category Selector Chips */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Todas ({CREATION_TOOLS.length})
              </button>

              {CATEGORY_METADATA.map((cat) => {
                const used = usageCounts[cat.id] || 0;
                const max = currentLimits[cat.id];
                const isSelected = selectedCategory === cat.id;
                const isAtLimit = used >= max;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cat.iconEmoji}</span>
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        isAtLimit
                          ? 'bg-rose-100 text-rose-700'
                          : isSelected
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      title={`${used} de ${max} usados hoje`}
                    >
                      {used}/{max}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ferramenta..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-blue-500 shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* Daily Usage Dashboard Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {CATEGORY_METADATA.map((cat) => {
              const used = usageCounts[cat.id] || 0;
              const max = currentLimits[cat.id];
              const remaining = Math.max(0, max - used);
              const percentage = Math.min(100, Math.round((used / max) * 100));
              const isAtLimit = used >= max;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl bg-white border transition-all cursor-pointer hover:shadow-2xs ${
                    selectedCategory === cat.id
                      ? 'border-blue-500 ring-2 ring-blue-100'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span>{cat.iconEmoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span
                      className={`text-[11px] font-black ${
                        isAtLimit ? 'text-rose-600' : 'text-blue-600'
                      }`}
                    >
                      {used} / {max}
                    </span>
                  </div>

                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAtLimit ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{remaining} restantes hoje</span>
                    {isAtLimit && <span className="font-bold text-rose-500">Limite atingido</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const catMeta = CATEGORY_METADATA.find((c) => c.id === tool.category);
              const used = usageCounts[tool.category] || 0;
              const max = currentLimits[tool.category];
              const isAtLimit = used >= max;

              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-5 group relative"
                >
                  {tool.popular && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      Popular
                    </span>
                  )}

                  <div className="space-y-3">
                    {/* Icon & Category */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center font-bold shadow-2xs">
                        {getToolIcon(tool.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {catMeta?.name}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                          {tool.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
                    {/* Limit badge */}
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Disponível hoje:</span>
                      <span className={isAtLimit ? 'text-rose-600 font-black' : 'text-slate-700'}>
                        {used} / {max} usados
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenTool(tool)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isAtLimit
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-900 hover:bg-blue-600 text-white shadow-2xs'
                      }`}
                    >
                      {isAtLimit ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Limite diário atingido</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
                          <span>
                            {tool.category === 'video'
                              ? 'Criar vídeo'
                              : tool.category === 'image'
                              ? 'Criar imagem'
                              : tool.category === 'code'
                              ? 'Criar código'
                              : tool.category === 'audio'
                              ? 'Criar áudio'
                              : 'Criar texto'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <p className="text-sm font-bold">Nenhuma ferramenta encontrada para sua busca.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MEUS CRIADOS (BIBLIOTECA) */}
      {activeTab === 'my-creations' && (
        <MyCreationsView
          items={savedItems}
          onDeleteItem={onDeleteItem}
          onToggleFavorite={onToggleFavorite}
          onRegenerate={handleRegenerateFromLibrary}
          onGoToTools={() => setActiveTab('tools')}
        />
      )}

      {/* Creation Studio Modal */}
      {activeModalTool && (
        <CreationModal
          tool={activeModalTool}
          isOpen={Boolean(activeModalTool)}
          onClose={() => setActiveModalTool(null)}
          currentPlan={currentPlan}
          currentUsageCount={usageCounts[activeModalTool.category] || 0}
          onOpenPlans={onOpenPlans}
          onItemGenerated={onItemGenerated}
          initialPrompt={modalInitialPrompt}
          initialOptions={modalInitialOptions}
        />
      )}
    </div>
  );
};
