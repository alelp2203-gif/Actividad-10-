import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Local algorithmic fallback calculation when AI is unavailable or fails (Práctica 1 - Plan B / Manejo de Fallo)
function calculateLocalAnalysis(appliances: any[], tariff: number, totalKwh: number, totalCost: number) {
  const sorted = [...appliances].sort((a, b) => (b.kwhPerMonth || 0) - (a.kwhPerMonth || 0));
  const top3 = sorted.slice(0, 3);

  const vampireAppliances = top3.map((appliance, index) => {
    const kwh = Number(appliance.kwhPerMonth) || 0;
    const cost = Number(appliance.costPerMonth) || 0;
    const pct = totalKwh > 0 ? (kwh / totalKwh) * 100 : 0;
    
    // Heuristic recommendations by category or device name
    let reason = `Representa el ${pct.toFixed(1)}% del consumo total mensual del hogar.`;
    let proposal = '';
    let savedPct = 0.25; // 25% average reduction

    const lower = appliance.name.toLowerCase();
    if (lower.includes('aire') || lower.includes('ac') || appliance.category === 'climatizacion') {
      reason = 'Aparato de alto consumo térmico continuo.';
      proposal = 'Ajustar el termostato a 24°C y programar temporizador para apagarlo 1 hora antes de levantarse.';
      savedPct = 0.30;
    } else if (lower.includes('refrigerador') || lower.includes('refri') || appliance.category === 'refrigeracion') {
      reason = 'Funciona 24 horas al día; empaques desgastados o exceso de escarcha duplican el gasto.';
      proposal = 'Limpiar serpentines traseros, revisar sello magnético y no introducir alimentos calientes.';
      savedPct = 0.15;
    } else if (lower.includes('ducha') || lower.includes('calentador') || appliance.category === 'bano') {
      reason = 'Elemento resistivo de altísima potencia (3000W - 5000W).';
      proposal = 'Reducir el tiempo de baño a 5 minutos y utilizar nivel tibio en lugar de caliente máximo.';
      savedPct = 0.35;
    } else if (lower.includes('televisor') || lower.includes('pantalla') || lower.includes('consola') || appliance.category === 'entretenimiento') {
      reason = 'Uso prolongado de entretenimiento y consumo fantasma en modo reposo (standby).';
      proposal = 'Desconectar con regleta con interruptor cuando no se use y activar modo de ahorro de energía.';
      savedPct = 0.20;
    } else if (lower.includes('foco') || lower.includes('bombillo') || appliance.category === 'iluminacion') {
      reason = 'Múltiples unidades encendidas simultáneamente por largos periodos.';
      proposal = 'Reemplazar por luminarias LED de 9W y aprovechar al máximo la luz solar matutina.';
      savedPct = 0.50;
    } else if (lower.includes('plancha') || lower.includes('lavadora') || appliance.category === 'lavado') {
      reason = 'Ciclos frecuentes de calentamiento y motores de alta carga.';
      proposal = 'Planchar toda la ropa en una sola tanda y lavar siempre con cargas completas de ropa.';
      savedPct = 0.25;
    } else {
      proposal = `Reducir 1 a 2 horas diarias de uso no esencial o desconectar de la toma cuando termine su función.`;
      savedPct = 0.20;
    }

    const estimatedKwhSavings = Math.round((kwh * savedPct) * 10) / 10;
    const estimatedDollarSavings = Math.round((estimatedKwhSavings * tariff) * 100) / 100;

    return {
      rank: index + 1,
      name: appliance.name,
      monthlyKwh: Math.round(kwh * 10) / 10,
      monthlyCost: Math.round(cost * 100) / 100,
      percentageOfTotal: Math.round(pct * 10) / 10,
      reason,
      concreteProposal: proposal,
      estimatedKwhSavings,
      estimatedDollarSavings,
    };
  });

  const potentialMonthlySavingsKwh = Math.round(vampireAppliances.reduce((acc, v) => acc + v.estimatedKwhSavings, 0) * 10) / 10;
  const potentialMonthlySavingsDollars = Math.round(vampireAppliances.reduce((acc, v) => acc + v.estimatedDollarSavings, 0) * 100) / 100;

  return {
    summary: `Análisis completado: Tus 3 aparatos principales representan el ${vampireAppliances.reduce((acc, v) => acc + v.percentageOfTotal, 0).toFixed(1)}% de tu factura mensual. Con cambios específicos podrías ahorrar aproximadamente $${potentialMonthlySavingsDollars.toFixed(2)} al mes (${potentialMonthlySavingsKwh.toFixed(1)} kWh).`,
    monthlyTotalKwh: Math.round(totalKwh * 10) / 10,
    monthlyTotalCost: Math.round(totalCost * 100) / 100,
    vampireAppliances,
    overallTips: [
      'Desconecta aparatos en modo standby (cargadores, consolas, microondas) que suman entre 5% y 10% del consumo fantasma.',
      'Aprovecha los bloques de luz natural entre 7:00 a.m. y 5:00 p.m. apagando luces interiores.',
      'Da mantenimiento preventivo a empaques de refrigeración y filtros de aire para mantener su eficiencia original.',
    ],
    potentialMonthlySavingsKwh,
    potentialMonthlySavingsDollars,
    isFallback: true,
  };
}

