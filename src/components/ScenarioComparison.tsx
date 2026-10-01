import React from 'react';
import { 
  Layers, 
  ArrowRight, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Sparkles, 
  Copy, 
  Plus, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { Appliance, TariffSettings } from '../types';
import { calculateHouseholdSummary } from '../utils/calculator';
import { SAMPLE_OPTIMIZED_APPLIANCES } from '../data/presets';

interface ScenarioComparisonProps {
  appliancesA: Appliance[];
  appliancesB: Appliance[];
  settings: TariffSettings;
  onUpdateApplianceB: (updated: Appliance[]) => void;
  onCloneAToB: () => void;
  onLoadPresetB: () => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  appliancesA,
  appliancesB,
  settings,
  onUpdateApplianceB,
  onCloneAToB,
  onLoadPresetB,
}) => {
  const summaryA = calculateHouseholdSummary(appliancesA, settings);
  const summaryB = calculateHouseholdSummary(appliancesB, settings);

  const kwhDelta = summaryB.totalMonthlyKwh - summaryA.totalMonthlyKwh;
  const costDelta = summaryB.totalMonthlyCost - summaryA.totalMonthlyCost;
  const pctSavings = summaryA.totalMonthlyKwh > 0 
    ? Math.round(((summaryA.totalMonthlyKwh - summaryB.totalMonthlyKwh) / summaryA.totalMonthlyKwh) * 1000) / 10 
    : 0;

  const annualDollarSavings = costDelta < 0 ? Math.abs(costDelta) * 12 : 0;
  const co2AvoidedKg = kwhDelta < 0 ? Math.round(Math.abs(kwhDelta) * 0.45 * 10) / 10 : 0; // ~0.45 kg CO2 por kWh promedio

  const handleUpdateHours = (id: string, newHours: number) => {
    const updated = appliancesB.map((app) =>
      app.id === id ? { ...app, hoursPerDay: Math.max(0.1, Math.min(24, newHours)) } : app
    );
    onUpdateApplianceB(updated);
  };

  const handleRemoveAppB = (id: string) => {
    onUpdateApplianceB(appliancesB.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-bold block mb-1">
              Función 3 Mínima · Simulación de Decisiones
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Comparador de Escenarios (A vs B)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Prueba qué ocurre con tu factura si disminuyes horas de uso, desconectas aparatos prescindibles o sustituyes bombillos tradicionales por tecnología LED.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onCloneAToB}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Copiar aparatos de tu consumo actual al Escenario B para modificarlos"
            >
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Clonar Escenario A hacia B</span>
            </button>

            <button
              onClick={onLoadPresetB}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all cursor-pointer"
              title="Cargar simulación con cambios recomendados: focos LED, termostato 24°C y duchas tibias"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Escenario Optimizado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delta Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Monthly Dollar Savings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Ahorro Mensual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono ${costDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {costDelta <= 0 ? `-$${Math.abs(costDelta).toFixed(2)}` : `+$${costDelta.toFixed(2)}`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {costDelta <= 0 ? `Bajas un ${pctSavings}% tu recibo` : 'Consumes más que el actual'}
          </p>
        </div>

        {/* Energy Savings in kWh */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Diferencia en Energía</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono ${kwhDelta <= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {kwhDelta <= 0 ? `${kwhDelta.toFixed(1)} kWh` : `+${kwhDelta.toFixed(1)} kWh`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {summaryA.totalMonthlyKwh} kWh ➔ {summaryB.totalMonthlyKwh} kWh
          </p>
        </div>

        {/* Annual Projected Savings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Ahorro Anual Proyectado</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
            ${annualDollarSavings.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Acumulado en 12 meses de ahorro
          </p>
        </div>

        {/* Carbon Footprint Reduction */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>CO2 Evitado</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
            {co2AvoidedKg} kg
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Emisiones de carbono no emitidas
          </p>
        </div>
      </div>

      {/* Side-by-side Visual Comparison Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase text-slate-300 tracking-wider mb-4">
          Comparativa Visual de Facturación Mensual
        </h3>

        <div className="space-y-4">
          {/* Escenario A Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-cyan-400 font-bold">Escenario A (Consumo Actual)</span>
              <span className="text-white font-bold">${summaryA.totalMonthlyCost.toFixed(2)} / {summaryA.totalMonthlyKwh} kWh</span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-cyan-500 h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-slate-950"
                style={{ width: '100%' }}
              >
                100%
              </div>
            </div>
          </div>

          {/* Escenario B Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-purple-400 font-bold">Escenario B (Simulado / Optimizado)</span>
              <span className="text-white font-bold">${summaryB.totalMonthlyCost.toFixed(2)} / {summaryB.totalMonthlyKwh} kWh</span>
            </div>
            <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-slate-950"
                style={{
                  width: `${Math.min(100, Math.max(10, summaryA.totalMonthlyKwh > 0 ? (summaryB.totalMonthlyKwh / summaryA.totalMonthlyKwh) * 100 : 50))}%`,
                }}
              >
                {summaryA.totalMonthlyKwh > 0 
                  ? `${Math.round((summaryB.totalMonthlyKwh / summaryA.totalMonthlyKwh) * 100)}%` 
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Adjustment of Scenario B */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ajustar Horas en Escenario B</span>
              <span className="text-xs font-normal text-slate-400">
                (Cambia el tiempo diario y observa la respuesta en tiempo real)
              </span>
            </h3>
          </div>
        </div>

        {appliancesB.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            El Escenario B no tiene aparatos configurados aún.{' '}
            <button
              onClick={onCloneAToB}
              className="text-purple-400 underline font-semibold hover:text-purple-300 ml-1"
            >
              Copiar los del Escenario A
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {appliancesB.map((app) => {
              const originalA = appliancesA.find((a) => a.name === app.name);
              const originalHours = originalA ? originalA.hoursPerDay : app.hoursPerDay;
              const hoursDiff = app.hoursPerDay - originalHours;

              return (
                <div
                  key={app.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-200 truncate">{app.name}</div>
                    <div className="text-slate-500 font-mono mt-0.5">
                      {app.watts}W • {app.daysPerMonth} d/mes
                    </div>
                  </div>

                  {/* Hours controller */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateHours(app.id, app.hoursPerDay - 0.5)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                          title="Reducir 30 minutos"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-mono font-bold text-purple-400">
                          {app.hoursPerDay}h
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateHours(app.id, app.hoursPerDay + 0.5)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                          title="Aumentar 30 minutos"
                        >
                          +
                        </button>
                      </div>
                      {hoursDiff !== 0 && (
                        <span className={`text-[10px] font-mono mt-0.5 ${hoursDiff < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {hoursDiff < 0 ? `${hoursDiff}h vs actual` : `+${hoursDiff}h vs actual`}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveAppB(app.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                      title="Quitar aparato del Escenario B"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
