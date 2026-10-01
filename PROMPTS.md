# Bitácora de Prompts · Ejercicio 35: RECIBO CLARO

**Estudiante:** N.º 35  
**Sección:** 3.er año · Desarrollo de Software «B» · INDEL  
**Docente:** Javier Arturo García Mineros  
**Fecha de entrega:** Jueves 1 de octubre de 2026 · 10:15 a.m.  
**Repositorio:** \`recibo-claro\`

---

## P0 · Prompt Cero: Que Exista

**Prompt textual:**
```text
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
```

- **Qué devolvió:** Código base en React y Tailwind CSS con cálculo matemático de kWh mensual, tarjetas básicas y estado en memoria.
- **Qué acepté:** La fórmula `(Watts × Horas × Días) / 1000 = kWh` y la disposición de las tarjetas.
- **Qué corregí a mano:** Faltaban las categorías de aparatos (climatización, refrigeración, lavado) y los campos numéricos permitían caracteres no numéricos.
- **Evidencia:** `evidencias/E0-inicial.png`
- **Commit:** `P0: primera version generada con IA`

---

## M1 · Función: Que Sirva

**Prompt textual:**
```text
La app ya registra aparatos y calcula el consumo del mes. Necesito completar la Función 3: Comparar dos escenarios de uso (Escenario A actual vs Escenario B alternativo con ahorro proyectado).

No reescribas lo que ya funciona. Dame únicamente:
1. El componente ScenarioComparison que permita clonar los datos de A hacia B, ajustar horas de uso y mostrar la diferencia en kWh, dinero mensual ($) y dinero anual ($).
2. Una prueba manual de tres pasos para comprobar que quedó bien.
3. Qué podría romperse en el resto de la app por este cambio.
```

- **Qué devolvió:** El componente interactivo de comparación con cálculo de deltas en kWh, dólares mensuales, proyección a 12 meses y cálculo de reducción de emisiones de CO2 (~0.45 kg CO2 por kWh).
- **Qué acepté:** El diseño lado a lado de barras relativas y botones rápidos de ajuste (+30 min / -30 min).
- **Qué corregí a mano:** La sincronización de la tarifa eléctrica para que al modificar el $/kWh en ajustes globales se recalculen ambos escenarios sin discrepancias.
- **Evidencia:** `evidencias/E1-antes.png` y `evidencias/E1-despues.png`
- **Commit:** `M1: funcion comparacion de dos escenarios`

---

## M2 · Datos: Que Recuerde

**Prompt textual:**
```text
Quiero que los aparatos y escenarios registrados en RECIBO CLARO no se pierdan al cerrar la app o recargar el navegador.

Usá localStorage y explicame:
1. Dónde queda guardada la información exactamente.
2. Qué pasa si el usuario borra el caché o abre la app en otro teléfono.
3. Cómo hago para exportar los datos a un archivo JSON para que el usuario pueda respaldar su información o compartirla.

Dame el código de guardar, leer, exportar y borrar, y un hogar de ejemplo precargado con 4 personas para probar.
```

- **Qué devolvió:** Funciones utilitarias con `localStorage.getItem` y `localStorage.setItem` bajo la clave `recibo_claro_app_state_v1`, función de exportación como archivo `.json` mediante Blob y hogar de muestra con 8 electrodomésticos salvadoreños.
- **Qué acepté:** El guardado reactivo dentro de `useEffect` y la estructura limpia del JSON serializado.
- **Qué corregí a mano:** Agregué un bloque `try/catch` con valores por defecto para que si el `localStorage` tiene datos corruptos de versiones previas, la aplicación no se bloquee.
- **Evidencia:** `evidencias/E2-antes.png` y `evidencias/E2-despues.png`
- **Commit:** `M2: persistencia de datos en localStorage y exportacion JSON`

---

## M3 · Experiencia: Que se Entienda

**Prompt textual:**
```text
Ajustá la interfaz de RECIBO CLARO con estos requisitos para celular real, sin alterar la lógica de cálculo:

1. Se usa bien desde 320 px de ancho, con una sola mano y sin hacer zoom (zonas de toque de al menos 44px).
2. Contraste suficiente para leerse al sol (texto nunca menor a 14px en datos y 16px en inputs para evitar zoom en iOS).
3. Todos los campos con etiqueta visible (nombre, watts, horas, días).
4. Un solo botón principal por pantalla ("Añadir Aparato" o "Analizar con IA"); los demás secundarios.
5. Estado vacío: qué se muestra cuando no hay ningún electrodoméstico registrado todavía, con una frase cálida que invite a agregar el primero o cargar el hogar de muestra.
6. Mensajes de éxito y error en español sin tecnicismos.

