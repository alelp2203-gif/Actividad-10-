import React, { useState } from 'react';
import { X, DollarSign, Check, HelpCircle } from 'lucide-react';
import { TariffSettings } from '../types';

interface TariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TariffSettings;
  onSave: (newSettings: TariffSettings) => void;
}

export const TariffModal: React.FC<TariffModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [price, setPrice] = useState<number>(settings.pricePerKwh);
  const [fixedCharge, setFixedCharge] = useState<number>(settings.fixedCharge);
  const [billingDays, setBillingDays] = useState<number>(settings.billingDays);
  const [provider, setProvider] = useState<string>(settings.countryOrProvider);

  if (!isOpen) return null;

  const handleApplyPreset = (presetPrice: number, name: string) => {
    setPrice(presetPrice);
    setProvider(name);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      pricePerKwh: Math.max(0.01, Math.min(2.0, price)),
      fixedCharge: Math.max(0, fixedCharge),
      billingDays: Math.max(1, Math.min(31, billingDays)),
      currency: '$',
      countryOrProvider: provider,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Configurar Tarifa Eléctrica
            </h3>
            <p className="text-xs text-slate-400">
              Ajusta el precio del kWh según tu recibo de energía local
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          {/* Quick presets for common rates */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Tarifas de Referencia Rápida:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleApplyPreset(0.185, 'El Salvador (AES / Delsur promedio)')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-200">El Salvador Residencial</div>
                <div className="text-cyan-400 font-mono">$0.185 / kWh</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.09, 'Subsidio Residencial (<99 kWh)')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-200">Con Subsidio Estatal</div>
                <div className="text-emerald-400 font-mono">$0.090 / kWh</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.22, 'Alto Consumo (>300 kWh)')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-200">Alto Consumo / Penalizado</div>
                <div className="text-amber-400 font-mono">$0.220 / kWh</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(0.15, 'Estándar Internacional')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-200">Promedio Regional</div>
                <div className="text-purple-400 font-mono">$0.150 / kWh</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="pricePerKwh" className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Precio por Kilovatio-hora ($ USD / kWh) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">$</span>
              <input
                id="pricePerKwh"
                type="number"
                step="0.001"
                min="0.01"
                max="2.0"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Revisa en tu factura física o digital el rubro «Energía activa» o «Cargo por energía».
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fixedCharge" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Cargo Fijo Mensual ($)
              </label>
              <input
                id="fixedCharge"
                type="number"
                step="0.05"
                min="0"
                value={fixedCharge}
                onChange={(e) => setFixedCharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="billingDays" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Días de Facturación
              </label>
              <input
                id="billingDays"
                type="number"
                min="1"
                max="31"
                value={billingDays}
                onChange={(e) => setBillingDays(parseInt(e.target.value, 10) || 30)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="providerName" className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Nota / Nombre de Distribuidora
            </label>
            <input
              id="providerName"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Ej. CAESS, Delsur, Clesa, EEO, etc."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              Guardar Tarifa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
