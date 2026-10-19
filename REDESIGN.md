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

Se aplicó al sitio principal la variante de interacción fluida: menú móvil reversible, resultado del recomendador expandible y diálogo de WhatsApp con arrastre móvil. (Los filtros, la barra de comparación y la entrada del hero de esa variante se sustituyeron después; ver «Diseño final».) Se mantienen movimiento reducido, foco, navegación por teclado y cierre con Escape.

La cabecera conserva los tres iconos horizontales de apariencia, con selección circular y alineación óptica del logo. Las consultas de cobertura usan exclusivamente El Botadero, Pueblo Nuevo, Villa Juárez y El Carrizo, sin campos de escritura ni opción de otra localidad. La disponibilidad se confirma por domicilio; no se valida automáticamente.

Los ajustes visuales están en `src/site/refinements.css` y `src/site/motion.css`; las animaciones se implementan en `fluidMotion.js`, `PlanMotion.jsx` y `MotionPanel.jsx`, sin dependencias nuevas. La narrativa del hero fue retirada. Se conserva el tema del sitio con la clave `redixc-theme`.

No se modificó `demos/redesign`.

## Nosotros y servicio a la comunidad

La página `/nosotros` incluye la experiencia de más de diez años y la continuidad Botanet → Redixc, confirmadas por el propietario. `CommunityStory.jsx` presenta una historia al hacer scroll con siete capítulos: experiencia, internet gratuito para instituciones, tradiciones, plaza, iglesia, fiestas patronales y deporte. El texto se lee normalmente; las fotografías cambian en un panel lateral sticky en escritorio. Móvil y movimiento reducido usan capítulos con imágenes en el flujo.

Se incorporaron cinco fotografías reales de los enlaces públicos facilitados, con fuentes visibles. La procedencia y los límites de cada afirmación se documentan en `src/site/community-sources.md`; el enlace del grupo no estaba disponible. No se inventaron fechas de fundación, cifras de beneficiarios ni instituciones concretas.

## Diseño final (aprobado el 19/10/2026)

Es la versión definitiva del rediseño, lista para publicarse más adelante. Las comparativas locales (`demos/apple-comparison`, `demos/clarity-comparison`) se retiraron; `demos/redesign` sigue como referencia original. Plan y decisiones: `docs/superpowers/plans/2026-10-19-redixc-claridad.md`.

- Datos publicados en redixc.net: número de inscripción IFT por plan, visor de tarifas de la Comisión Reguladora de Telecomunicaciones y dirección de El Botadero.
- Planes: tarjetas primero, recomendador plegable y tabla de los 6 planes. Desde Inicio, el recomendador lleva a la tarjeta sugerida.
- Cobertura: un botón por localidad. Sin desplegables: la localidad se elige con fichas y las personas con un control segmentado.
- Cabecera móvil con WhatsApp rotulado y el tema dentro del menú; texto mínimo de 12 px; footer móvil a 13 px.
- Foto de Planes `hero-planes-eleccion.webp` (generada; no son clientes).
- Movimiento: bases en `motion-purposeful.css` (nada queda oculto, sin elevación en tarjetas estáticas) y transiciones en `expressiveMotion.js` y `motion-expressive.css`: tarjeta → diálogo, recomendador → plan, un momento del hero por sesión, fundido de tema, plegables animados, entradas al scroll y menú en cascada. Con movimiento reducido no hay desplazamientos; sin View Transitions, el diálogo crece desde su botón.

Datos de planes en `src/site/plans.js`. Pruebas: `npm test` (unitarias) y, con `npm run dev` en marcha, `npm run test:e2e` (Playwright con el `playwright-core` ya instalado en otro proyecto local; variable `PLAYWRIGHT_CORE` para cambiarlo).

Pendiente de validar con el negocio: cobertura en la cabecera municipal, fórmula del recomendador, costo de instalación y horarios.

Eslogan oficial confirmado por el usuario el 19/10/2026: «La fibra que te une al mundo.» (redixc.net aún muestra «te conecta al mundo»).
