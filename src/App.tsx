import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PresetsBar } from './components/PresetsBar';
import { ApplianceList } from './components/ApplianceList';
import { ScenarioComparison } from './components/ScenarioComparison';
import { AiDiagnosisView } from './components/AiDiagnosisView';
import { PracticeAuditView } from './components/PracticeAuditView';
import { TariffModal } from './components/TariffModal';
import { ApplianceFormModal } from './components/ApplianceFormModal';
import { 
  Appliance, 
  TariffSettings 
} from './types';
import { 
  calculateHouseholdSummary, 
  loadStoredState, 
  saveStoredState, 
  exportDataToJson,
  parseJsonBackup
} from './utils/calculator';
import { 
  SAMPLE_HOUSEHOLD_APPLIANCES, 
  SAMPLE_OPTIMIZED_APPLIANCES,
  AppliancePreset 
} from './data/presets';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  // Load initial state from localStorage (M2: Persistencia)
  const initialData = loadStoredState();

  const [appliancesA, setAppliancesA] = useState<Appliance[]>(() => {
    if (initialData?.appliancesA && Array.isArray(initialData.appliancesA)) {
      return initialData.appliancesA;
    }
    return SAMPLE_HOUSEHOLD_APPLIANCES;
  });

  const [appliancesB, setAppliancesB] = useState<Appliance[]>(() => {
    if (initialData?.appliancesB && Array.isArray(initialData.appliancesB)) {
      return initialData.appliancesB;
    }
    return SAMPLE_OPTIMIZED_APPLIANCES;
  });

  const [settings, setSettings] = useState<TariffSettings>(() => {
    if (initialData?.tariffSettings) {
      return initialData.tariffSettings;
    }
    return {
      pricePerKwh: 0.185,
      fixedCharge: 1.25,
      billingDays: 30,
      currency: '$',
      countryOrProvider: 'El Salvador (CAESS / Delsur promedio)',
    };
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'comparison' | 'ai' | 'audit'>('inventory');

  // Modals state
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [isApplianceModalOpen, setIsApplianceModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Save to localStorage automatically on state changes (Peldaño M2)
  useEffect(() => {
    saveStoredState({
      appliancesA,
      appliancesB,
      tariffSettings: settings,
      activeTab,
    });
  }, [appliancesA, appliancesB, settings, activeTab]);

  const summaryA = calculateHouseholdSummary(appliancesA, settings);

  // Appliance Handlers
  const handleSaveAppliance = (appliance: Appliance) => {
    if (editingAppliance) {
      setAppliancesA((prev) =>
        prev.map((item) => (item.id === appliance.id ? appliance : item))
      );
      showToast(`«${appliance.name}» actualizado.`);
    } else {
      setAppliancesA((prev) => [...prev, appliance]);
      showToast(`«${appliance.name}» agregado a tu inventario.`);
    }
    setEditingAppliance(null);
  };

  const handleEditClick = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsApplianceModalOpen(true);
  };

  const handleDuplicateAppliance = (appliance: Appliance) => {
    const duplicated: Appliance = {
      ...appliance,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${appliance.name} (Copia)`,
    };
    setAppliancesA((prev) => [...prev, duplicated]);
    showToast(`Se duplicó «${appliance.name}».`);
  };

  const handleDeleteAppliance = (id: string) => {
    const target = appliancesA.find((a) => a.id === id);
    setAppliancesA((prev) => prev.filter((a) => a.id !== id));
    showToast(`«${target?.name || 'Aparato'}» eliminado.`);
  };

  const handleSelectPreset = (preset: AppliancePreset) => {
    const newAppliance: Appliance = {
      id: `app-preset-${Date.now()}`,
      name: preset.name,
      category: preset.category,
      watts: preset.watts,
      hoursPerDay: preset.typicalHours,
      daysPerMonth: preset.typicalDays,
      quantity: preset.quantity,
      notes: preset.description,
    };
    setAppliancesA((prev) => [...prev, newAppliance]);
    showToast(`Plantilla «${preset.name}» agregada con ${preset.watts}W.`);
  };

  const handleLoadSampleHousehold = () => {
    setAppliancesA(SAMPLE_HOUSEHOLD_APPLIANCES);
    setAppliancesB(SAMPLE_OPTIMIZED_APPLIANCES);
    showToast('Hogar de ejemplo con 8 aparatos cargado exitosamente.');
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas vaciar el inventario para probar el estado inicial (M3: Estado vacío)?')) {
      setAppliancesA([]);
      setAppliancesB([]);
      showToast('Inventario vaciado. Se activó el estado inicial.');
    }
  };

  const handleExport = () => {
    exportDataToJson({
      appliancesA,
      appliancesB,
      tariffSettings: settings,
      activeTab,
    });
    showToast('Copia de respaldo JSON descargada a tu equipo.');
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;
      const parsed = parseJsonBackup(content);
      if (parsed) {
        setAppliancesA(parsed.appliancesA);
        setAppliancesB(parsed.appliancesB);
        setSettings(parsed.tariffSettings);
        showToast(`Respaldo importado: ${parsed.appliancesA.length} aparatos cargados.`);
      } else {
        showToast('Error: El archivo no tiene el formato de respaldo de Recibo Claro.');
      }
    };
    reader.readAsText(file);
  };

  const handleCloneAToB = () => {
    setAppliancesB(JSON.parse(JSON.stringify(appliancesA)));
    showToast('Escenario A clonado al Escenario B para simular cambios.');
  };

  const handleLoadPresetB = () => {
    setAppliancesB(SAMPLE_OPTIMIZED_APPLIANCES);
    showToast('Escenario Optimizado (luces LED y termostatos 24°C) cargado.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/80 text-cyan-300 text-xs sm:text-sm font-medium shadow-2xl shadow-cyan-500/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Live HUD and Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summary={summaryA}
        settings={settings}
        onOpenSettings={() => setIsTariffModalOpen(true)}
        onLoadSample={handleLoadSampleHousehold}
        onExport={handleExport}
        onImport={handleImportJson}
        onReset={handleReset}
        hasAppliances={appliancesA.length > 0}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1">
        {activeTab === 'inventory' && (
          <div>
            {/* Quick Presets Bar (Solves User Test #1 Finding) */}
            <PresetsBar onSelectPreset={handleSelectPreset} />

            {/* Appliance Dashboard and List */}
            <ApplianceList
              summary={summaryA}
              settings={settings}
              onAddClick={() => {
                setEditingAppliance(null);
                setIsApplianceModalOpen(true);
              }}
              onEditClick={handleEditClick}
              onDuplicate={handleDuplicateAppliance}
              onDelete={handleDeleteAppliance}
              onLoadSample={handleLoadSampleHousehold}
            />
          </div>
        )}

        {activeTab === 'comparison' && (
          <ScenarioComparison
            appliancesA={appliancesA}
            appliancesB={appliancesB}
            settings={settings}
            onUpdateApplianceB={setAppliancesB}
            onCloneAToB={handleCloneAToB}
            onLoadPresetB={handleLoadPresetB}
          />
        )}

        {activeTab === 'ai' && (
          <AiDiagnosisView
            appliances={appliancesA}
            settings={settings}
            summary={summaryA}
          />
        )}

        {activeTab === 'audit' && <PracticeAuditView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <b className="text-slate-400 font-mono">RECIBO CLARO</b> · Ejercicio N.º 35 · Hogar y Energía
          </div>
          <div>
            Semana 1 · Práctica 1 · 3.er año Desarrollo de Software «B» · INDEL · Octubre 2026
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TariffModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast(`Tarifa ajustada a $${newSettings.pricePerKwh.toFixed(3)}/kWh.`);
        }}
      />

      <ApplianceFormModal
        isOpen={isApplianceModalOpen}
        onClose={() => {
          setIsApplianceModalOpen(false);
          setEditingAppliance(null);
        }}
        onSave={handleSaveAppliance}
        editingAppliance={editingAppliance}
        tariff={settings.pricePerKwh}
      />
    </div>
  );
}
