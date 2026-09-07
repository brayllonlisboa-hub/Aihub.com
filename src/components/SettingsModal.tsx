import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  Sliders,
  Sparkles,
  Download,
  Trash2,
  Check,
  Globe,
  HardDrive,
  ShieldCheck,
  Zap,
  FileCode,
  FolderArchive,
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onUpdateUser: (updated: UserProfile) => void;
  onClearLocalData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onLanguageChange,
  onUpdateUser,
  onClearLocalData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data' | 'system'>('profile');
  const [name, setName] = useState(user.name);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [aiCreativity, setAiCreativity] = useState<'balanced' | 'precise' | 'creative'>('balanced');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateUser({
      ...user,
      name: name.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        user,
        resolutions: JSON.parse(localStorage.getItem('resolveai_history') || '[]'),
        creations: JSON.parse(localStorage.getItem('aihub_creations_library') || '[]'),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `aihub_backup_${user.id}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Falha ao exportar dados:', err);
    }
  };

  const handleDownloadStaticSite = () => {
    window.location.href = '/api/export/dist-zip';
  };

  const handleDownloadFullProject = () => {
    window.location.href = '/api/export/site-zip';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Configurações
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Gerencie suas preferências de perfil, IA e armazenamento.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Perfil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Preferências
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sistema
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  E-mail cadastrado
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Plano Ativo
                  </div>
                  <div className="text-sm font-black text-blue-700 capitalize">
                    {user.plan} VIP
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-blue-800 bg-white px-3 py-1 rounded-lg border border-blue-200">
                  {user.referralCode}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Alterações salvas!
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Idioma da Plataforma</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pt', label: 'Português (BR)' },
                    { id: 'en', label: 'English (US)' },
                    { id: 'es', label: 'Español' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onLanguageChange(item.id as Language)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        language === item.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Calibração de Criatividade da IA</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'precise', label: 'Precisa / Rápida' },
                    { id: 'balanced', label: 'Equilibrada' },
                    { id: 'creative', label: 'Altamente Criativa' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAiCreativity(item.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        aiCreativity === item.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">Salvamento Automático Local</div>
                  <div className="text-[11px] text-slate-500">Salva diagnósticos e criações em tempo real no navegador</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              {/* Export Static Web Files (HTML, CSS, JS) */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <span>Salvar Arquivos do Site (HTML, CSS e JavaScript)</span>
                  </div>
                  <div className="text-[11px] text-blue-700/80 mt-0.5 leading-relaxed">
                    Baixa o pacote com <strong>index.html</strong>, folha de estilos <strong>CSS</strong> e scripts <strong>JavaScript</strong> (.zip) pronto para publicar em qualquer hospedagem estática.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStaticSite}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar HTML/CSS/JS</span>
                </button>
              </div>

              {/* Export Full Project Sources */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FolderArchive className="w-4 h-4 text-purple-600" />
                    <span>Salvar Projeto Completo com Código Fonte</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Arquivo .ZIP com código-fonte TypeScript/React (src/), index.html, servidor Express, configurações e dependências.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadFullProject}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Projeto (.ZIP)</span>
                </button>
              </div>

              {/* Export JSON User Data */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Backup de Resoluções e Criações</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Faça download de todo o seu histórico em formato JSON seguro.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Exportar JSON
                </button>
              </div>

              {/* Clear Local Data */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Limpar Dados Locais</span>
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Apaga o histórico de resoluções temporárias salvas neste navegador.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza de que deseja limpar seu histórico salvo neste navegador?')) {
                      onClearLocalData();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Limpar Agora
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-600">Ambiente de Execução</span>
                <span className="font-bold text-slate-900">Produção Cloud Run (Port 3000)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-600">Status dos Modelos Gemini</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Operacional com Redundância
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-600">Versão da Plataforma</span>
                <span className="font-bold font-mono text-slate-900">v1.0.0 — AI Hub Web</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-600">Segurança de Chaves</span>
                <span className="font-bold text-blue-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Backend Server-Side Isolado
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
