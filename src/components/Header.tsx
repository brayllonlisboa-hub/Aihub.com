import React, { useState } from 'react';
import {
  Sparkles,
  History,
  RotateCcw,
  Compass,
  CreditCard,
  Settings,
  Share2,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { Language, UserProfile, AppView } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenHistory: () => void;
  onOpenReferral: () => void;
  onOpenSettings: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  user: UserProfile | null;
  historyCount: number;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentView,
  onNavigate,
  onOpenHistory,
  onOpenReferral,
  onOpenSettings,
  onOpenAuth,
  onLogout,
  user,
  historyCount,
  isAnalyzing,
}) => {
  const t = TRANSLATIONS[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="px-4 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center border-b border-slate-200 bg-white sticky top-0 z-40 shadow-2xs">
      {/* Brand & Desktop Nav Links */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          id="btn-nav-home"
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tighter text-slate-900">
                AI<span className="text-blue-600">Hub</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-100 hidden sm:inline-block">
                Pro
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-0.5 hidden md:block">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Início
          </button>

          <button
            type="button"
            onClick={() => handleNav('create')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'create'
                ? 'bg-blue-600 text-white shadow-2xs font-black'
                : 'text-slate-700 hover:text-blue-600 hover:bg-white/60'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${currentView === 'create' ? 'text-white' : 'text-blue-600'}`} />
            <span>Central Criar</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('plans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'plans'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Planos
          </button>

          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>

      {/* Right Desktop Controls & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Referral / Indique & Ganhe */}
        <button
          type="button"
          onClick={onOpenReferral}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
          title="Indique e Ganhe"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Indique & Ganhe</span>
        </button>

        {/* History Modal Trigger */}
        <button
          id="btn-open-history"
          type="button"
          onClick={onOpenHistory}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          title={t.history}
        >
          <History className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">{t.history}</span>
          {historyCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-600 text-white">
              {historyCount}
            </span>
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Admin Direct Button (Always accessible for review) */}
        <button
          type="button"
          onClick={() => handleNav('admin')}
          className={`p-2 rounded-xl transition-colors cursor-pointer border ${
            currentView === 'admin'
              ? 'bg-purple-600 text-white border-purple-700'
              : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200'
          }`}
          title="Painel Administrativo"
        >
          <Shield className="w-4 h-4" />
        </button>

        {/* Language Selector */}
        <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          {(['pt', 'en', 'es'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                language === lang
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* User Account / Auth Button */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate">{user.name}</span>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700">
                      Plano {user.plan}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    handleNav('dashboard');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Meu Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Configurações</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    handleNav('admin');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Área Administrativa</span>
                </button>

                <div className="pt-1 border-t border-slate-100 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
          >
            Entrar
          </button>
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] bottom-0 bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto border-t border-slate-200">
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Navegação Principal
            </div>

            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`w-full text-left p-3.5 rounded-2xl text-sm font-black flex items-center gap-3 min-h-[48px] cursor-pointer ${
                currentView === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span>Início & Diagnóstico</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('create')}
              className={`w-full text-left p-3.5 rounded-2xl text-sm font-black flex items-center gap-3 min-h-[48px] cursor-pointer ${
                currentView === 'create' ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Central Criar com IA</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('plans')}
              className={`w-full text-left p-3.5 rounded-2xl text-sm font-black flex items-center gap-3 min-h-[48px] cursor-pointer ${
                currentView === 'plans' ? 'bg-amber-50 text-amber-800' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>Planos & Assinaturas</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`w-full text-left p-3.5 rounded-2xl text-sm font-black flex items-center gap-3 min-h-[48px] cursor-pointer ${
                currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Dashboard & Limites</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReferral();
              }}
              className="w-full text-left p-3.5 rounded-2xl text-sm font-black text-purple-700 hover:bg-purple-50 flex items-center gap-3 min-h-[48px] cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-purple-600" />
              <span>Indique & Ganhe Créditos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full text-left p-3.5 rounded-2xl text-sm font-black text-slate-800 hover:bg-slate-50 flex items-center gap-3 min-h-[48px] cursor-pointer"
            >
              <Settings className="w-5 h-5 text-slate-600" />
              <span>Configurações</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('admin')}
              className={`w-full text-left p-3.5 rounded-2xl text-sm font-black flex items-center gap-3 min-h-[48px] cursor-pointer ${
                currentView === 'admin' ? 'bg-purple-50 text-purple-800' : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Shield className="w-5 h-5 text-purple-600" />
              <span>Área Administrativa</span>
            </button>
          </div>

          {/* Bottom Drawer Actions */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            {/* Language Selector in Drawer */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Idioma:</span>
              <div className="flex gap-1">
                {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => onLanguageChange(lang)}
                    className={`px-3 py-1.5 rounded-xl uppercase text-xs font-bold ${
                      language === lang ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-3.5 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da conta ({user.name})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-200"
              >
                <User className="w-4 h-4" />
                <span>Entrar ou Criar Conta</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
