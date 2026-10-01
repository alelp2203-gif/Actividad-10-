import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { APPLIANCE_PRESETS, AppliancePreset } from '../data/presets';
import { Appliance } from '../types';

interface PresetsBarProps {
  onSelectPreset: (preset: AppliancePreset) => void;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Añadir Rápido desde Plantilla (con Watts sugeridos)
        </span>
        <span className="text-[11px] text-slate-500">Un toque para cargar</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {APPLIANCE_PRESETS.slice(0, 8).map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-xs group cursor-pointer"
          >
            <Plus className="w-3 h-3 text-cyan-400 group-hover:scale-125 transition-transform" />
            <span className="font-medium">{preset.name.split(' (')[0]}</span>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
              {preset.watts}W
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
