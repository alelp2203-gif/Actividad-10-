import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Flame, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Copy, 
  Check, 
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Zap,
  Lightbulb
} from 'lucide-react';
import { Appliance, TariffSettings, AiAnalysisResult } from '../types';
import { HouseholdSummary } from '../utils/calculator';

interface AiDiagnosisViewProps {
  appliances: Appliance[];
  settings: TariffSettings;
  summary: HouseholdSummary;
}

export const AiDiagnosisView: React.FC<AiDiagnosisViewProps> = ({
  appliances,
  settings,
  summary,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const [rawJsonResponse, setRawJsonResponse] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string>('');

  const runAiAnalysis = async (forceFallback = false) => {
    if (appliances.length === 0) {
      setErrorMsg('Debes registrar al menos un electrodoméstico antes de solicitar el análisis de IA.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          appliances: summary.calculatedAppliances,
          tariff: settings.pricePerKwh,
          totalKwh: summary.totalMonthlyKwh,
          totalCost: summary.totalMonthlyCost,
          forceFallback,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAnalysisResult(resData.data);
        setSourceInfo(resData.source || 'Gemini 3.8 Flash');
        setRawJsonResponse(JSON.stringify(resData.data, null, 2));
      } else {
        throw new Error(resData.error || 'Respuesta inválida del servidor');
      }
    } catch (err: any) {
      console.warn('Plan de contingencia activado por timeout o fallo de red:', err);
      // Motor de contingencia local inmediato en cliente (Garantía de respuesta en <5000ms sin pantalla rota)
      const sorted = [...summary.calculatedAppliances].sort((a, b) => b.monthlyKwh - a.monthlyKwh);
      const top3 = sorted.slice(0, 3);
      const vampires = top3.map((app, idx) => {
        const pct = summary.totalMonthlyKwh > 0 ? (app.monthlyKwh / summary.totalMonthlyKwh) * 100 : 0;
        return {
          rank: idx + 1,
          name: app.name,
          monthlyKwh: Math.round(app.monthlyKwh * 10) / 10,
          monthlyCost: Math.round(app.monthlyCost * 100) / 100,
          percentageOfTotal: Math.round(pct * 10) / 10,
          reason: `Aparato de alta demanda continua (${app.watts}W por ${app.hoursPerDay}h/día).`,
          concreteProposal: 'Reducir el tiempo de uso diario en un 25% o desconectar completamente para evitar standby.',
          estimatedKwhSavings: Math.round(app.monthlyKwh * 0.25 * 10) / 10,
          estimatedDollarSavings: Math.round(app.monthlyCost * 0.25 * 100) / 100,
        };
      });

      const totalSavedKwh = vampires.reduce((acc, v) => acc + v.estimatedKwhSavings, 0);
      const totalSavedCost = vampires.reduce((acc, v) => acc + v.estimatedDollarSavings, 0);

      const localResult: AiAnalysisResult = {
        summary: `Plan de contingencia activado: Se detectaron ${vampires.length} aparatos prioritarios que concentran el mayor consumo del hogar. Con ajustes moderados se proyecta un ahorro estimado de $${totalSavedCost.toFixed(2)} mensuales.`,
        monthlyTotalKwh: summary.totalMonthlyKwh,
        monthlyTotalCost: summary.totalMonthlyCost,
        vampireAppliances: vampires,
        overallTips: [
          'Evita mantener equipos en reposo (consumo fantasma puede representar hasta 10% del recibo).',
          'Aprovecha la ventilación cruzada y luz natural en las horas de menor radiación.',
          'Revisa el sellado de puertas de refrigeración y aísla fuentes térmicas.',
        ],
        potentialMonthlySavingsKwh: Math.round(totalSavedKwh * 10) / 10,
        potentialMonthlySavingsDollars: Math.round(totalSavedCost * 100) / 100,
        isFallback: true,
      };

      setAnalysisResult(localResult);
      setSourceInfo('Plan de Contingencia Local (Activado por timeout >5s o sin conexión)');
      setRawJsonResponse(JSON.stringify(localResult, null, 2));
      setErrorMsg(
        'Aviso: La respuesta de la API de IA demoró más de 5 segundos o no hubo conexión. El diagnóstico se calculó al instante con el motor matemático de respaldo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!rawJsonResponse) return;
    navigator.clipboard.writeText(rawJsonResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Explanation of M5 Requirement */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-pink-950/80 border border-pink-800 text-pink-400 uppercase tracking-widest">
                Peldaño M5 · Sello de Inteligencia
              </span>
              <span className="text-xs text-slate-500 font-mono">responseSchema (JSON Estructurado)</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-pink-400" />
              Auditoría Energética Inteligente
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              La IA analiza el patrón de tu casa, identifica los 3 aparatos de mayor impacto (vampiros energéticos) y genera propuestas de ahorro con estimación exacta en kWh y dólares.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => runAiAnalysis(false)}
              disabled={loading || appliances.length === 0}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analizando con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analizar con Gemini IA</span>
                </>
              )}
            </button>

            {/* Test Button for M4/M5 Failure Handling (Tester demonstration) */}
            <button
              onClick={() => runAiAnalysis(true)}
              disabled={loading || appliances.length === 0}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              title="Prueba de contingencia: simula la ausencia de internet o API para comprobar que la app no se rompe y responde con su motor local"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Simular Contingencia (Plan B)</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Aviso de Contingencia</div>
            <div>{errorMsg}</div>
          </div>
        </div>
      )}

      {/* Main Analysis Results */}
      {analysisResult ? (
        <div className="space-y-6">
          {/* Status and Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Fuente del análisis:</span>
              <span className="font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {sourceInfo}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vista Ejecutiva
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'json'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Salida JSON (responseSchema)</span>
              </button>
            </div>
          </div>

          {viewMode === 'cards' ? (
            <>
              {/* Executive Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-xs font-mono uppercase text-pink-400 tracking-wider font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Diagnóstico Integral del Hogar
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {analysisResult.summary}
                </p>

                {/* Savings Potential Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Ahorro Mensual Potencial:</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        ${analysisResult.potentialMonthlySavingsDollars.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-2 py-1 rounded-lg">
                      {analysisResult.potentialMonthlySavingsKwh} kWh / mes
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Ahorro Anual Proyectado:</span>
                      <span className="text-xl font-bold font-mono text-amber-400">
                        ${(analysisResult.potentialMonthlySavingsDollars * 12).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-1 rounded-lg">
                      En 12 meses
                    </span>
                  </div>
                </div>
              </div>

              {/* The 3 Vampire Appliances (Sello de IA) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>Los 3 Aparatos que Más Pesan en Tu Recibo</span>
                  </h3>
                  <span className="text-xs text-slate-400">Identificados y jerarquizados por la IA</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisResult.vampireAppliances.map((vampire) => (
                    <div
                      key={vampire.rank}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500"></div>

                      <div>
                        {/* Rank Badge and Title */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                            #{vampire.rank}
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                            {vampire.percentageOfTotal}% del recibo
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-2 leading-tight">
                          {vampire.name}
                        </h4>

                        <div className="space-y-1 text-xs font-mono text-slate-400 mb-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                          <div className="flex justify-between">
                            <span>Consumo mensual:</span>
                            <span className="text-white font-bold">{vampire.monthlyKwh} kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Costo mensual actual:</span>
                            <span className="text-amber-400 font-bold">${vampire.monthlyCost.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-3">
                          <span className="text-[11px] font-mono text-slate-400 uppercase block mb-0.5">
                            ¿Por qué consume tanto?
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {vampire.reason}
                          </p>
                        </div>

                        {/* Concrete Proposal */}
                        <div className="p-3 rounded-lg bg-pink-950/20 border border-pink-800/40 mb-3">
                          <span className="text-[11px] font-mono text-pink-400 font-bold uppercase block mb-1">
                            Acción recomendada:
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {vampire.concreteProposal}
                          </p>
                        </div>
                      </div>

                      {/* Estimated Savings */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Ahorro estimado:</span>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold">
                            -${vampire.estimatedDollarSavings.toFixed(2)}/mes
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            (-{vampire.estimatedKwhSavings} kWh)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 General Tips */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Consejos Prácticos de Hábitos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {analysisResult.overallTips.map((tip, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* JSON Raw Output View (Demonstrates compliance with responseSchema) */
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400">
                  Esquema JSON Estructurado devuelto por Gemini 3.8 Flash (responseSchema):
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-900/60 rounded-lg max-h-96">
                <code>{rawJsonResponse}</code>
              </pre>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Idle State */
        <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-8 sm:p-12 text-center my-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            El Sello de Inteligencia de Recibo Claro
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Pulsa el botón «Analizar con Gemini IA» para ejecutar la auditoría energética de tus electrodomésticos con salida JSON estructurada y propuestas concretas de ahorro.
          </p>
          <button
            onClick={() => runAiAnalysis(false)}
            disabled={loading || appliances.length === 0}
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-pink-500/25 transition-all mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ejecutar Diagnóstico Ahora</span>
          </button>
        </div>
      )}
    </div>
  );
};
