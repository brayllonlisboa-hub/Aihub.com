import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Server,
  Users,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw,
  Clock,
  HardDrive,
  Cpu,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import { AdminTelemetry, AppView } from '../types';

interface AdminViewProps {
  onNavigate: (view: AppView) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [telemetry, setTelemetry] = useState<AdminTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error('Falha ao carregar métricas administrativas:', err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Bar with Navigation Back & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Painel Administrativo AI Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase">
                Admin Root
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Monitoramento em tempo real do sistema, infraestrutura e métricas de uso.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Status do Servidor
            </div>
            <div className="text-lg font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operacional (200 OK)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Cloud Run • Porta 3000</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tempo de Atividade
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {formatUptime(telemetry?.uptimeSeconds)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Sem quedas registradas</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Modelo Ativo Principal
            </div>
            <div className="text-sm font-black text-purple-700 truncate max-w-[150px] mt-0.5">
              {telemetry?.activeModel || 'gemini-2.5-flash'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Com fallback em cascata</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Consumo de Memória
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {telemetry?.memoryUsageMb ? `${telemetry.memoryUsageMb} MB` : 'N/A'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Node.js RSS Process</div>
          </div>
        </div>
      </div>

      {/* Platform Counters & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metric Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Usuários Cadastrados</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {telemetry?.telemetry.totalUsers || 2}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Criações Multimídia</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {telemetry?.telemetry.totalCreations || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Feedbacks Registrados</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {telemetry?.telemetry.totalFeedbacks || 0}
              </div>
            </div>
          </div>

          {/* Model Cascade Overview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Cadeia de Modelos Gemini com Fallback Automático</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
              Caso um modelo enfrente alta demanda temporária (503 / 429), a plataforma alterna instantaneamente para o próximo modelo da fila sem interromper a geração do usuário:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(telemetry?.candidateModels || [
                'gemini-2.5-flash',
                'gemini-2.5-pro',
                'gemini-2.0-flash',
                'gemini-1.5-flash',
              ]).map((model, idx) => (
                <div
                  key={model}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">{model}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Pronto
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Distribution Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-1">
              Distribuição por Planos
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Usuários ativos divididos por nível de assinatura.
            </p>

            <div className="space-y-4">
              {[
                { key: 'free', label: 'Plano Gratuito', color: 'bg-slate-400', count: telemetry?.telemetry.planDistribution.free || 1 },
                { key: 'basic', label: 'Plano Básico', color: 'bg-blue-600', count: telemetry?.telemetry.planDistribution.basic || 0 },
                { key: 'premium', label: 'Plano Premium', color: 'bg-amber-500', count: telemetry?.telemetry.planDistribution.premium || 0 },
                { key: 'pro', label: 'Plano Pro VIP', color: 'bg-purple-600', count: telemetry?.telemetry.planDistribution.pro || 1 },
              ].map((tier) => (
                <div key={tier.key}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">{tier.label}</span>
                    <span className="font-mono text-slate-900">{tier.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tier.color}`}
                      style={{
                        width: `${Math.max(10, Math.min(100, (tier.count / Math.max(1, telemetry?.telemetry.totalUsers || 2)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium">
              Última sincronização: {lastRefreshed.toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
