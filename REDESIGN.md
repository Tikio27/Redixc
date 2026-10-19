# Nuevo diseño de REDIXC

El sitio principal usa el diseño aprobado de `demos/redesign`, integrado en `src/site` y servido por la aplicación de la raíz. El demo sigue disponible como referencia independiente y no se modificó durante la integración.

## Páginas

- `/`: inicio, recomendador, planes destacados, pasos, transparencia y ayuda.
- `/planes`: catálogo, filtros, comparación y consultas por WhatsApp.
- `/cobertura`: consulta de localidad y referencia.
- `/nosotros`: presentación y valores.
- `/ayuda`: contratación, soporte y preguntas frecuentes.
- `/legal`: documentos del servicio.
- `/about`: redirección compatible a `/nosotros`.

Los enlaces usan React Router. El servidor de producción debe entregar `index.html` para las rutas de la aplicación, conservando el servicio normal de `/assets` y `/docs` (el sitio anterior ya usaba BrowserRouter).

## Desarrollo y validación

```sh
npm run dev
npm run build
npm run preview
```

Los archivos gráficos y la fuente están en `public/assets`; los documentos existentes permanecen en `public/docs`. No se necesitan dependencias adicionales. La entrada TypeScript permite importar los componentes JSX del diseño sin desactivar las comprobaciones de los archivos TypeScript existentes.

Se conservan los temas claro/oscuro/sistema, la navegación sticky, el footer responsive y las animaciones con movimiento reducido. Las consultas preparan el mensaje y abren WhatsApp únicamente por una acción del usuario; no se envían solicitudes automáticamente ni se confirma cobertura sin revisión del domicilio.

La integración se trabaja en `feat/redixc-production-redesign`. No implica publicación ni despliegue.


## Integración de la variante aprobada

Se aplicó al sitio principal la variante Emil revisada en `demos/apple-comparison`: hero estable con entrada breve, transiciones al filtrar planes, barra de comparación, menú móvil reversible, resultado del recomendador expandible y diálogo de WhatsApp con arrastre móvil. Se mantienen movimiento reducido, foco, navegación por teclado y cierre con Escape.

La cabecera conserva los tres iconos horizontales de apariencia, con selección circular y alineación óptica del logo. Las consultas de cobertura usan exclusivamente El Botadero, Pueblo Nuevo, Villa Juárez y El Carrizo, sin campos de escritura ni opción de otra localidad. La disponibilidad se confirma por domicilio; no se valida automáticamente.

Los ajustes visuales están en `src/site/refinements.css` y `src/site/motion.css`; las animaciones se implementan en `fluidMotion.js`, `PlanMotion.jsx` y `MotionPanel.jsx`, sin dependencias nuevas. La narrativa del hero fue retirada. Se conserva el tema del sitio con la clave `redixc-theme`.

El comparador conserva una copia de la versión anterior en `demos/apple-comparison/src/CurrentSnapshot.jsx`, para que la referencia no cambie al integrar la propuesta. No se modificó `demos/redesign`. Esta integración local no implica commit ni publicación.

## Nosotros y servicio a la comunidad

La página `/nosotros` incluye la experiencia de más de diez años y la continuidad Botanet → Redixc, confirmadas por el propietario. `CommunityStory.jsx` presenta una historia al hacer scroll con siete capítulos: experiencia, internet gratuito para instituciones, tradiciones, plaza, iglesia, fiestas patronales y deporte. El texto se lee normalmente; las fotografías cambian en un panel lateral sticky en escritorio. Móvil y movimiento reducido usan capítulos con imágenes en el flujo.

Se incorporaron cinco fotografías reales de los enlaces públicos facilitados, con fuentes visibles. La procedencia y los límites de cada afirmación se documentan en `src/site/community-sources.md`; el enlace del grupo no estaba disponible. No se inventaron fechas de fundación, cifras de beneficiarios ni instituciones concretas.

## Claridad para elegir y contactar (propuesta en revisión)

Rama `feat/redixc-clarity-updates`, sin commits hasta el visto bueno del usuario. Se compara con la versión anterior en `demos/clarity-comparison` (http://127.0.0.1:5176/); la copia congelada está en `demos/clarity-comparison/actual/`. Plan: `docs/superpowers/plans/2026-10-19-redixc-claridad.md`.

Cambios: datos publicados en redixc.net (inscripción IFT por plan, visor de tarifas, dirección), recomendador que lleva al plan, Planes con las tarjetas primero y tabla de 6 planes en lugar del comparador, Cobertura con un botón por localidad, cabecera móvil con WhatsApp rotulado, texto ≥ 12 px, cierre del diálogo en ≤ 350 ms y nueva foto de Planes (`hero-planes-eleccion.webp`, generada; no son clientes). Los datos de planes están en `src/site/plans.js` con pruebas en `src/site/plans.test.mjs`.

Hay dos propuestas de movimiento opcionales: «sobrio» (`motion="purposeful"`, `src/site/motion-purposeful.css`) y «expresivo» (`motion="expressive"`, `src/site/expressiveMotion.js` y `src/site/motion-expressive.css`), con transiciones de la tarjeta al diálogo y del recomendador al plan, momento del hero una vez por sesión, fundido de tema y plegables animados. Producción usa el movimiento expresivo, elegido por el usuario. La localidad de la consulta y las personas del recomendador se eligen con fichas y un control segmentado en lugar de desplegables. Pendiente de validar: cobertura de la cabecera municipal, fórmula del recomendador, costo de instalación y horarios.

Eslogan oficial confirmado por el usuario el 19/10/2026: «La fibra que te une al mundo.» (redixc.net aún muestra «te conecta al mundo»).
