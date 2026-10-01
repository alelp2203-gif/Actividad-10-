import React, { useState, useEffect } from 'react';
import { X, Plus, Check, AlertCircle, Zap, Clock, Calendar, HelpCircle } from 'lucide-react';
import { Appliance, ApplianceCategory } from '../types';
import { CATEGORIES } from '../data/presets';

interface ApplianceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appliance: Appliance) => void;
  editingAppliance?: Appliance | null;
  tariff: number;
}

export const ApplianceFormModal: React.FC<ApplianceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAppliance,
  tariff,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ApplianceCategory>('climatizacion');
  const [watts, setWatts] = useState<number>(100);
  const [hoursPerDay, setHoursPerDay] = useState<number>(5);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(30);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAppliance) {
      setName(editingAppliance.name);
      setCategory(editingAppliance.category);
      setWatts(editingAppliance.watts);
      setHoursPerDay(editingAppliance.hoursPerDay);
      setDaysPerMonth(editingAppliance.daysPerMonth);
      setQuantity(editingAppliance.quantity);
      setNotes(editingAppliance.notes || '');
    } else {
      setName('');
      setCategory('refrigeracion');
      setWatts(200);
      setHoursPerDay(8);
      setDaysPerMonth(30);
      setQuantity(1);
      setNotes('');
    }
    setErrors({});
  }, [editingAppliance, isOpen]);

  if (!isOpen) return null;

  // Input sanitization handlers (Peldaño M4: Validación estricta en tiempo real)
  const handleNameChange = (val: string) => {
    // Sanitizar texto: remover caracteres de control
    const sanitized = val.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    setName(sanitized);
    if (!sanitized.trim()) {
      setErrors((prev) => ({ ...prev, name: 'El nombre del aparato no puede quedar vacío.' }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  const handleWattsChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setWatts(0);
      setErrors((prev) => ({ ...prev, watts: 'Ingresa un número válido de Watts.' }));
      return;
    }
    if (num <= 0) {
      setWatts(0);
      setErrors((prev) => ({ ...prev, watts: 'La potencia debe ser mayor a 0 Watts (no números negativos ni cero).' }));
      return;
    }
    if (num > 25000) {
      setWatts(25000);
      setErrors((prev) => ({ ...prev, watts: 'Tope máximo: 25,000W para aparatos residenciales.' }));
      return;
    }
    setWatts(num);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.watts;
      return next;
    });
  };

  const handleHoursChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setHoursPerDay(0);
      setErrors((prev) => ({ ...prev, hoursPerDay: 'Ingresa las horas de uso diario.' }));
      return;
    }
    if (num <= 0) {
      setHoursPerDay(0);
      setErrors((prev) => ({ ...prev, hoursPerDay: 'El tiempo de uso debe ser mayor a 0 horas.' }));
      return;
    }
    if (num > 24) {
      setHoursPerDay(24);
      setErrors((prev) => ({ ...prev, hoursPerDay: 'Límite físico: un día tiene un máximo de 24 horas.' }));
      return;
    }
    setHoursPerDay(Math.round(num * 100) / 100);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.hoursPerDay;
      return next;
    });
  };

  // Validation function (Peldaño M4: Que no se rompa)
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'El nombre del aparato es obligatorio.';
    } else if (name.trim().length > 60) {
      errs.name = 'El nombre no debe exceder 60 caracteres.';
    }

    if (isNaN(watts) || watts <= 0) {
      errs.watts = 'La potencia debe ser un número mayor a 0 Watts.';
    } else if (watts > 25000) {
      errs.watts = 'Potencia excesiva (máximo 25,000 Watts para uso residencial).';
    }

    if (isNaN(hoursPerDay) || hoursPerDay <= 0) {
      errs.hoursPerDay = 'Las horas de uso diario deben ser mayores a 0.';
    } else if (hoursPerDay > 24) {
      errs.hoursPerDay = 'Un día solo tiene 24 horas. Ingresa un valor entre 0.1 y 24.';
    }

    if (isNaN(daysPerMonth) || daysPerMonth < 1 || daysPerMonth > 31) {
      errs.daysPerMonth = 'Los días al mes deben estar entre 1 y 31.';
    }

    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      errs.quantity = 'La cantidad debe estar entre 1 y 100 unidades.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);

    const newAppliance: Appliance = {
      id: editingAppliance ? editingAppliance.id : `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      category,
      watts: Number(watts),
      hoursPerDay: Number(hoursPerDay),
      daysPerMonth: Number(daysPerMonth),
      quantity: Number(quantity),
      notes: notes.trim(),
    };

    onSave(newAppliance);
    setIsSubmitting(false);
    onClose();
  };

  // Preview calculations
  const previewMonthlyKwh = (watts * hoursPerDay * daysPerMonth * quantity) / 1000;
  const previewMonthlyCost = previewMonthlyKwh * tariff;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              {editingAppliance ? 'Modificar Aparato' : 'Registrar Nuevo Aparato'}
            </h3>
            <p className="text-xs text-slate-400">
              Ingresa la potencia en vatios y el tiempo de uso diario
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Appliance Name */}
          <div>
            <label htmlFor="appName" className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Nombre del Aparato o Equipo *
            </label>
            <input
              id="appName"
              type="text"
              maxLength={60}
              placeholder="Ej. Refrigerador de la cocina, Smart TV sala, etc."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full bg-slate-950 border ${
                errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
              } rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none`}
            />
            {errors.name && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all flex items-center justify-between ${
                    category === cat.id
                      ? `${cat.bgColor} border-cyan-500/70 text-cyan-300 shadow-sm font-semibold`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {category === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Power (Watts) & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="appWatts" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Potencia (Watts / Vatios) *
              </label>
              <div className="relative">
                <input
                  id="appWatts"
                  type="number"
                  step="1"
                  min="1"
                  max="25000"
                  value={watts || ''}
                  onChange={(e) => handleWattsChange(e.target.value)}
                  className={`w-full bg-slate-950 border ${
                    errors.watts ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  } rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">W</span>
              </div>
              {errors.watts && (
                <p className="text-[11px] text-rose-400 mt-1 font-mono">{errors.watts}</p>
              )}
            </div>

            <div>
              <label htmlFor="appQty" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Cantidad de Unidades
              </label>
              <input
                id="appQty"
                type="number"
                min="1"
                max="100"
                value={quantity || ''}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Hours per Day & Shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="appHours" className="text-xs font-mono uppercase text-slate-300">
                Horas de Uso Diario (al día) *
              </label>
              <span className="text-xs font-mono text-cyan-400 font-bold">{hoursPerDay} hrs/día</span>
            </div>
            <input
              id="appHours"
              type="number"
              step="0.1"
              min="0.01"
              max="24"
              value={hoursPerDay || ''}
              onChange={(e) => handleHoursChange(e.target.value)}
              className={`w-full bg-slate-950 border ${
                errors.hoursPerDay ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
              } rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none`}
            />

            {/* Quick shortcuts for mobile usability */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: '15 min (0.25h)', val: 0.25 },
                { label: '30 min (0.5h)', val: 0.5 },
                { label: '1 hora', val: 1 },
                { label: '4 horas', val: 4 },
                { label: '8 horas', val: 8 },
                { label: '10 horas (refri)', val: 10 },
                { label: '24 horas', val: 24 },
              ].map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => setHoursPerDay(shortcut.val)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    hoursPerDay === shortcut.val
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
            {errors.hoursPerDay && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.hoursPerDay}</p>
            )}
          </div>

          {/* Days per month & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="appDays" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Días al Mes
              </label>
              <input
                id="appDays"
                type="number"
                min="1"
                max="31"
                value={daysPerMonth || ''}
                onChange={(e) => setDaysPerMonth(parseInt(e.target.value, 10) || 30)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">Ej. 30 (todos los días) o 8 (fines de semana)</span>
            </div>

            <div>
              <label htmlFor="appNotes" className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Ubicación / Nota
              </label>
              <input
                id="appNotes"
                type="text"
                maxLength={40}
                placeholder="Ej. Habitación principal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Real-time Calculation Preview Card */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Impacto Calculado:</span>
              <div className="text-sm text-slate-200 font-medium">
                {previewMonthlyKwh.toFixed(1)} kWh al mes
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Costo Estimado:</span>
              <div className="text-base font-bold font-mono text-amber-400">
                ${previewMonthlyCost.toFixed(2)} / mes
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={isSubmitting || !name.trim() || watts <= 0 || hoursPerDay <= 0 || hoursPerDay > 24 || Object.keys(errors).length > 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Guardando...' : editingAppliance ? 'Guardar Cambios' : 'Agregar Aparato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
