import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  Star,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  Settings2,
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
  Loader2,
} from 'lucide-react';
import { CreationToolItem, PlanTier, CreationCategory, CreatedItem } from '../types';
import { PLAN_CREATION_LIMITS, CATEGORY_METADATA } from '../data/creationData';

interface CreationModalProps {
  tool: CreationToolItem;
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanTier;
  currentUsageCount: number;
  onOpenPlans: () => void;
  onItemGenerated: (item: CreatedItem) => void;
  initialPrompt?: string;
  initialOptions?: Record<string, any>;
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
    Sparkles: <Sparkles className={className} />,
  };
  return map[iconName] || <Sparkles className={className} />;
};

export const CreationModal: React.FC<CreationModalProps> = ({
  tool,
  isOpen,
  onClose,
  currentPlan,
  currentUsageCount,
  onOpenPlans,
  onItemGenerated,
  initialPrompt = '',
  initialOptions = {},
}) => {
  const opts = (initialOptions || {}) as Record<string, any>;
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<CreatedItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Category specific state options
  const [videoFormat, setVideoFormat] = useState(opts.format || 'Shorts 9:16');
  const [videoDuration, setVideoDuration] = useState(opts.duration || '30s');
  const [videoStyle, setVideoStyle] = useState(opts.style || 'Cinemático');
  const [videoLanguage, setVideoLanguage] = useState(opts.language || 'Português');
  const [videoAspectRatio, setVideoAspectRatio] = useState(opts.aspectRatio || '9:16');
  const [videoQuality, setVideoQuality] = useState(opts.quality || '1080p');

  const [imageStyle, setImageStyle] = useState(opts.style || 'Fotorrealista');
  const [imageAspectRatio, setImageAspectRatio] = useState(opts.aspectRatio || '1:1');
  const [imageQuality, setImageQuality] = useState(opts.quality || 'HD');
  const [imageQuantity, setImageQuantity] = useState(opts.quantity || 1);

  const [textType, setTextType] = useState(opts.type || 'Artigo');
  const [textTone, setTextTone] = useState(opts.tone || 'Profissional');
  const [textLength, setTextLength] = useState(opts.length || 'Médio');
  const [textLanguage, setTextLanguage] = useState(opts.language || 'Português');

  const [audioVoice, setAudioVoice] = useState(opts.voice || 'Natural Executiva');
  const [audioSpeed, setAudioSpeed] = useState(opts.speed || '1.0x');
  const [audioEmotion, setAudioEmotion] = useState(opts.emotion || 'Inspiradora');

  const [codeLanguage, setCodeLanguage] = useState(opts.language || 'TypeScript');
  const [codeTask, setCodeTask] = useState(opts.task || 'Criar código');

  if (!isOpen) return null;

  const currentMaxLimit = PLAN_CREATION_LIMITS[currentPlan][tool.category];
  const isCurrentlyAtLimit = currentUsageCount >= currentMaxLimit;
  const catMeta = CATEGORY_METADATA.find((c) => c.id === tool.category);

  // Build options payload based on category
  const buildOptionsPayload = () => {
    switch (tool.category) {
      case 'video':
        return {
          format: videoFormat,
          duration: videoDuration,
          style: videoStyle,
          language: videoLanguage,
          aspectRatio: videoAspectRatio,
          quality: videoQuality,
        };
      case 'image':
        return {
          style: imageStyle,
          aspectRatio: imageAspectRatio,
          quality: imageQuality,
          quantity: imageQuantity,
        };
      case 'text':
        return {
          type: textType,
          tone: textTone,
          length: textLength,
          language: textLanguage,
        };
      case 'audio':
        return {
          voice: audioVoice,
          speed: audioSpeed,
          emotion: audioEmotion,
        };
      case 'code':
        return {
          language: codeLanguage,
          task: codeTask,
        };
      default:
        return {};
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Por favor, digite o que você deseja criar.');
      return;
    }

    if (isCurrentlyAtLimit) {
      setLimitExceeded(true);
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setLimitExceeded(false);

    try {
      const options = buildOptionsPayload();
      const userId = localStorage.getItem('resolveai_user_id') || 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('resolveai_user_id', userId);

      const res = await fetch('/api/create/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          toolId: tool.id,
          toolName: tool.name,
          category: tool.category,
          plan: currentPlan,
          prompt,
          options,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 || data.error === 'LIMIT_REACHED') {
          setLimitExceeded(true);
          setErrorMsg(data.message || 'Você atingiu seu limite gratuito de hoje.');
          return;
        }
        throw new Error(data.error || 'Erro ao processar criação.');
      }

      if (data.item) {
        setGeneratedItem(data.item);
        onItemGenerated(data.item);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro inesperado ao gerar conteúdo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedItem?.resultContent) return;
    navigator.clipboard.writeText(generatedItem.resultContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedItem) return;
    const element = document.createElement('a');
    const file = new Blob([generatedItem.resultContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${tool.id}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              {getToolIcon(tool.iconName, 'w-5 h-5')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{tool.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                  {catMeta?.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Daily limit badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span>Uso hoje:</span>
              <span className={isCurrentlyAtLimit ? 'text-rose-600 font-black' : 'text-blue-600 font-black'}>
                {currentUsageCount} / {currentMaxLimit}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Limit Reached Banner */}
          {(limitExceeded || isCurrentlyAtLimit) && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-amber-950">
                    Você atingiu seu limite gratuito de hoje para {catMeta?.name || 'esta categoria'}.
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    No plano atual ({currentPlan.toUpperCase()}), seu limite diário é de {currentMaxLimit} gerações.
                    Seu limite renova automaticamente amanhã às 00:00.
                  </p>
                </div>
              </div>

              {/* Simple Comparison Box */}
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Você está usando o plano gratuito.</span>
                  <span className="text-slate-500 font-medium">Comparativo diário:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-semibold text-center">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-700 border border-slate-200">
                    <span className="block text-[10px] text-slate-500 uppercase font-black">Grátis</span>
                    <span className="text-xs font-black">{PLAN_CREATION_LIMITS.free[tool.category]}/dia</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-900 border border-blue-200">
                    <span className="block text-[10px] text-blue-600 uppercase font-black">Premium</span>
                    <span className="text-xs font-black">{PLAN_CREATION_LIMITS.premium[tool.category]}/dia</span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-900 border border-indigo-200">
                    <span className="block text-[10px] text-indigo-600 uppercase font-black">Pro</span>
                    <span className="text-xs font-black">{PLAN_CREATION_LIMITS.pro[tool.category]}/dia</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  🚀 Aumente seus limites com Premium
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlans();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Ver planos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Prompt Input Section */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-800 tracking-tight">
              O que você quer criar?
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tool.promptPlaceholder}
                rows={4}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-hidden transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed text-slate-800"
              />
            </div>
          </div>

          {/* Dynamic Category Specific Options */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <Settings2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Configurações & Parâmetros</span>
            </div>

            {/* VIDEO OPTIONS */}
            {tool.category === 'video' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Formato</label>
                  <select
                    value={videoFormat}
                    onChange={(e) => setVideoFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Shorts / Reels (9:16)</option>
                    <option>YouTube Horizontal (16:9)</option>
                    <option>Feed Quadrado (1:1)</option>
                    <option>Retrato (4:5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Duração</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>15 segundos (Dinâmico)</option>
                    <option>30 segundos (Padrão)</option>
                    <option>60 segundos (Completo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Estilo Visual</label>
                  <select
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Cinemático</option>
                    <option>Fotorrealista</option>
                    <option>Animação 3D</option>
                    <option>Minimalista Corporativo</option>
                    <option>Anime Moderno</option>
                  </select>
                </div>
              </div>
            )}

            {/* IMAGE OPTIONS */}
            {tool.category === 'image' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Estilo Artístico</label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Fotorrealista</option>
                    <option>Arte Digital</option>
                    <option>Render 3D</option>
                    <option>Minimalista</option>
                    <option>Pintura a Óleo</option>
                    <option>Cyberpunk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Proporção</label>
                  <select
                    value={imageAspectRatio}
                    onChange={(e) => setImageAspectRatio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option value="1:1">1:1 (Quadrado Instagram)</option>
                    <option value="16:9">16:9 (Paisagem / YouTube)</option>
                    <option value="9:16">9:16 (Vertical / Stories)</option>
                    <option value="4:5">4:5 (Retrato Feed)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Qualidade</label>
                  <select
                    value={imageQuality}
                    onChange={(e) => setImageQuality(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option value="HD">Alta Definição (HD)</option>
                    <option value="Ultra">Ultra 4K / Detalhes Finos</option>
                    <option value="Standard">Padrão Rápido</option>
                  </select>
                </div>
              </div>
            )}

            {/* TEXT OPTIONS */}
            {tool.category === 'text' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tipo</label>
                  <select
                    value={textType}
                    onChange={(e) => setTextType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Artigo Completo</option>
                    <option>Post para Redes</option>
                    <option>Roteiro</option>
                    <option>Copy de Anúncio</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tom de Voz</label>
                  <select
                    value={textTone}
                    onChange={(e) => setTextTone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Profissional</option>
                    <option>Descontraído</option>
                    <option>Persuasivo</option>
                    <option>Inspirador</option>
                    <option>Técnico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tamanho</label>
                  <select
                    value={textLength}
                    onChange={(e) => setTextLength(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Curto (~150 palavras)</option>
                    <option>Médio (~400 palavras)</option>
                    <option>Longo (~800+ palavras)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Idioma</label>
                  <select
                    value={textLanguage}
                    onChange={(e) => setTextLanguage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Português</option>
                    <option>Inglês</option>
                    <option>Espanhol</option>
                  </select>
                </div>
              </div>
            )}

            {/* AUDIO OPTIONS */}
            {tool.category === 'audio' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Voz & Timbre</label>
                  <select
                    value={audioVoice}
                    onChange={(e) => setAudioVoice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Natural Executiva</option>
                    <option>Narrador Documentário</option>
                    <option>Comercial Enérgica</option>
                    <option>Conversacional Suave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Velocidade</label>
                  <select
                    value={audioSpeed}
                    onChange={(e) => setAudioSpeed(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>1.0x (Padrão)</option>
                    <option>0.85x (Calma)</option>
                    <option>1.2x (Dinâmica)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Emoção</label>
                  <select
                    value={audioEmotion}
                    onChange={(e) => setAudioEmotion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Inspiradora</option>
                    <option>Neutra & Objetiva</option>
                    <option>Persuasiva</option>
                    <option>Empática</option>
                  </select>
                </div>
              </div>
            )}

            {/* CODE OPTIONS */}
            {tool.category === 'code' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Linguagem / Stack</label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>TypeScript / React</option>
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>Node.js / Express</option>
                    <option>SQL (PostgreSQL / MySQL)</option>
                    <option>HTML & Tailwind CSS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Objetivo da Tarefa</label>
                  <select
                    value={codeTask}
                    onChange={(e) => setCodeTask(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-blue-500"
                  >
                    <option>Criar código do zero</option>
                    <option>Explicar passo a passo</option>
                    <option>Corrigir erros e exceções</option>
                    <option>Criar funções utilitárias</option>
                    <option>Refatorar e otimizar</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && !generatedItem)}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando e calibrando IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {tool.category === 'video'
                      ? '✨ Gerar vídeo'
                      : tool.category === 'image'
                      ? '✨ Gerar imagem'
                      : tool.category === 'code'
                      ? '✨ Gerar código'
                      : tool.category === 'audio'
                      ? '✨ Gerar áudio'
                      : '✨ Gerar'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* RESULT PREVIEW SECTION */}
          {generatedItem && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-sm font-black text-slate-900">Resultado Gerado</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>

              {/* Status notice if not connected to GPU rendering model directly */}
              {generatedItem.statusNotice && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{generatedItem.statusNotice}</p>
                    <p className="text-[11px] text-blue-700">
                      O roteiro, especificações de prompt e decupagem técnica foram gerados e salvos com sucesso na sua biblioteca.
                    </p>
                  </div>
                </div>
              )}

              {/* Formatted Content View */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed shadow-inner">
                {generatedItem.resultContent}
              </div>

              <div className="text-right">
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Item salvo automaticamente em "Meus Criados"
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
