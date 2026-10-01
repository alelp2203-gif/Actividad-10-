export type ApplianceCategory =
  | 'climatizacion'
  | 'refrigeracion'
  | 'cocina'
  | 'iluminacion'
  | 'entretenimiento'
  | 'lavado'
  | 'bano'
  | 'computo'
  | 'otros';

export interface Appliance {
  id: string;
  name: string;
  category: ApplianceCategory;
  watts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  quantity: number;
  notes?: string;
}

export interface CalculatedAppliance extends Appliance {
  dailyKwh: number;
  monthlyKwh: number;
  monthlyCost: number;
  percentageOfTotal: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  appliances: Appliance[];
}

export interface TariffSettings {
  pricePerKwh: number;
  fixedCharge: number;
  billingDays: number;
  currency: string;
  countryOrProvider: string;
}

export interface VampireAppliance {
  rank: number;
  name: string;
  monthlyKwh: number;
  monthlyCost: number;
  percentageOfTotal: number;
  reason: string;
  concreteProposal: string;
  estimatedKwhSavings: number;
  estimatedDollarSavings: number;
}

export interface AiAnalysisResult {
  summary: string;
  monthlyTotalKwh: number;
  monthlyTotalCost: number;
  vampireAppliances: VampireAppliance[];
  overallTips: string[];
  potentialMonthlySavingsKwh: number;
  potentialMonthlySavingsDollars: number;
  isFallback?: boolean;
}

export interface ValidationTestItem {
  id: number;
  action: string;
  inputDescription: string;
  whatHappenedBefore: string;
  whatHappensNow: string;
  status: 'passed' | 'fixed';
}

export interface RealUserTestItem {
  userType: string;
  personDescription: string;
  attemptedAction: string;
  whereGotStuck: string;
  exactQuote: string;
  wasFixed: boolean;
  fixDetails: string;
}
