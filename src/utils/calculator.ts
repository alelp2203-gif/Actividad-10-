import { Appliance, CalculatedAppliance, TariffSettings } from '../types';

export function calculateApplianceMetrics(
  appliance: Appliance,
  tariff: number,
  totalKwh: number
): CalculatedAppliance {
  const dailyKwh = (appliance.watts * appliance.hoursPerDay * appliance.quantity) / 1000;
  const monthlyKwh = (appliance.watts * appliance.hoursPerDay * appliance.daysPerMonth * appliance.quantity) / 1000;
  const monthlyCost = monthlyKwh * tariff;
  const percentageOfTotal = totalKwh > 0 ? (monthlyKwh / totalKwh) * 100 : 0;

  return {
    ...appliance,
    dailyKwh: Math.round(dailyKwh * 100) / 100,
    monthlyKwh: Math.round(monthlyKwh * 10) / 10,
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    percentageOfTotal: Math.round(percentageOfTotal * 10) / 10,
  };
}

export interface HouseholdSummary {
  totalMonthlyKwh: number;
  energyCost: number;
  totalMonthlyCost: number;
  dailyAverageKwh: number;
  vampireAppliance: CalculatedAppliance | null;
  calculatedAppliances: CalculatedAppliance[];
  categoryTotals: {
    category: string;
    kwh: number;
    cost: number;
    percentage: number;
  }[];
}

export function calculateHouseholdSummary(
  appliances: Appliance[],
  settings: TariffSettings
): HouseholdSummary {
  // First pass to get total kWh
  const rawTotalKwh = appliances.reduce((acc, app) => {
    return acc + (app.watts * app.hoursPerDay * app.daysPerMonth * app.quantity) / 1000;
  }, 0);

  // Second pass with percentage of total
  const calculatedAppliances = appliances
    .map((app) => calculateApplianceMetrics(app, settings.pricePerKwh, rawTotalKwh))
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh);

  const totalMonthlyKwh = Math.round(rawTotalKwh * 10) / 10;
  const energyCost = Math.round(totalMonthlyKwh * settings.pricePerKwh * 100) / 100;
  const totalMonthlyCost = Math.round((energyCost + settings.fixedCharge) * 100) / 100;
  const dailyAverageKwh = Math.round((totalMonthlyKwh / (settings.billingDays || 30)) * 100) / 100;

  const vampireAppliance = calculatedAppliances.length > 0 ? calculatedAppliances[0] : null;

  // Category breakdown
  const categoryMap = new Map<string, { kwh: number; cost: number }>();
  calculatedAppliances.forEach((app) => {
    const prev = categoryMap.get(app.category) || { kwh: 0, cost: 0 };
    categoryMap.set(app.category, {
      kwh: prev.kwh + app.monthlyKwh,
      cost: prev.cost + app.monthlyCost,
    });
  });

  const categoryTotals = Array.from(categoryMap.entries()).map(([cat, data]) => ({
    category: cat,
    kwh: Math.round(data.kwh * 10) / 10,
    cost: Math.round(data.cost * 100) / 100,
    percentage: totalMonthlyKwh > 0 ? Math.round((data.kwh / totalMonthlyKwh) * 1000) / 10 : 0,
  })).sort((a, b) => b.kwh - a.kwh);

  return {
    totalMonthlyKwh,
    energyCost,
    totalMonthlyCost,
    dailyAverageKwh,
    vampireAppliance,
    calculatedAppliances,
    categoryTotals,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

export function formatKwh(kwh: number): string {
  return `${kwh.toFixed(1)} kWh`;
}

// LocalStorage helpers (M2: Persistencia)
const STORAGE_KEY = 'recibo_claro_app_state_v1';

export interface StoredState {
  appliancesA: Appliance[];
  appliancesB: Appliance[];
  tariffSettings: TariffSettings;
  activeTab: string;
}

export function loadStoredState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al cargar datos de localStorage:', e);
    return null;
  }
}

export function saveStoredState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error al guardar datos en localStorage:', e);
  }
}

export function exportDataToJson(state: StoredState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recibo-claro-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseJsonBackup(jsonString: string): StoredState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.appliancesA)) return null;
    return {
      appliancesA: parsed.appliancesA,
      appliancesB: Array.isArray(parsed.appliancesB) ? parsed.appliancesB : [],
      tariffSettings: parsed.tariffSettings || {
        pricePerKwh: 0.185,
        fixedCharge: 1.25,
        billingDays: 30,
        currency: '$',
        countryOrProvider: 'Residencial',
      },
      activeTab: parsed.activeTab || 'inventory',
    };
  } catch (err) {
    console.error('Error al analizar archivo JSON de respaldo:', err);
    return null;
  }
}
