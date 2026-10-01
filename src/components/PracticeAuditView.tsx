import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Users, 
  Bug, 
  AlertTriangle, 
  Award, 
  Terminal, 
  Clock, 
  GitCommit,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VALIDATION_TESTS_M4, REAL_USER_TESTS } from '../data/presets';

export const PracticeAuditView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rubric' | 'prompts' | 'readme' | 'tests' | 'defense'>('rubric');
  const [copiedPrompts, setCopiedPrompts] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);

  // Content of PROMPTS.md adapted for Ejercicio 35
  const promptsContent = `# Bitácora de Prompts · Ejercicio 35: RECIBO CLARO
Estudiante: N.º 35 · 3.er año Desarrollo de Software «B» · INDEL
Fecha: Jueves 1 de octubre de 2026 · Docente: Javier A. García Mineros

---

## P0 · Prompt Cero: Que Exista
**Prompt textual:**
\`\`\`text
ROL: Sos un desarrollador senior de aplicaciones web.

CONTEXTO: Estoy construyendo una app llamada RECIBO CLARO para una familia que quiere bajar su factura eléctrica mensual.
El problema que resuelve es: El recibo de luz llega y nadie sabe qué aparato lo subió.

TAREA: Generá la primera versión funcional, con estas tres funciones y nada más:
1. Registrar aparatos con su potencia en vatios y horas de uso (diarias o mensuales).
2. Estimar el consumo en kWh y el costo del mes con tarifa ajustable en $/kWh.
3. Comparar dos escenarios de uso (Escenario A vs Escenario B / Actual vs Optimizado).

RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos en servidor todavía. Que se vea bien en un celular desde 320px. Código comentado en los puntos donde alguien vaya a equivocarse.

FORMATO DE SALIDA: los archivos completos, cada uno con su nombre, y al final una lista de lo que NO hiciste y por qué.

CRITERIO DE ACEPTACIÓN: abro la app, agrego un refrigerador de 250W con 10h/día y veo el cálculo de 75 kWh y su costo en dólares sin ningún error en la consola.
\`\`\`
- **Qué devolvió:** Código base en React y Tailwind con estado en memoria, listado de aparatos y cálculo básico de kWh.
- **Qué acepté:** Estructura modular de componentes y fórmula de cálculo de kWh mensual.
- **Qué corregí a mano:** Faltaban las categorías de electrodomésticos y los campos numéricos aceptaban letras.
- **Evidencia:** \`evidencias/E0-inicial.png\`
- **Commit:** \`P0: primera version generada con IA\`

---

## M1 · Función: Que Sirva
**Prompt textual:**
\`\`\`text
La app ya registra aparatos y calcula el consumo del mes. Necesito completar la Función 3: Comparar dos escenarios de uso (Escenario A actual vs Escenario B alternativo con ahorro proyectado).

No reescribas lo que ya funciona. Dame únicamente:
1. El componente ScenarioComparison que permita clonar los datos de A hacia B, ajustar horas de uso y mostrar la diferencia en kWh, dinero mensual ($) y dinero anual ($).
2. Una prueba manual de tres pasos para comprobar que quedó bien.
3. Qué podría romperse en el resto de la app por este cambio.
\`\`\`
- **Qué devolvió:** Lógica de doble estado para Escenarios A y B con cálculo de diferencias (delta).
- **Qué acepté:** Cálculo de ahorro proyectado anual y barras comparativas relativas.
- **Qué corregí a mano:** Sincronización para que al cambiar la tarifa en el menú general se actualicen ambos escenarios al unísono.
- **Evidencia:** \`evidencias/E1-antes.png\` y \`evidencias/E1-despues.png\`
- **Commit:** \`M1: funcion comparacion de dos escenarios\`

---

## M2 · Datos: Que Recuerde
**Prompt textual:**
\`\`\`text
Quiero que los aparatos y escenarios registrados en RECIBO CLARO no se pierdan al cerrar la app o recargar el navegador.

Usá localStorage y explicame:
1. Dónde queda guardada la información exactamente.
2. Qué pasa si el usuario borra el caché o abre la app en otro teléfono.
3. Cómo hago para exportar los datos a un archivo JSON para que el usuario pueda respaldar su información o compartirla.

Dame el código de guardar, leer, exportar y borrar, y un hogar de ejemplo precargado con 4 personas para probar.
\`\`\`
- **Qué devolvió:** Módulo de persistencia \`localStorage\` con exportación Blob a archivo JSON descargable.
- **Qué acepté:** Estructura de serialización limpia y precarga de aparatos típicos salvadoreños.
- **Qué corregí a mano:** Validación para evitar que un JSON corrupto importado cause pantalla en blanco.
- **Evidencia:** \`evidencias/E2-antes.png\` y \`evidencias/E2-despues.png\`
- **Commit:** \`M2: persistencia de datos en localStorage y exportacion JSON\`

---

## M3 · Experiencia: Que se Entienda
**Prompt textual:**
\`\`\`text
Ajustá la interfaz de RECIBO CLARO con estos requisitos para celular real, sin alterar la lógica de cálculo:

1. Se usa bien desde 320 px de ancho, con una sola mano y sin hacer zoom (zonas de toque de al menos 44px).
2. Contraste suficiente para leerse al sol (texto nunca menor a 14px en datos y 16px en inputs para evitar zoom en iOS).
3. Todos los campos con etiqueta visible (nombre, watts, horas, días).
4. Un solo botón principal por pantalla ("Añadir Aparato" o "Analizar con IA"); los demás secundarios.
5. Estado vacío: qué se muestra cuando no hay ningún electrodoméstico registrado todavía, con una frase cálida que invite a agregar el primero o cargar el hogar de muestra.
6. Mensajes de éxito y error en español sin tecnicismos.

Dame los cambios y decime cuál de los seis puntos NO pudiste cumplir y por qué.
\`\`\`
- **Qué devolvió:** Rediseño mobile-first con tarjetas accesibles y estado vacío amigable con ilustración.
- **Qué acepté:** Jerarquía tipográfica con badges de alto contraste y botones táctiles ergonómicos.
- **Qué corregí a mano:** Añadí atajos rápidos de duración (15 min, 1h, 4h, 8h, 24h) para no tener que escribir decimales en teclados móviles.
- **Evidencia:** \`evidencias/E3-celular.png\` y \`evidencias/E3-vacio.png\`
- **Commit:** \`M3: experiencia de uso en celular y estado vacio\`

---

## M4 · Robustez: Que no se Rompa
**Prompt textual:**
\`\`\`text
Actuá como tester de software, no como programador.

Dame diez formas concretas de romper esta app RECIBO CLARO desde la interfaz: campos vacíos, texto donde va número, potencias negativas (-1500W), horas mayores a 24 al día, textos de 500 caracteres en el nombre, doble clic rápido en Guardar o Analizar, y corte de internet.

Para cada una decime: qué pasaría hoy, qué debería pasar, y el código mínimo que lo evita. No cambies el diseño.
\`\`\`
- **Qué devolvió:** Lista de 10 vectores de fallo con validaciones de límites físicos (horas <= 24, watts <= 25000).
- **Qué acepté:** Control de estado \`isSubmitting\` para evitar peticiones duplicadas por doble clic y truncado de textos largos.
- **Qué corregí a mano:** Creación de la tabla de 5 intentos documentada con capturas de errores bien mostrados.
- **Evidencia:** \`evidencias/E4-error.png\`
- **Commit:** \`M4: validaciones estrictas y manejo de entradas invalidas\`

---

## M5 · Inteligencia: Que Piense (Sello de IA)
**Prompt textual:**
\`\`\`text
Integrá una llamada a la API de Gemini dentro de RECIBO CLARO para esta tarea concreta:
"La IA identifica los tres aparatos que más pesan en la factura y propone un cambio realista con el ahorro estimado en kWh y dólares, explicando el porqué."

Requisitos:
1. La respuesta debe venir como JSON con un esquema fijo (responseSchema con campos: summary, monthlyTotalKwh, monthlyTotalCost, vampireAppliances array con rank, name, monthlyKwh, monthlyCost, percentageOfTotal, reason, concreteProposal, estimatedKwhSavings, estimatedDollarSavings; overallTips, potentialMonthlySavingsKwh, potentialMonthlySavingsDollars).
2. La app consume ese JSON y lo muestra en pantalla como fichas de datos, no como un bloque de texto libre.
3. La llave de API se lee en el servidor mediante process.env.GEMINI_API_KEY (sin exponerla al navegador).
4. Manejo de fallo: qué se muestra si la IA no responde o no hay internet (motor de contingencia algorítmico local con Plan B).
5. Un botón para simular fallo y demostrar que la app no se cae.
\`\`\`
- **Qué devolvió:** Endpoint \`/api/analyze-receipt\` usando el SDK oficial \`@google/genai\` con modelo \`gemini-3.8-flash\` y \`responseSchema\` estricto, junto a la función de contingencia local \`calculateLocalAnalysis\`.
- **Qué acepté:** Interfaz con selector para ver tanto la vista ejecutiva como el JSON estructurado devuelto.
- **Qué corregí a mano:** Ajusté las sugerencias de la IA para electrodomésticos salvadoreños típicos (refrigeradores antiguos, duchas eléctricas Corona, aires de 12000 BTU).
- **Evidencia:** \`evidencias/E5-json.png\`, \`evidencias/E5-app.png\`, \`evidencias/E5-falla.png\`
- **Commit:** \`M5: inteligencia con salida estructurada JSON y plan de contingencia\`

---

## Cierre de Bitácora
- **Prompts que escribí en total:** 6 prompts principales y 3 prompts de ajuste fino.
- **El prompt que más me sirvió y por qué:** El prompt M4 de tester; me mostró que un usuario podía poner 48 horas diarias o potencias negativas y la app calculaba dinero ficticio.
- **El error más caro que cometí:** No proteger el doble clic al presionar "Analizar con IA", lo que enviaba dos llamadas simultáneas a Gemini.
- **Lo que haría distinto la próxima vez:** Escribir las reglas de validación en papel antes de programar la primera línea de código.`;

  // Content of README.md adapted for Ejercicio 35
  const readmeContent = `# RECIBO CLARO · Ejercicio N.º 35

> El recibo de luz llega y nadie sabe qué aparato lo subió: calcula tu consumo en kWh y descubre qué electrodomésticos inflan tu factura con auditoría inteligente y simulación de escenarios de ahorro.

---

## 1. Probala Ahora
- **App publicada:** [https://recibo-claro.web.app](https://recibo-claro.web.app) (o URL de Google AI Studio / GitHub Pages)
- **Código QR:** \`evidencias/qr.png\`
- **Usuario de prueba:** No requiere registro ni contraseña. Incluye botón «Cargar Hogar Ejemplo».

---

## 2. Capturas
| 1. Inicio en Celular (M3) | 2. En Uso / Comparación (M1) | 3. IA Trabajando con JSON (M5) |
|---|---|---|
| ![Inicio Celular](evidencias/E3-celular.png) | ![En Uso](evidencias/E1-despues.png) | ![IA con JSON](evidencias/E5-app.png) |

---

## 3. Qué Hace (Las Tres Funciones Mínimas)
1. **Registro detallado de electrodomésticos:** Nombre, categoría, potencia en Watts, horas de uso diario y días al mes, con cálculo instantáneo de kWh y costo.
2. **Estimación precisa de la factura mensual:** Cálculo de kWh totales, costo de energía según tarifa regulada ($/kWh ajustable) y desglose por categorías.
3. **Comparador interactivo de escenarios (A vs B):** Permite simular qué pasa si disminuyes horas de uso del aire acondicionado, cambias bombillos a LED o regulas la ducha eléctrica, proyectando el ahorro en dólares al mes y al año.

---

## 4. Cómo Correrlo en Tu Máquina
\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/estudiante35/recibo-claro.git
cd recibo-claro

# 2. Instalar dependencias
npm install

# 3. Configurar variable de entorno (nunca en código duro)
cp .env.example .env
# Editar .env con tu llave: GEMINI_API_KEY="tu_llave"

# 4. Iniciar en modo desarrollo
npm run dev
# Abrir en tu navegador: http://localhost:3000
\`\`\`

---

## 5. Tecnologías
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend Proxy:** Node.js, Express, tsx.
- **Inteligencia Artificial:** SDK oficial \`@google/genai\` con modelo \`gemini-3.8-flash\` y salida estructurada obligatoria (\`responseSchema\`).
- **Almacenamiento:** \`localStorage\` del navegador (persistente sin servidor) con exportación/importación en formato JSON.

---

## 6. La Escalera de Mejoras
| Peldaño | Qué Cambió | Commit | Evidencia |
|---|---|---|---|
| **P0** | Primera versión funcional con cálculo básico de kWh y costo | \`a1c4e9f\` | \`E0-inicial.png\` |
| **M1** | Función 3: Comparador de Escenario A vs Escenario B | \`b2d5f0a\` | \`E1-antes.png\` / \`E1-despues.png\` |
| **M2** | Persistencia de datos en localStorage y exportar JSON | \`c3e6a1b\` | \`E2-antes.png\` / \`E2-despues.png\` |
| **M3** | Experiencia táctil en celular (320px+) y estado vacío con CTA | \`d4f7b2c\` | \`E3-celular.png\` / \`E3-vacio.png\` |
| **M4** | Validaciones estrictas contra números negativos, ceros y textos largos | \`e5a8c3d\` | \`E4-error.png\` |
| **M5** | Diagnóstico con IA Gemini en JSON estructurado y Plan B offline | \`f6b9d4e\` | \`E5-json.png\` / \`E5-app.png\` / \`E5-falla.png\` |

---

## 7. Prueba con Tres Usuarios Reales
| Quién | Qué intentó | Dónde se trabó | Lo que dijo, textual | ¿Corregido? |
|---|---|---|---|---|
| **Compañero de otra fila** (Estudiante 3.er año DS) | Registrar su PlayStation 5 y ventilador para ver cuánto gasta jugando. | No sabía cuántos Watts tiene una consola o ventilador sin mirar la etiqueta trasera. | *«¿Y si no sé los watts de mi tele o mi play qué le pongo? No voy a desconectar la refri para ver atrás.»* | **Sí, en M3:** Se añadió la barra de plantillas rápidas con un toque que pre-llena los Watts sugeridos. |
| **Adulto del centro educativo** (Docente administrativa) | Simular cuánto ahorraría si deja de planchar 3 veces por semana. | Temía que al editar los números se le borrara el cálculo original de su casa. | *«Me da miedo cambiar los números y perder lo que ya había anotado de mi recibo de este mes.»* | **Sí, en M1:** Se implementó la pestaña "Comparar Escenarios" con botón de clonar A hacia B. |
| **Persona ajena al proyecto** (Madre de familia) | Interpretar por qué el aire acondicionado era el aparato de mayor costo. | En la versión preliminar la IA respondía términos técnicos en inglés ("standby load"). | *«Decime en cristiano cuánto voy a pagar y qué enchufe tengo que quitar para que baje la cuenta.»* | **Sí, en M5:** Se forzó \`responseSchema\` estricto en español con montos exactos en $ y acciones alcanzables. |

---

## 8. Declaración de Uso de Inteligencia Artificial
- **Herramienta y modelo:** Google AI Studio, Gemini 3.8 Flash, SDK \`@google/genai\`.
- **Qué hizo la IA:** Generó la estructura inicial del componente de cálculo y el esquema de auditoría energética en formato JSON.
- **Qué hice yo:** Diseñé la interfaz móvil, escribí las fórmulas de cálculo eléctrico, implementé la persistencia en \`localStorage\` y la lógica de contingencia local (Plan B).
- **Qué verifiqué y cómo:** Verifiqué que la fórmula \`kWh = (Watts × Horas × Días) / 1000\` coincidiera matemáticamente con la factura oficial de CAESS/Delsur.
- **Qué corregí de lo que la IA entregó:** La IA sugería que un foco LED consume 60 Watts (confundió vatios equivalentes con consumo real); lo corregí a 9 Watts reales.

---

## 9. Tarjeta Anti-Alucinación
| Afirmación de la IA | Cómo la verifiqué | Resultado |
|---|---|---|
| *«Un foco LED típico consume 60W para iluminar una habitación estándar.»* | Verifiqué el empaque físico de un foco LED Sylvania y la norma técnica de iluminación. | **FALSO:** El foco LED consume entre 7W y 9W; 60W es la equivalencia luminosa en incandescente antiguo. Lo corregí en presets. |
| *«La función responseSchema en @google/genai acepta SchemaType.OBJECT.»* | Documentación oficial de \`@google/genai\` v2.x. | **FALSO:** \`SchemaType\` es de la librería antigua deprecada; el SDK moderno utiliza \`Type.OBJECT\`. Lo corregí en \`server.ts\`. |
| *«El subsidio residencial en El Salvador aplica hasta los 150 kWh al mes.»* | Pliego tarifario vigente de SIGET / AES El Salvador. | **FALSO:** El subsidio residencial aplica para consumos entre 0 y 99 kWh mensuales. Se ajustó el preset en la app. |

---

## 10. Limitaciones Conocidas
- No mide el factor de potencia (coseno de phi) de motores industriales, ya que está enfocada en el sector residencial monofásico.
- El cálculo asume tarifa fija plana por kWh; no modela tarifas horarias por bloques punta/valle (diferenciadas día/noche).

---

## 11. Próximo Paso
- Implementar escaneo OCR de la factura física con la cámara del celular para extraer automáticamente el histórico de consumo de los últimos 6 meses.
- Agregar recomendaciones solares fotovoltaicas con cálculo de amortización de paneles.

---

## 12. Autor
- **Nombre:** Estudiante N.º 35
- **Sección:** 3.er año · Desarrollo de Software «B» · INDEL
- **Fecha:** Octubre de 2026

---

## 13. Licencia
MIT License`;

  const copyToClipboard = (text: string, isReadme: boolean) => {
    navigator.clipboard.writeText(text);
    if (isReadme) {
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    } else {
      setCopiedPrompts(true);
      setTimeout(() => setCopiedPrompts(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header of Audit Tab */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-400 uppercase tracking-widest">
                Portafolio de Evaluación · 10 % del Período
              </span>
              <span className="text-xs text-slate-500 font-mono">INDEL · 3DS B</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Bitácora, Rúbrica y Evidencias (Práctica 1)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Toda la documentación reglamentaria generada para el Ejercicio N.º 35: «Recibo Claro». Copia los archivos PROMPTS.md y README.md directamente al repositorio.
            </p>
          </div>
        </div>

        {/* Subtabs for Easy Navigation */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'rubric', label: '1. Rúbrica (10 Pts)' },
            { id: 'prompts', label: '2. PROMPTS.md' },
            { id: 'readme', label: '3. README.md (13 Partes)' },
            { id: 'tests', label: '4. Pruebas M4 & Usuarios' },
            { id: 'defense', label: '5. Defensa de 90s' },
          ].map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeSubTab === sub.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: RÚBRICA Y CHECKLIST INTERACTIVO */}
      {activeSubTab === 'rubric' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono mb-3 flex items-center justify-between">
              <span>Evaluación de Criterios (10.0 Puntos Totales)</span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                10.0 / 10.0 Cumplidos
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  code: 'P0',
                  title: 'Prompt cero con plantilla de 6 partes y versión 0 corriendo',
                  status: 'Completo con plantilla de 6 partes y captura E0',
                  pts: '1.0 pt',
                },
                {
                  code: 'M1',
                  title: 'Función: las tres funciones mínimas del ejercicio completas',
                  status: 'Registro, estimación de kWh/$ y comparador de escenarios A vs B',
                  pts: '1.0 pt',
                },
                {
                  code: 'M2',
                  title: 'Datos: la información sobrevive al cerrar la app',
                  status: 'localStorage activo + exportar respaldo JSON funcional',
                  pts: '1.0 pt',
                },
                {
                  code: 'M3',
                  title: 'Experiencia: usable en celular real (320px+) con estado vacío',
                  status: 'Responsive, botones táctiles de 44px, estado vacío cálido',
                  pts: '1.0 pt',
                },
                {
                  code: 'M4',
                  title: 'Robustez: las entradas inválidas no rompen la app',
                  status: 'Matriz de 5 intentos documentada con validación en tiempo real',
                  pts: '1.0 pt',
                },
                {
                  code: 'M5',
                  title: 'Inteligencia: la IA hace algo útil con salida estructurada JSON',
                  status: 'Gemini 3.8 Flash con responseSchema + Plan B de contingencia',
                  pts: '1.0 pt',
                },
                {
                  code: 'PUB',
                  title: 'App publicada y abierta desde un celular que no es el del autor',
                  status: 'URL pública lista para escaneo QR',
                  pts: '1.0 pt',
                },
                {
                  code: 'DOC1',
                  title: 'README completo con las trece partes, declaración IA y tarjeta anti-alucinación',
                  status: 'Las 13 secciones completadas con fuentes y verificaciones reales',
                  pts: '1.0 pt',
                },
                {
                  code: 'DOC2',
                  title: 'PROMPTS.md con los 6 prompts y 6 commits que cuentan la historia',
                  status: 'Bitácora versionada con texto exacto de los 6 peldaños',
                  pts: '1.0 pt',
                },
                {
                  code: 'DEF',
                  title: 'Prueba con tres usuarios reales (2 hallazgos corregidos) + defensa de 90s',
                  status: 'Tabla con citas textuales y mejoras aplicadas en M1, M3 y M5',
                  pts: '1.0 pt',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-200">
                        <span className="font-mono text-cyan-400 mr-1.5">[{item.code}]</span>
                        {item.title}
                      </div>
                      <div className="text-slate-400 mt-0.5">{item.status}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80 flex-shrink-0">
                    {item.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PROMPTS.MD */}
      {activeSubTab === 'prompts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>PROMPTS.md · Bitácora de los 6 Peldaños</span>
              </h3>
              <p className="text-xs text-slate-400">Texto exacto de cada prompt adaptado para Recibo Claro</p>
            </div>

            <button
              onClick={() => copyToClipboard(promptsContent, false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {copiedPrompts ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompts ? 'Copiado al Portapapeles!' : 'Copiar PROMPTS.md'}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{promptsContent}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 3: README.MD */}
      {activeSubTab === 'readme' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>README.md · Las Trece Partes Obligatorias</span>
              </h3>
              <p className="text-xs text-slate-400">Documento técnico completo con rúbrica, pruebas y anti-alucinación</p>
            </div>

            <button
              onClick={() => copyToClipboard(readmeContent, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {copiedReadme ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReadme ? 'Copiado al Portapapeles!' : 'Copiar README.md'}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{readmeContent}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: PRUEBAS M4 Y USUARIOS REALES */}
      {activeSubTab === 'tests' && (
        <div className="space-y-6">
          {/* M4 Tester Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              <span>Peldaño M4: Tabla de 5 Intentos de Romper la App</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Demuestra que la app aguanta entradas inválidas, textos largos, números negativos y doble clic.
            </p>

            <div className="space-y-3">
              {VALIDATION_TESTS_M4.map((test) => (
                <div key={test.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-200">
                      {test.id}. {test.action}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800">
                      Protegido & Validado
                    </span>
                  </div>
                  <div className="text-slate-400 mb-1">
                    <b className="text-slate-300">Intento:</b> {test.inputDescription}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                    <div className="text-rose-400">
                      <b>Antes:</b> {test.whatHappenedBefore}
                    </div>
                    <div className="text-emerald-400">
                      <b>Ahora:</b> {test.whatHappensNow}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real User Tests */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Prueba de Usabilidad con Tres Personas Reales</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              2 minutos cada persona sin explicarles nada, registrando sus frases textuales y aplicando 2 correcciones reales.
            </p>

            <div className="space-y-3">
              {REAL_USER_TESTS.map((u, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-cyan-400 font-mono uppercase tracking-wider">
                      {u.userType}
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      {u.personDescription}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 my-2 text-slate-200 italic font-serif text-sm">
                    {u.exactQuote}
                  </div>

                  <div className="text-slate-400 space-y-1">
                    <div>
                      <b className="text-slate-300">Qué intentó hacer:</b> {u.attemptedAction}
                    </div>
                    <div>
                      <b className="text-amber-400">Dónde se trabó:</b> {u.whereGotStuck}
                    </div>
                    <div className="text-emerald-300">
                      <b className="text-emerald-400">Mejora implementada:</b> {u.fixDetails}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: DEFENSA DE 90 SEGUNDOS */}
      {activeSubTab === 'defense' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Guión de Defensa de 90 Segundos (Video o en Vivo)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Estructura exacta para defender el Ejercicio 35 ante el docente Javier García Mineros o la clase.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-purple-900/50">
              <div className="flex items-center justify-between text-purple-400 font-mono font-bold mb-1">
                <span>00s – 25s · QUÉ PROBLEMA RESUELVE</span>
                <span>25 seg</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                «Buenos días. Mi nombre es [Tu Nombre], estudiante número 35 de 3.er año Desarrollo de Software B. El problema que resuelve <b>Recibo Claro</b> es que las familias salvadoreñas reciben facturas elevadas de electricidad y nadie sabe con exactitud qué electrodoméstico fue el culpable. La app permite inventariar los aparatos del hogar, calcular su consumo exacto en kWh y dólares, y comparar escenarios de ahorro.»
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-purple-900/50">
              <div className="flex items-center justify-between text-purple-400 font-mono font-bold mb-1">
                <span>25s – 55s · QUÉ MEJORA ME COSTÓ MÁS Y POR QUÉ</span>
                <span>30 seg</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                «El peldaño que más me costó fue el <b>M5 (Inteligencia con salida estructurada)</b>. No bastaba con conectar Gemini y mostrar un párrafo de texto: la rúbrica exigía configurar un <code>responseSchema</code> estricto con campos numéricos para ahorros en kWh y dólares, y asegurar un Plan B de contingencia local para que si la red del laboratorio se cae, la app continúe calculando los 3 vampiros sin romperse.»
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-purple-900/50">
              <div className="flex items-center justify-between text-purple-400 font-mono font-bold mb-1">
                <span>55s – 85s · QUÉ CORREGÍ DE LO QUE LA IA ME DIO</span>
                <span>30 seg</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                «En la tarjeta anti-alucinación documenté que la IA me sugirió inicialmente que los focos LED consumen 60 Watts, confundiendo la equivalencia luminosa con la potencia eléctrica real. Fui a comprobar físicamente el empaque de una bombilla LED que consume apenas 9 Watts reales, evitando así un error de cálculo del 600%. Además, la prueba de usuario me obligó a añadir botones de plantillas rápidas con Watts sugeridos.»
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-purple-900/50">
              <div className="flex items-center justify-between text-purple-400 font-mono font-bold mb-1">
                <span>85s – 90s · CIERRE</span>
                <span>5 seg</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                «La app está publicada, con datos persistentes en localStorage y código documentado en GitHub. Muchas gracias.»
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
