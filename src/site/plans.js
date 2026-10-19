export const plans = [
  {
    name: "Básico",
    ift: 2233240,
    down: 30,
    up: 20,
    price: 300,
    desc: "Para navegar, conversar y estar al día.",
    use: "Redes sociales y navegación",
  },
  {
    name: "Esencial",
    ift: 2233241,
    down: 35,
    up: 25,
    price: 350,
    desc: "Una conexión para tus actividades de todos los días.",
    use: "Videollamadas y entretenimiento",
  },
  {
    name: "Plus",
    ift: 2233242,
    down: 50,
    up: 40,
    price: 400,
    desc: "Más espacio para trabajar, estudiar y disfrutar.",
    use: "Trabajo y entretenimiento en casa",
  },
  {
    name: "Premium",
    ift: 2233243,
    down: 80,
    up: 50,
    price: 500,
    desc: "Para hogares con más actividad al mismo tiempo.",
    use: "Varios dispositivos conectados",
  },
  {
    name: "Ultra",
    ift: 2233244,
    down: 100,
    up: 80,
    price: 600,
    desc: "Más velocidad para compartir tu conexión.",
    use: "Streaming y actividades simultáneas",
  },
  {
    name: "Max",
    ift: 2233245,
    down: 150,
    up: 100,
    price: 800,
    desc: "Nuestra mayor velocidad para tu día a día.",
    use: "Hogares con uso intensivo",
  },
];
export const locales = ["El Botadero", "Pueblo Nuevo", "Villa Juárez", "El Carrizo"];
export const documents = [
  [
    "Carta de derechos mínimos de los usuarios",
    "Conoce tus derechos como usuario del servicio.",
    "CartadeDerechosMinimosUsuarios.pdf",
  ],
  [
    "Título de concesión",
    "Consulta el documento de concesión.",
    "TituloDeConcesion.pdf",
  ],
  [
    "Contrato aprobado por Profeco",
    "Registro del contrato de adhesión.",
    "Contrato_Adhesion_aprobado_por_Profeco.pdf",
  ],
  [
    "Contrato del servicio de internet",
    "Revisa las condiciones del servicio.",
    "Contrato_Adhesion_Servicio_de_Internet.pdf",
  ],
  [
    "Características de los paquetes",
    "Especificaciones y alcances de los planes.",
    "Caracteristicas_Especificaciones_y_Alcances_Paquetes_Internet.pdf",
  ],
];

// Datos publicados en redixc.net (19/10/2026).
export const IFT_VISOR_URL = "https://tarifas.ift.org.mx/ift_visor/";
// Ubicación de la oficina proporcionada por Redixc (19/10/2026).
export const MAPS_URL = "https://maps.app.goo.gl/N9wUGfgTxWjugjJT7";
export const ADDRESS =
  "Rafael Mejía Amaral #55, El Botadero, Santiago Ixcuintla, Nayarit, C.P. 63575";

export const formatoUrl = (plan) =>
  `/docs/formatos/FormatoSimplificado_${plan.ift}.pdf`;

// Orientación inicial; los criterios están pendientes de validar con el negocio.
export function recommendPlan(activities, people) {
  if (people === "5+") return plans[4];
  if (people === "3-4" || activities.length > 1) return plans[2];
  return plans[0];
}
