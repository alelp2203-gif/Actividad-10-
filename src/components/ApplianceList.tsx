import React, { useState } from 'react';
import { 
  Zap, 
  Trash2, 
  Edit3, 
  Copy, 
  AlertTriangle, 
  PieChart, 
  Plus, 
  Sparkles, 
  Search,
  Filter,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Appliance, CalculatedAppliance, TariffSettings } from '../types';
import { HouseholdSummary } from '../utils/calculator';
import { CATEGORIES } from '../data/presets';

interface ApplianceListProps {
  summary: HouseholdSummary;
  settings: TariffSettings;
  onAddClick: () => void;
  onEditClick: (appliance: Appliance) => void;
  onDuplicate: (appliance: Appliance) => void;
  onDelete: (id: string) => void;
  onLoadSample: () => void;
}

export const ApplianceList: React.FC<ApplianceListProps> = ({
  summary,
  settings,
  onAddClick,
  onEditClick,
  onDuplicate,
  onDelete,
  onLoadSample,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAppliances = summary.calculatedAppliances.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Empty State (Peldaño M3: Que se entienda)
  if (summary.calculatedAppliances.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-dashed border-slate-700 rounded-3xl p-6 sm:p-12 text-center my-6 max-w-xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/10">
          <Zap className="w-8 h-8 animate-pulse text-cyan-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Tu inventario eléctrico está vacío
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
          Descubre qué electrodoméstico está inflando tu recibo de luz. Comienza agregando tu primer aparato o carga una casa típica con un solo toque.
        </p>

        {/* 3 Onboarding Steps for M3 clarity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left mb-6 max-w-md mx-auto">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-mono text-cyan-400 font-bold block mb-1">Paso 1</span>
            <span className="text-slate-300 font-medium">Registra o elige aparatos con sus Watts típicos.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-mono text-amber-400 font-bold block mb-1">Paso 2</span>
            <span className="text-slate-300 font-medium">Ve en tiempo real cuánto dinero gastas al mes.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-mono text-pink-400 font-bold block mb-1">Paso 3</span>
            <span className="text-slate-300 font-medium">La IA identifica tus 3 mayores vampiros de energía.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddClick}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Primer Aparato</span>
          </button>

          <button
            onClick={onLoadSample}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Cargar Hogar de 4 Personas</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddClick}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Aparato</span>
        </button>
      </div>

      {/* Main Grid: Appliance Cards & Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Appliance List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Mostrando <b className="text-white">{filteredAppliances.length}</b> de {summary.calculatedAppliances.length} aparatos
            </span>
            <span>Ordenados por mayor consumo mensual</span>
          </div>

          {filteredAppliances.map((app, index) => {
            const isTop3 = index < 3;
            const categoryMeta = CATEGORIES.find((c) => c.id === app.category);

            return (
              <div
                key={app.id}
                className={`bg-slate-900 border rounded-xl p-4 transition-all hover:border-slate-700 relative overflow-hidden group ${
                  index === 0
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 to-slate-900'
                    : index === 1 || index === 2
                    ? 'border-amber-500/30'
                    : 'border-slate-800'
                }`}
              >
                {/* Ranking Tag */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                        index === 0
                          ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/30'
                          : index === 1
                          ? 'bg-amber-500 text-slate-950'
                          : index === 2
                          ? 'bg-yellow-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                      title={`Puesto #${index + 1} en consumo del hogar`}
                    >
                      #{index + 1}
                    </span>

                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base truncate flex items-center gap-2">
                        {app.name}
                        {app.quantity > 1 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            x{app.quantity}
                          </span>
                        )}
                        {index === 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <Flame className="w-3 h-3 text-rose-400" />
                            Mayor Vampiro
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className={categoryMeta?.color}>{categoryMeta?.name}</span>
                        <span>•</span>
                        <span className="font-mono">{app.watts}W</span>
                        <span>•</span>
                        <span className="font-mono">{app.hoursPerDay}h/día ({app.daysPerMonth} d/mes)</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Impact Pill */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base sm:text-lg font-mono font-black text-amber-400">
                      ${app.monthlyCost.toFixed(2)}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      {app.monthlyKwh} kWh/mes
                    </div>
                  </div>
                </div>

                {/* Progress bar representing share of total bill */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Participación en el recibo:</span>
                    <span className="font-bold text-cyan-400">{app.percentageOfTotal}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-rose-500'
                          : index === 1
                          ? 'bg-amber-400'
                          : index === 2
                          ? 'bg-yellow-400'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(2, app.percentageOfTotal))}%` }}
                    />
                  </div>
                </div>

                {/* Card Action Buttons (Touch Friendly) */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <span className="truncate text-[11px] text-slate-500 italic">
                    {app.notes || 'Sin observaciones'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicate(app)}
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title="Duplicar este aparato"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditClick(app)}
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                      title="Editar parámetros"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(app.id)}
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Eliminar del inventario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Breakdown & Quick Summary Card */}
        <div className="space-y-4">
          {/* Bill Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center justify-between">
              <span>Desglose de Facturación</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Consumo de Energía</span>
                <span className="font-mono text-slate-200 font-semibold">{summary.totalMonthlyKwh} kWh</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Tarifa Aplicada</span>
                <span className="font-mono text-cyan-400 font-semibold">${settings.pricePerKwh.toFixed(3)}/kWh</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Subtotal Consumo</span>
                <span className="font-mono text-slate-200">${summary.energyCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Cargo Fijo / Distribución</span>
                <span className="font-mono text-slate-200">${settings.fixedCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-base font-bold">
                <span className="text-white">Factura Total Estimada</span>
                <span className="font-mono text-amber-400 text-lg">${summary.totalMonthlyCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Promedio Diario:</span>
              <span className="font-mono text-cyan-400 font-bold">{summary.dailyAverageKwh} kWh al día</span>{' '}
              (~${(summary.dailyAverageKwh * settings.pricePerKwh).toFixed(2)} diarios)
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center justify-between">
              <span>Consumo por Categoría</span>
              <PieChart className="w-4 h-4 text-purple-400" />
            </h3>

            <div className="space-y-3">
              {summary.categoryTotals.map((catItem) => {
                const meta = CATEGORIES.find((c) => c.id === catItem.category);
                return (
                  <div key={catItem.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${meta?.bgColor || 'bg-slate-500'}`}></span>
                        {meta?.name || catItem.category}
                      </span>
                      <span className="font-mono text-slate-400">
                        ${catItem.cost.toFixed(2)} ({catItem.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(3, catItem.percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Mobile One-Handed Use (Peldaño M3) */}
      <button
        onClick={onAddClick}
        type="button"
        className="sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-400/50 active:scale-90 transition-all cursor-pointer border-2 border-slate-900"
        title="Añadir aparato con una sola mano"
        aria-label="Añadir aparato"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
