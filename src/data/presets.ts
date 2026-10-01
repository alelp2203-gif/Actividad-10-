import { Appliance, ApplianceCategory, RealUserTestItem, ValidationTestItem } from '../types';

export interface CategoryMeta {
  id: ApplianceCategory;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'climatizacion', name: 'Climatización', iconName: 'Wind', color: 'text-sky-400', bgColor: 'bg-sky-500/10' },
  { id: 'refrigeracion', name: 'Refrigeración', iconName: 'Snowflake', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { id: 'cocina', name: 'Cocina', iconName: 'Utensils', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { id: 'iluminacion', name: 'Iluminación', iconName: 'Lightbulb', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { id: 'entretenimiento', name: 'Entretenimiento', iconName: 'Tv', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { id: 'lavado', name: 'Lavado y Limpieza', iconName: 'Shirt', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { id: 'bano', name: 'Baño y Agua Caliente', iconName: 'ShowerHead', color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  { id: 'computo', name: 'Cómputo y Trabajo', iconName: 'Laptop', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { id: 'otros', name: 'Otros Aparatos', iconName: 'Plug', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
];

export interface AppliancePreset {
  name: string;
  category: ApplianceCategory;
  watts: number;
  typicalHours: number;
  typicalDays: number;
  quantity: number;
  description: string;
}

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  {
    name: 'Refrigerador tradicional (escarcha)',
    category: 'refrigeracion',
    watts: 250,
    typicalHours: 10, // horas reales de compresor encendido
    typicalDays: 30,
    quantity: 1,
    description: 'Compresor opera en ciclos intermitentes aprox. 10 horas al día.',
  },
  {
    name: 'Refrigerador Inverter A+++',
    category: 'refrigeracion',
    watts: 90,
    typicalHours: 9,
    typicalDays: 30,
    quantity: 1,
    description: 'Aparato eficiente de velocidad variable de bajo consumo.',
  },
  {
    name: 'Aire Acondicionado 12,000 BTU',
    category: 'climatizacion',
    watts: 1100,
    typicalHours: 6,
    typicalDays: 30,
    quantity: 1,
    description: 'Consumo intensivo en dormitorios o sala.',
  },
  {
    name: 'Ventilador de pedestal',
    category: 'climatizacion',
    watts: 60,
    typicalHours: 8,
    typicalDays: 30,
    quantity: 2,
    description: 'Ventilador tradicional de 3 velocidades.',
  },
  {
    name: 'Ducha Eléctrica / Corona',
    category: 'bano',
    watts: 3800,
    typicalHours: 0.5, // 30 minutos al día en total familiar
    typicalDays: 30,
    quantity: 1,
    description: 'Resistencia eléctrica de calentamiento instantáneo.',
  },
  {
    name: 'Smart TV LED 55"',
    category: 'entretenimiento',
    watts: 110,
    typicalHours: 5,
    typicalDays: 30,
    quantity: 1,
    description: 'Pantalla principal de la sala.',
  },
  {
    name: 'Focos incandescentes tradicionales (x5)',
    category: 'iluminacion',
    watts: 60,
    typicalHours: 5,
    typicalDays: 30,
    quantity: 5,
    description: 'Bombillos amarillos de alto consumo y emisión térmica.',
  },
  {
    name: 'Focos LED de alta eficiencia (x5)',
    category: 'iluminacion',
    watts: 9,
    typicalHours: 5,
    typicalDays: 30,
    quantity: 5,
    description: 'Luminarias LED que entregan la misma luz con 85% menos energía.',
  },
  {
    name: 'Lavadora semiautomática / automática',
    category: 'lavado',
    watts: 500,
    typicalHours: 1.5,
    typicalDays: 12, // 3 días a la semana
    quantity: 1,
    description: 'Ciclos de lavado y centrifugado familiar.',
  },
  {
    name: 'Plancha eléctrica',
    category: 'lavado',
    watts: 1200,
    typicalHours: 1,
    typicalDays: 8, // 2 veces por semana
    quantity: 1,
    description: 'Elemento térmico de alta demanda puntual.',
  },
  {
    name: 'Horno Microondas',
    category: 'cocina',
    watts: 1200,
    typicalHours: 0.3, // ~18 minutos al día
    typicalDays: 30,
    quantity: 1,
    description: 'Calentamiento rápido de alimentos.',
  },
  {
    name: 'Computadora Portátil / Laptop',
    category: 'computo',
    watts: 65,
    typicalHours: 6,
    typicalDays: 26,
    quantity: 1,
    description: 'Estudios o teletrabajo.',
  },
  {
    name: 'Consola de Videojuegos',
    category: 'entretenimiento',
    watts: 160,
    typicalHours: 3,
    typicalDays: 25,
    quantity: 1,
    description: 'PlayStation / Xbox en sesión activa de juego.',
  },
  {
    name: 'Bomba de agua cisterna 0.5 HP',
    category: 'otros',
    watts: 375,
    typicalHours: 1,
    typicalDays: 30,
    quantity: 1,
    description: 'Llenado de tanque o cisterna diario.',
  },
];

// Hogar típico familiar salvadoreño para demostración instantánea
export const SAMPLE_HOUSEHOLD_APPLIANCES: Appliance[] = [
  {
    id: 'app-sample-1',
    name: 'Refrigerador de 14 pies tradicional',
    category: 'refrigeracion',
    watts: 250,
    hoursPerDay: 10,
    daysPerMonth: 30,
    quantity: 1,
    notes: 'Compresor enciende por lapsos durante el día y la noche',
  },
  {
    id: 'app-sample-2',
    name: 'Aire acondicionado de ventana (sala/cuarto)',
    category: 'climatizacion',
    watts: 1100,
    hoursPerDay: 5,
    daysPerMonth: 28,
    quantity: 1,
    notes: 'Se enciende en las noches calurosas',
  },
  {
    id: 'app-sample-3',
    name: 'Ducha eléctrica para baño matutino',
    category: 'bano',
    watts: 3500,
    hoursPerDay: 0.4,
    daysPerMonth: 30,
    quantity: 1,
    notes: '4 personas bañándose 6 minutos cada una',
  },
  {
    id: 'app-sample-4',
    name: 'Ventiladores de pedestal (cuartos)',
    category: 'climatizacion',
    watts: 65,
    hoursPerDay: 9,
    daysPerMonth: 30,
    quantity: 2,
    notes: 'Encendidos durante la tarde y para dormir',
  },
  {
    id: 'app-sample-5',
    name: 'Smart TV 55" de la sala',
    category: 'entretenimiento',
    watts: 115,
    hoursPerDay: 5,
    daysPerMonth: 30,
    quantity: 1,
    notes: 'Noticias en la mañana y series/novela en la tarde-noche',
  },
  {
    id: 'app-sample-6',
    name: 'Focos incandescentes amarillos antiguos',
    category: 'iluminacion',
    watts: 60,
    hoursPerDay: 5,
    daysPerMonth: 30,
    quantity: 6,
    notes: 'En pasillo, patio, cocina y sala',
  },
  {
    id: 'app-sample-7',
    name: 'Lavadora automática familiar',
    category: 'lavado',
    watts: 480,
    hoursPerDay: 1.5,
    daysPerMonth: 12,
    quantity: 1,
    notes: 'Lavadas los fines de semana y miércoles',
  },
  {
    id: 'app-sample-8',
    name: 'Plancha eléctrica',
    category: 'lavado',
    watts: 1100,
    hoursPerDay: 0.8,
    daysPerMonth: 8,
    quantity: 1,
    notes: 'Planchado de uniformes y ropa de trabajo',
  },
];

// Escenario B sugerido optimizado para comparación (Función 3)
export const SAMPLE_OPTIMIZED_APPLIANCES: Appliance[] = [
  {
    id: 'app-opt-1',
    name: 'Refrigerador de 14 pies tradicional (con empaques limpios)',
    category: 'refrigeracion',
    watts: 250,
    hoursPerDay: 8.5, // menor tiempo de compresor por buen sello
    daysPerMonth: 30,
    quantity: 1,
    notes: 'Mantenimiento de empaque y separación de pared',
  },
  {
    id: 'app-opt-2',
    name: 'Aire acondicionado regulado a 24°C + timer',
    category: 'climatizacion',
    watts: 950, // menor esfuerzo del compresor
    hoursPerDay: 3.5, // 3.5h y luego apagado programado
    daysPerMonth: 24,
    quantity: 1,
    notes: 'Termostato a 24°C y uso de temporizador nocturno',
  },
  {
    id: 'app-opt-3',
    name: 'Ducha eléctrica uso moderado tibio',
    category: 'bano',
    watts: 2500, // nivel tibio en vez de supercaliente
    hoursPerDay: 0.25, // 15 minutos en total
    daysPerMonth: 30,
    quantity: 1,
    notes: 'Baños rápidos de 3-4 minutos en posición tibia',
  },
  {
    id: 'app-opt-4',
    name: 'Ventiladores de pedestal (cuartos)',
    category: 'climatizacion',
    watts: 65,
    hoursPerDay: 8,
    daysPerMonth: 30,
    quantity: 2,
    notes: 'Velocidad media',
  },
  {
    id: 'app-opt-5',
    name: 'Smart TV 55" con modo eco activo',
    category: 'entretenimiento',
    watts: 85,
    hoursPerDay: 4,
    daysPerMonth: 30,
    quantity: 1,
    notes: 'Brillo automático y apagado si no hay señal',
  },
  {
    id: 'app-opt-6',
    name: 'Focos LED de 9W (reemplazo de los 6 incandescentes)',
    category: 'iluminacion',
    watts: 9,
    hoursPerDay: 5,
    daysPerMonth: 30,
    quantity: 6,
    notes: 'Ahorro masivo del 85% en iluminación',
  },
  {
    id: 'app-opt-7',
    name: 'Lavadora automática (cargas llenas)',
    category: 'lavado',
    watts: 480,
    hoursPerDay: 1.2,
    daysPerMonth: 8, // optimizado a solo 2 tandas completas por semana
    quantity: 1,
    notes: 'Solo cargas completas con agua fría',
  },
  {
    id: 'app-opt-8',
    name: 'Plancha eléctrica (en una sola sesión)',
    category: 'lavado',
    watts: 1100,
    hoursPerDay: 1.0,
    daysPerMonth: 4, // 1 vez por semana toda la ropa junta
    quantity: 1,
    notes: 'Aprovecha el calor residual desenchufando al final',
  },
];

// Tabla de 5 intentos de romper la app (Exigencia Peldaño M4 para el README)
export const VALIDATION_TESTS_M4: ValidationTestItem[] = [
  {
    id: 1,
    action: 'Campos vacíos al guardar aparato',
    inputDescription: 'Dejar el nombre en blanco o borrar el valor de potencia y presionar "Guardar".',
    whatHappenedBefore: 'La app registraba un elemento con NaN kWh y costo $NaN, dejando los totales en blanco.',
    whatHappensNow: 'El botón bloquea el envío y muestra borde rojo con mensaje: "Ingresa el nombre del aparato y una potencia válida mayor a 0W".',
    status: 'fixed',
  },
  {
    id: 2,
    action: 'Valores numéricos negativos o ceros absurdos',
    inputDescription: 'Escribir "-1500" en potencia Watts o "-5" en horas diarias.',
    whatHappenedBefore: 'El consumo total restaba dinero del recibo, dando totales irreales negativos.',
    whatHappensNow: 'Validación en tiempo real: los números negativos son bloqueados inmediatamente y normalizados a 1.',
    status: 'fixed',
  },
  {
    id: 3,
    action: 'Horas de uso diarias imposibles (> 24 horas)',
    inputDescription: 'Ingresar "48" horas de uso al día.',
    whatHappenedBefore: 'El sistema calculaba 48 horas diarias sin advertir el error físico temporal.',
    whatHappensNow: 'Restricción estricta de 0.01 a 24.0 horas con tope de seguridad y aviso explicativo.',
    status: 'fixed',
  },
  {
    id: 4,
    action: 'Texto larguísimo de más de 500 caracteres en nombre de aparato',
    inputDescription: 'Pegar un párrafo de 600 caracteres en el campo de nombre del aparato.',
    whatHappenedBefore: 'Desbordaba la tarjeta en pantallas de teléfonos móviles rompiendo el maquetado horizontal.',
    whatHappensNow: 'Atributo maxLength={60} y truncado con elipsis en CSS (text-wrap y overflow-hidden).',
    status: 'fixed',
  },
  {
    id: 5,
    action: 'Doble clic rápido en "Analizar con IA" o "Guardar"',
    inputDescription: 'Hacer doble o triple clic en ráfaga en el botón de análisis o agregado.',
    whatHappenedBefore: 'Lanzaba dos peticiones simultáneas consumiendo cuota innecesaria y duplicando tarjetas.',
    whatHappensNow: 'Estado "isLoading / isSaving" desactiva los botones y muestra un spinner visual hasta completar la acción.',
    status: 'fixed',
  },
];

// Tabla de prueba con 3 usuarios reales (Exigencia Rúbrica Práctica 1)
export const REAL_USER_TESTS: RealUserTestItem[] = [
  {
    userType: 'Compañero de otra fila',
    personDescription: 'Estudiante de 3.er año DS (compañero de laboratorio)',
    attemptedAction: 'Registrar la consola de videojuegos y saber cuánto gasta jugando 4 horas al día.',
    whereGotStuck: 'No sabía cuántos Watts tiene una PlayStation 5 o un ventilador genérico sin buscar la etiqueta.',
    exactQuote: '«¿Y si no sé los watts de mi tele o mi play qué le pongo? No voy a desconectar la refri para ver atrás.»',
    wasFixed: true,
    fixDetails: 'Se agregó la barra de "Aparatos Comunes (Plantillas)" con un solo toque que llena automáticamente los Watts típicos.',
  },
  {
    userType: 'Adulto del centro educativo',
    personDescription: 'Docente / encargada de módulo administrativo',
    attemptedAction: 'Ver cuánto dinero le ahorraría a su casa si dejara de planchar 3 veces por semana.',
    whereGotStuck: 'Intentó comparar en la misma pantalla pero no sabía si tenía que borrar sus aparatos actuales.',
    exactQuote: '«Me da miedo cambiar los números y perder lo que ya había anotado de mi recibo de este mes.»',
    wasFixed: true,
    fixDetails: 'Se implementó la pestaña "Comparar Escenarios" (Función 3) que permite clonar el Escenario A al Escenario B sin alterar el original.',
  },
  {
    userType: 'Persona ajena al proyecto',
    personDescription: 'Madre de familia / persona no técnica del hogar',
    attemptedAction: 'Entender por qué la recomendación le decía que el aire era el que más consumía.',
    whereGotStuck: 'En la versión preliminar el texto de la IA salía en inglés y con términos como "standby load efficiency".',
    exactQuote: '«Decime en cristiano cuánto voy a pagar y qué enchufe tengo que quitar para que baje la cuenta.»',
    wasFixed: true,
    fixDetails: 'Se refinó el prompt M5 forzando salida estructurada en español empático con montos exactos en dólares y lista de 3 vampiros.',
  },
];
