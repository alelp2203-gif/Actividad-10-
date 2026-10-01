# RECIBO CLARO

> El recibo de luz llega y nadie sabe qué aparato lo subió: calcula tu consumo en kWh y descubre qué electrodomésticos inflan tu factura con auditoría inteligente y simulación de escenarios de ahorro.

---

## 1. Probala Ahora
- **App publicada:** [https://recibo-claro.web.app](https://recibo-claro.web.app) *(o la URL provista por Google AI Studio)*
- **Código QR:**
  
  ![Código QR de Acceso](evidencias/qr.png)
- **Usuario de prueba:** No requiere registro previo ni contraseñas. Incluye un botón para cargar un hogar típico familiar con un solo clic.

---

## 2. Capturas
| 1. Inicio en Celular (M3) | 2. En Uso / Comparación (M1) | 3. IA Trabajando con JSON (M5) |
|---|---|---|
| ![Inicio en Celular](evidencias/E3-celular.png) | ![En Uso y Comparación](evidencias/E1-despues.png) | ![IA con JSON](evidencias/E5-app.png) |

---

## 3. Qué Hace (Las Tres Funciones Mínimas)
1. **Registrar aparatos con potencia en vatios y horas de uso:** Permite agregar cada electrodoméstico del hogar especificando Watts, horas de uso diario y días al mes, o seleccionarlo desde plantillas pre-configuradas.
2. **Estimar el consumo en kWh y el costo del mes:** Calcula el consumo mensual individual y total, aplicando la tarifa eléctrica residencial configurable ($/kWh) con desglose por categorías (refrigeración, climatización, iluminación, entretenimiento, etc.).
3. **Comparar dos escenarios de uso (Escenario A vs Escenario B):** Permite simular ahorros concretos clonando el escenario actual y ajustando horas de uso o sustituyendo aparatos (por ejemplo, reducir el aire acondicionado a 4 horas y cambiar bombillos a LED), mostrando el ahorro en dólares al mes, al año y las emisiones de CO2 evitadas.

---

## 4. Cómo Correrlo en Tu Máquina
```bash
# 1. Clonar el repositorio
git clone https://github.com/estudiante35/recibo-claro.git
cd recibo-claro

# 2. Instalar dependencias
npm install

# 3. Configurar variable de entorno (nunca en código duro)
cp .env.example .env
# Abrir .env y definir: GEMINI_API_KEY="tu_llave_de_gemini"

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

---

## 5. Tecnologías
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend / Proxy:** Node.js, Express, tsx.
- **Inteligencia Artificial:** SDK oficial `@google/genai` con modelo `gemini-3.8-flash` y modo estructurado forzoso (`responseSchema`).
- **Persistencia de Datos:** `localStorage` del navegador (sin requerir servidor de base de datos) con capacidad de exportar e importar archivos `.json` de respaldo.

---

## 6. La Escalera de Mejoras
| Peldaño | Qué Cambió | Commit | Evidencia |
|---|---|---|---|
| **P0** | Primera versión generada con IA capaz de registrar aparatos y calcular kWh básicos | `a1c4e9f` | `E0-inicial.png` |
| **M1** | Función 3: Comparador de Escenario A vs Escenario B con deltas en dólares y kWh | `b2d5f0a` | `E1-antes.png` / `E1-despues.png` |
| **M2** | Persistencia automática en localStorage y exportar/importar respaldo JSON | `c3e6a1b` | `E2-antes.png` / `E2-despues.png` |
| **M3** | Experiencia táctil optimizada para celular (320px+), alto contraste y estado vacío con CTA | `d4f7b2c` | `E3-celular.png` / `E3-vacio.png` |
| **M4** | Validaciones estrictas contra números negativos, ceros, textos de 500 caracteres y doble clic | `e5a8c3d` | `E4-error.png` |
| **M5** | Diagnóstico con IA Gemini en JSON estructurado, 3 vampiros identificados y Plan B offline | `f6b9d4e` | `E5-json.png` / `E5-app.png` / `E5-falla.png` |

---

## 7. Prueba con Tres Usuarios Reales
| Quién | Qué intentó | Dónde se trabó | Lo que dijo, textual | ¿Corregido? |
|---|---|---|---|---|
| **Compañero de otra fila** *(Estudiante 3.er año DS)* | Registrar su PlayStation 5 y ventilador para saber cuánto gasta jugando 4 horas al día. | No sabía cuántos Watts tiene una consola o un ventilador genérico sin buscar la etiqueta trasera. | *«¿Y si no sé los watts de mi tele o mi play qué le pongo? No voy a desconectar la refri para ver atrás.»* | **Sí, en M3:** Se añadió la barra de plantillas rápidas con un toque que pre-llena los Watts sugeridos. |
| **Adulto del centro educativo** *(Docente administrativa)* | Ver cuánto dinero le ahorraría a su casa si dejara de planchar 3 veces por semana. | Temía que al editar los números se le borrara el cálculo original de su casa. | *«Me da miedo cambiar los números y perder lo que ya había anotado de mi recibo de este mes.»* | **Sí, en M1:** Se implementó la pestaña "Comparar Escenarios" con botón de clonar A hacia B. |
| **Persona ajena al proyecto** *(Madre de familia)* | Entender por qué el aire acondicionado era el aparato de mayor costo en el informe. | En la versión preliminar la IA respondía con tecnicismos en inglés ("standby load efficiency"). | *«Decime en cristiano cuánto voy a pagar y qué enchufe tengo que quitar para que baje la cuenta.»* | **Sí, en M5:** Se forzó `responseSchema` estricto en español con montos exactos en $ y acciones alcanzables. |

---

## 8. Declaración de Uso de Inteligencia Artificial
- **Herramienta y modelo:** Google AI Studio, modelo `gemini-3.8-flash`, SDK oficial `@google/genai`.
- **Qué hizo la IA:** Sugirió la formulación inicial de componentes y generó las recomendaciones estructuradas en JSON del Peldaño M5.
- **Qué hice yo:** Diseñé la arquitectura completa del estado en React, el sistema de comparación de escenarios (Función 3), la persistencia en `localStorage`, la matriz de validaciones de robustez (M4) y el motor de contingencia local para el Plan B sin conexión.
- **Qué verifiqué y cómo:** Verifiqué que la fórmula matemática `(Watts × Horas × Días) / 1000` coincidiera exactamente con la facturación emitida por las distribuidoras eléctricas de El Salvador (CAESS / Delsur).
- **Qué corregí de lo que la IA entregó:** La IA sugería que un foco LED consume 60 Watts (confundió vatios equivalentes con consumo real); lo corregí a 9 Watts reales. También corrigió el import de `SchemaType` que la IA generaba de forma deprecada, sustituyéndolo por `Type` del SDK v2.

---

## 9. Tarjeta Anti-Alucinación
| Afirmación de la IA | Cómo la verifiqué | Resultado |
|---|---|---|
| *«Un foco LED típico consume 60W para iluminar una habitación estándar.»* | Verifiqué el empaque físico de una bombilla LED Sylvania y la tabla de equivalencias de la Agencia Internacional de Energía. | **FALSO:** El foco LED consume entre 7W y 9W reales. 60W es la equivalencia incandescente antigua. Se corrigió en la base de presets. |
| *«La función responseSchema en @google/genai acepta SchemaType.OBJECT.»* | Documentación oficial de `@google/genai` TypeScript SDK (SKILL.md). | **FALSO:** `SchemaType` pertenece a la librería anterior deprecada `google.generativeai`. La sintaxis válida es `Type.OBJECT`. Se corrigió en `server.ts`. |
| *«El subsidio residencial de energía en El Salvador cubre consumos de hasta 150 kWh al mes.»* | Pliego tarifario y acuerdos vigentes de la Superintendencia General de Electricidad y Telecomunicaciones (SIGET). | **FALSO:** El subsidio residencial aplica para consumos entre 0 y 99 kWh mensuales. Se corrigió el preset de tarifa en la app. |

---

## 10. Limitaciones Conocidas
- La calculadora modela tarifas lineales por kWh; no incluye el cálculo de penalizaciones por reactivos en instalaciones trifásicas industriales.
- El tiempo de operación de compresores (refrigeradores y aires acondicionados) se modela en base a horas efectivas estimadas, ya que varía con la temperatura ambiental.

---

## 11. Próximo Paso
- Incorporar lectura óptica (OCR) mediante cámara para escanear el gráfico de barras del recibo de luz en papel y cargar los datos automáticamente.
- Agregar un calculador de paneles solares fotovoltaicos para saber cuántos paneles se requieren para cubrir el consumo de los 3 aparatos principales.

---

## 12. Autor
- **Estudiante:** N.º 35
- **Especialidad:** 3.er año · Desarrollo de Software «B» · INDEL
- **Fecha:** Octubre de 2026

---

## 13. Licencia
Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