Dame los cambios y decime cuál de los seis puntos NO pudiste cumplir y por qué.
```

- **Qué devolvió:** Maquetación móvil con tabs inferiores accesibles al pulgar, tipografía contrastada, inputs con `font-size: 16px` para prevenir zoom indeseado en teléfonos inteligentes, y pantalla de estado inicial amigable.
- **Qué acepté:** La ilustración y el llamado a la acción claro para el estado vacío.
- **Qué corregí a mano:** Incorporé una barra de botones con presets rápidos (Refrigerador, TV, Aire, Ducha, Focos LED) para que un usuario pueda cargar un electrodoméstico con un solo toque sin teclear vatios.
- **Evidencia:** `evidencias/E3-celular.png` y `evidencias/E3-vacio.png`
- **Commit:** `M3: experiencia de uso en celular y estado vacio`

---

## M4 · Robustez: Que no se Rompa

**Prompt textual:**
```text
Actuá como tester de software, no como programador.

Dame diez formas concretas de romper esta app RECIBO CLARO desde la interfaz: campos vacíos, texto donde va número, potencias negativas (-1500W), horas mayores a 24 al día, textos de 500 caracteres en el nombre, doble clic rápido en Guardar o Analizar, y corte de internet.

Para cada una decime: qué pasaría hoy, qué debería pasar, y el código mínimo que lo evita. No cambies el diseño.
```

- **Qué devolvió:** Matriz de 10 vectores de error con código de validación anticipada y límites estrictos (horas de 0.01 a 24, vatios de 1 a 25000W).
- **Qué acepté:** Bloqueo de estado `isSubmitting` en formularios para evitar doble inserción por pulsaciones rápidas y restricción `maxLength={60}`.
- **Qué corregí a mano:** Redacté los mensajes de error en español claro: *"El nombre del aparato es obligatorio"* y *"Un día solo tiene 24 horas"*, eliminando términos en inglés.
- **Evidencia:** `evidencias/E4-error.png`
- **Commit:** `M4: validaciones estrictas y manejo de entradas invalidas`

---

## M5 · Inteligencia: Que Piense (Sello de IA)

**Prompt textual:**
```text
Integrá una llamada a la API de Gemini dentro de RECIBO CLARO para esta tarea concreta:
"La IA identifica los tres aparatos que más pesan en la factura y propone un cambio realista con el ahorro estimado en kWh y dólares, explicando el porqué."

Requisitos:
1. La respuesta debe venir como JSON con un esquema fijo (responseSchema con campos: summary, monthlyTotalKwh, monthlyTotalCost, vampireAppliances array con rank, name, monthlyKwh, monthlyCost, percentageOfTotal, reason, concreteProposal, estimatedKwhSavings, estimatedDollarSavings; overallTips, potentialMonthlySavingsKwh, potentialMonthlySavingsDollars).
2. La app consume ese JSON y lo muestra en pantalla como fichas de datos, no como un bloque de texto libre.
3. La llave de API se lee en el servidor mediante process.env.GEMINI_API_KEY (sin exponerla al navegador).
4. Manejo de fallo: qué se muestra si la IA no responde o no hay internet (motor de contingencia algorítmico local con Plan B).
5. Un botón para simular fallo y demostrar que la app no se cae.
```

- **Qué devolvió:** Endpoint `/api/analyze-receipt` en Express con el SDK `@google/genai` y modelo `gemini-3.8-flash` usando `Type.OBJECT` y `responseSchema`, respaldado por el motor de contingencia local `calculateLocalAnalysis`.
- **Qué acepté:** El selector para alternar entre "Vista Ejecutiva" y "Salida JSON estructurada" para demostración docente.
- **Qué corregí a mano:** Agregué el botón *"Simular Contingencia (Plan B)"* para que el evaluador pueda corroborar en vivo que la app no se pone en blanco sin internet.
- **Evidencia:** `evidencias/E5-json.png`, `evidencias/E5-app.png` y `evidencias/E5-falla.png`
- **Commit:** `M5: inteligencia con salida estructurada JSON y plan de contingencia`

---

## Cierre de Bitácora

- **Prompts que escribí en total:** 6 prompts principales para los peldaños y 3 prompts de ajuste fino de diseño.
- **El prompt que más me sirvió y por qué:** El prompt M4 de tester. Me enseñó a pensar como alguien que no diseñó la app y que va a pulsar botones de formas inesperadas o introducir números imposibles.
- **El error más caro que cometí:** No haber protegido el botón de enviar contra doble clic, lo que provocaba que se llamara a la API de Gemini dos veces seguidas gastando cuota.
- **Lo que haría distinto la próxima vez:** Escribir el esquema de datos en TypeScript y las reglas de validación en papel antes de generar los componentes visuales.
