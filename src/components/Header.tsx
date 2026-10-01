import React from 'react';
import { 
  Zap, 
  Layers, 
  BrainCircuit, 
  FileText, 
  Settings2, 
  Sparkles, 
  Download, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { HouseholdSummary } from '../utils/calculator';
import { TariffSettings } from '../types';

interface HeaderProps {
  activeTab: 'inventory' | 'comparison' | 'ai' | 'audit';
  setActiveTab: (tab: 'inventory' | 'comparison' | 'ai' | 'audit') => void;
  summary: HouseholdSummary;
  settings: TariffSettings;
  onOpenSettings: () => void;
  onLoadSample: () => void;
  onExport: () => void;
  onReset: () => void;
  hasAppliances: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  summary,
  settings,
  onOpenSettings,
  onLoadSample,
  onExport,
  onReset,
  hasAppliances,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur">
      {/* Top Banner / Info */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 font-mono font-bold tracking-wider">
            N.º 35
          </span>
          <span className="font-semibold text-slate-200">RECIBO CLARO</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Hogar y Energía · Familia que quiere bajar la factura</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSample}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors text-xs font-medium cursor-pointer"
            title="Carga una casa típica con refrigerador, aire, TV y focos para probar al instante"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cargar Hogar Ejemplo</span>
          </button>

          <button
            onClick={onExport}
            type="button"
            disabled={!hasAppliances}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Exportar datos a archivo JSON (M2: Persistencia)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Exportar JSON</span>
          </button>

          <button
            onClick={onOpenSettings}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-medium cursor-pointer"
            title="Configurar tarifa eléctrica por kWh"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-300" />
            <span>${settings.pricePerKwh}/kWh</span>
          </button>
        </div>
      </div>

      {/* Main Title & Live Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Recibo Claro
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-400 uppercase tracking-widest">
                    Semana 1 · 10%
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Descubre qué aparato infla tu factura mensual y simula escenarios de ahorro
                </p>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          {hasAppliances && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800">
              <div className="px-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Consumo Mes</span>
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">
                  {summary.totalMonthlyKwh} <span className="text-xs font-normal text-slate-400">kWh</span>
                </span>
              </div>
              <div className="px-2 border-l border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recibo Estimado</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
                  ${summary.totalMonthlyCost.toFixed(2)}
                </span>
              </div>
              <div className="px-2 border-l border-slate-800">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block truncate">Mayor Vampiro</span>
                <span className="text-xs sm:text-sm font-semibold text-rose-300 block truncate" title={summary.vampireAppliance?.name || 'Ninguno'}>
                  {summary.vampireAppliance ? `${summary.vampireAppliance.name.split(' ')[0]} (${summary.vampireAppliance.percentageOfTotal}%)` : '—'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs (Mobile-Friendly, Touch Targets) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('inventory')}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>1. Mi Consumo (P0-M4)</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {summary.calculatedAppliances.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>2. Comparar Escenarios (Función 3)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-pink-400" />
            <span>3. Diagnóstico IA (M5 Sello)</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Bitácora & Rúbrica (10 pts)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