// API endpoint for electricity receipt AI diagnostic (Peldaño M5)
app.post('/api/analyze-receipt', async (req: Request, res: Response) => {
  try {
    const { appliances, tariff = 0.18, totalKwh = 0, totalCost = 0, forceFallback = false } = req.body;

    if (!Array.isArray(appliances) || appliances.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un aparato registrado.' });
    }

    // If requested to force fallback (for testing M5 failure handling) or no API key
    if (forceFallback || !ai) {
      const fallbackResult = calculateLocalAnalysis(appliances, tariff, totalKwh, totalCost);
      return res.json({
        success: true,
        source: forceFallback ? 'Simulación de contingencia (Plan B / Sin conexión)' : 'Motor local algorítmico (Sin API Key configurada)',
        data: fallbackResult,
      });
    }

    // Call Gemini 3.8 Flash with structured schema
    const prompt = `Actúa como un experto en auditoría energética residencial para el ejercicio escolar "Recibo Claro" (Semana 1 - Práctica 1).
La familia quiere entender qué electrodomésticos están inflando su factura eléctrica mensual y cómo reducirlos sin sacrificar comodidad básica.

Datos del hogar:
- Tarifa eléctrica configurada: $${tariff} USD por kWh.
- Consumo total estimado: ${totalKwh.toFixed(2)} kWh/mes.
- Costo total estimado: $${totalCost.toFixed(2)} USD/mes.

Lista de electrodomésticos registrados:
${JSON.stringify(
  appliances.map((a: any) => ({
    nombre: a.name,
    categoria: a.category,
    potenciaWatts: a.watts,
    horasUsoDiarias: a.hoursPerDay,
    diasUsoMes: a.daysPerMonth,
    cantidad: a.quantity,
    consumoKwhMes: a.kwhPerMonth,
    costoMes: a.costPerMonth,
  })),
  null,
  2
)}

Instrucciones precisas:
1. Identifica con exactitud los 3 aparatos que más pesan en el recibo (vampiros de energía).
2. Para cada uno, explica el porqué concreto de su alto costo.
3. Propón una acción correctiva realista y alcanzable para una familia promedio (por ejemplo, regular temperatura, reducir horas no indispensables, mantenimiento de empaques o sustitución tecnológica).
4. Estima el ahorro en kWh y en dólares ($) para cada aparato y en total.
5. Brinda 3 consejos generales de eficiencia doméstica adaptados a los aparatos presentes.`;

    const schemaConfig = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: 'Resumen ejecutivo claro y empático en español para la familia.',
          },
          monthlyTotalKwh: {
            type: Type.NUMBER,
            description: 'Consumo total mensual en kWh.',
          },
          monthlyTotalCost: {
            type: Type.NUMBER,
            description: 'Costo total mensual en dólares.',
          },
          vampireAppliances: {
            type: Type.ARRAY,
            description: 'Los 3 aparatos de mayor impacto identificados ordenados del 1 al 3.',
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.INTEGER },
                name: { type: Type.STRING },
                monthlyKwh: { type: Type.NUMBER },
                monthlyCost: { type: Type.NUMBER },
                percentageOfTotal: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                concreteProposal: { type: Type.STRING },
                estimatedKwhSavings: { type: Type.NUMBER },
                estimatedDollarSavings: { type: Type.NUMBER },
              },
              required: [
                'rank',
                'name',
                'monthlyKwh',
                'monthlyCost',
                'percentageOfTotal',
                'reason',
                'concreteProposal',
                'estimatedKwhSavings',
                'estimatedDollarSavings',
              ],
            },
          },
          overallTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3 consejos prácticos y accionables.',
          },
          potentialMonthlySavingsKwh: {
            type: Type.NUMBER,
            description: 'Ahorro total potencial mensual en kWh.',
          },
          potentialMonthlySavingsDollars: {
            type: Type.NUMBER,
            description: 'Ahorro total potencial mensual en dólares.',
          },
        },
        required: [
          'summary',
          'monthlyTotalKwh',
          'monthlyTotalCost',
          'vampireAppliances',
          'overallTips',
          'potentialMonthlySavingsKwh',
          'potentialMonthlySavingsDollars',
        ],
      },
    };

    let response: any;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado (>4.5s)')), 4500)
    );

    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: schemaConfig,
      });
      response = await Promise.race([generatePromise, timeoutPromise]);
    } catch (primaryErr: any) {
      if (primaryErr?.message?.includes('Tiempo de espera')) {
        throw primaryErr;
      }
      console.warn('Modelo gemini-3.8-flash ocupado, intentando con gemini-flash-latest...');
      const fallbackModelPromise = ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: schemaConfig,
      });
      response = await Promise.race([fallbackModelPromise, timeoutPromise]);
    }

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini retornó una respuesta vacía');
    }

    const parsedData = JSON.parse(textOutput);
    return res.json({
      success: true,
      source: 'Gemini 3.8 Flash (API Oficial)',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error al procesar con Gemini API:', error);
    // En caso de fallo de red o API, responder con el cálculo de contingencia (Plan B)
    const { appliances, tariff = 0.18, totalKwh = 0, totalCost = 0 } = req.body;
    const fallbackResult = calculateLocalAnalysis(appliances, tariff, totalKwh, totalCost);
    return res.json({
      success: true,
      source: 'Recuperación de contingencia (Fallo de API manejado con éxito)',
      apiError: error.message || 'Error de conexión con servicio de IA',
      data: fallbackResult,
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    exercise: '35 - Recibo Claro',
    hasGeminiKey: Boolean(apiKey),
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Recibo Claro] Servidor activo en http://0.0.0.0:${port}`);
  });
}

startServer();
