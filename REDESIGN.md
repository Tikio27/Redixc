# Nuevo diseño de REDIXC

El sitio principal usa el diseño aprobado del demo original, integrado en `src/site` y servido por la aplicación de la raíz. El demo se archivó en `archive/demos/redesign` (ver «Limpieza»).

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

No se modificó el demo original (hoy en `archive/demos/redesign`).

## Nosotros y servicio a la comunidad

La página `/nosotros` incluye la experiencia de más de diez años y la continuidad Botanet → Redixc, confirmadas por el propietario. `CommunityStory.jsx` presenta una historia al hacer scroll con siete capítulos: experiencia, internet gratuito para instituciones, tradiciones, plaza, iglesia, fiestas patronales y deporte. El texto se lee normalmente; las fotografías cambian en un panel lateral sticky en escritorio. Móvil y movimiento reducido usan capítulos con imágenes en el flujo.

Se incorporaron cinco fotografías reales de los enlaces públicos facilitados, con fuentes visibles. La procedencia y los límites de cada afirmación se documentan en `src/site/community-sources.md`; el enlace del grupo no estaba disponible. No se inventaron fechas de fundación, cifras de beneficiarios ni instituciones concretas.

## Diseño final (aprobado el 19/10/2026)

Es la versión definitiva del rediseño, lista para publicarse más adelante. Las comparativas locales (`demos/apple-comparison`, `demos/clarity-comparison`) se retiraron; el demo original quedó archivado en `archive/demos/redesign`. Plan y decisiones: `archive/docs/superpowers/plans/2026-10-19-redixc-claridad.md`.

- Datos publicados en redixc.net: número de inscripción IFT por plan, visor de tarifas de la Comisión Reguladora de Telecomunicaciones y dirección de El Botadero.
- Planes: tarjetas primero, recomendador plegable y tabla de los 6 planes. Desde Inicio, el recomendador lleva a la tarjeta sugerida.
- Cobertura: un botón por localidad. Sin desplegables: la localidad se elige con fichas y las personas con un control segmentado.
- Cabecera móvil con WhatsApp rotulado y el tema dentro del menú; texto mínimo de 12 px; footer móvil a 13 px.
- Foto de Planes `hero-planes-eleccion.webp` (generada; no son clientes).
- Cobertura: aviso único, «Así confirmamos tu cobertura» en 3 pasos, «Estamos en El Botadero» (mural de Águilas del Botadero, dirección, «Cómo llegar» con https://maps.app.goo.gl/N9wUGfgTxWjugjJT7, teléfono y WhatsApp), 3 planes y preguntas frecuentes. La consulta admite «Calle, número o referencia (opcional)», que se añade al mensaje de WhatsApp.
- Inicio: tres beneficios alineados — «Mes a mes, sin sorpresas», «Técnicos locales» y «Parte de tu comunidad» con enlace a la historia.
- Movimiento: bases en `motion-purposeful.css` (nada queda oculto, sin elevación en tarjetas estáticas) y transiciones en `expressiveMotion.js` y `motion-expressive.css`: tarjeta → diálogo, recomendador → plan, un momento del hero por sesión, fundido de tema, plegables animados, entradas al scroll y menú en cascada. Con movimiento reducido no hay desplazamientos; sin View Transitions, el diálogo crece desde su botón.

Datos de planes en `src/site/plans.js`. Pruebas: `npm test` (unitarias) y, con `npm run dev` en marcha, `npm run test:e2e` (Playwright con el `playwright-core` ya instalado en otro proyecto local; variable `PLAYWRIGHT_CORE` para cambiarlo).

Pendiente de validar con el negocio: cobertura en la cabecera municipal, fórmula del recomendador, costo de instalación y horarios.

Eslogan oficial confirmado por el usuario el 19/10/2026: «La fibra que te une al mundo.» (redixc.net aún muestra «te conecta al mundo»).

## Fase 1 de la auditoría Taste (19/10/2026, sin publicar)

Ajustes aprobados tras la auditoría con tasteskill v2. Conservan el hero aprobado, la marca, el menú sticky y el diálogo de WhatsApp.

- Hero de Inicio en móvil: la misma foto aprobada (`hero-planes.webp`) va antes del texto, en 16:10 (recorta solo techo y mantel; caras, laptop y taza se conservan) y con menos espacio hasta la etiqueta y el titular. El orden del DOM coincide con el visual; tablet y escritorio no cambian.
- Tarjeta de plan única (`planCard`), alimentada por `plans.js` (una descripción por plan). Cabecera común: nombre y bajada («de bajada») a la izquierda; precio y «MXN / mes» a la derecha, con flex-wrap para apilarse si no cabe (tablet o texto ampliado).
  - Resumida (Inicio y Cobertura): después, subida, descripción y «Consultar plan» (nombre accesible «Consultar plan Plus», etc.) a todo el ancho.
  - Completa (Planes, escritorio): impuestos incluidos, descripción y uso, subida, «Consultar este plan» (alineado entre tarjetas), ficha y folio. La bajada aparece una sola vez.
  - Completa (Planes, móvil): a la vista nombre, bajada, subida, precio con impuestos y botón; «Detalles del plan» (`aria-expanded`/`aria-controls`) despliega descripción, uso, ficha y folio. La descripción existe en ambos sitios del DOM y el CSS muestra uno, para que el orden del DOM coincida con el visual. La tabla se oculta en móvil porque repetía esos datos; en escritorio se mantiene.
  - El plan sugerido por el recomendador lleva la etiqueta «Tu recomendación»; al desplazarse hacia él queda entero bajo la cabecera sticky y el desplazamiento es instantáneo (sin animación).
- Descripción del Plus: «Para estudiar, trabajar y ver contenido en línea.»
- Planes: el recomendador plegado va antes del catálogo.
- Corregidos: precio centrado (Inicio) o a la derecha (Cobertura) en las tarjetas móviles y botón sin margen interior en tablet.
- Inicio: «Lo que contratas, por escrito» sustituye a «Todo claro» (sin foto: repetía a la niña del hero en la misma página; el archivo sigue en `public/assets`). «Atención por teléfono, WhatsApp o en persona» presenta la oficina de El Botadero como punto de atención, con las cuatro localidades. Preguntas frecuentes en su propia sección.
- Titulares y etiquetas: fuera las etiquetas en mayúsculas redundantes y los titulares de dos frases con la segunda en azul en las páginas interiores. Nosotros: sin la numeración 01–07 ni la fila de valores.
- Denominaciones según los documentos: «Folio de inscripción» (formato de información simplificada) y «Contrato de adhesión registrado ante Profeco» (oficio de registro 349-2025); ya no se usa «aprobado».
- Cobertura: texto alternativo del hero corregido para que describa la foto.
- Nosotros: las fotos de la historia se ocultaban a lectores de pantalla en escritorio (panel fijo con `aria-hidden` y figuras con `display: none`); ahora la figura de cada capítulo queda visualmente oculta pero accesible, sin cambio visual.
- Estilos de la fase en un bloque al final de `clarity.css` (carga después de `refinements.css`), más una regla en `community.css` para la accesibilidad de la historia.

Nosotros en escritorio, pendiente de aprobación: con movimiento reducido o con ventanas de 700 px de alto o menos (`@media (prefers-reduced-motion: reduce), (max-height: 700px)`, anterior a esta fase) la historia pasa a una columna de 860 px y deja vacía la mitad derecha. Con movimiento normal y pantallas altas la composición en dos columnas funciona. Propuesta: en ese modo, cada capítulo con el texto a la izquierda y su foto a la derecha, en su proporción. No implementada.

Pendiente para fase 2: la repetición visual entre heroes (misma mesa, laptop y vestuario en Inicio, Planes, Nosotros, Ayuda y Legal) se resolvió solo en parte; requiere fotos reales o nuevas variantes. La foto vertical de las fiestas patronales mantiene su proporción porque el recorte quitaría los cordeles.

Afirmaciones pendientes de confirmar (no se añadieron ni se retiraron):
- «Técnicos locales» / «de tu comunidad»: textos existentes sin respaldo documental en este repositorio.
- Costo de instalación, discrepancia para que el propietario la aclare: el sitio dice que el costo se confirma al revisar el domicilio, pero los seis formatos de información simplificada (`public/docs/formatos`) indican «Cargo por instalación: NO». No se cambió ningún texto.
- Horarios: el contrato de adhesión registrado indica medios de contacto «disponibles las 24 horas del día los 7 días de la semana»; el sitio no publica horarios.
- Cobertura en la cabecera municipal y fórmula del recomendador (sin cambios).
- Se conservan «Servicio mes a mes*» y las referencias al contrato.

Respaldo de lo que el sitio da por confirmado: «sin plazos forzosos» (contrato, cláusula segunda; formatos: plazo mínimo de permanencia N/A); «precios fijos cada mes» (confirmación del usuario en la sesión del 19/10/2026; no hay documento en el repositorio); más de diez años, Botanet → Redixc e internet gratuito para escuelas, clínica y comisariado ejidal (`src/site/community-sources.md`, confirmación del propietario).

## Portal de clientes (19/10/2026, sin publicar)

Rama `feat/portal-clientes`. Los clientes consultan estados de cuenta, facturas y pagos, y levantan tickets en el portal de la plataforma de administración, https://clientes.redixc.net/. El sitio solo lo enlaza: no hay inicio de sesión propio, iframe, backend ni llamadas a WispHub, ni restricción por localidad. Sustituye la propuesta anterior de consulta rápida de saldo, que no llegó al código.

- Acceso en escritorio: «Portal de clientes» al final de la navegación principal, separado por una línea, con icono de usuario y en color de acento.
- Acceso en móvil y tableta (≤ 850 px): el mismo enlace en la cabecera, sin caja, y también en el menú como un elemento más (flecha ↗ de sitio externo, sin el estilo de página activa). El icono se oculta en 380 px o menos.
- Todos los accesos al portal se abren en una pestaña nueva (`target="_blank" rel="noreferrer"`, como los demás enlaces externos del sitio), con «(se abre en una pestaña nueva)» para lectores de pantalla.
- Cambia el patrón anterior «Cabecera móvil con WhatsApp rotulado»: en teléfonos (≤ 600 px) WhatsApp queda solo con su icono, con el nombre accesible «Preparar consulta por WhatsApp»; desde 601 px el botón dice «Escríbenos».
- Ayuda: tarjeta «Portal de clientes» a todo el ancho, con «Ingresar al portal». Para quien no conoce su usuario o contraseña, un campo «Nombre del titular del servicio» prepara un mensaje de WhatsApp para Administración (33 3845 4848, número que no se muestra en el sitio). Como el resto de consultas, WhatsApp se abre solo por acción del usuario.
- El nombre se valida antes de abrir WhatsApp (`validateHolderName` en `plans.js`): espacios normalizados, de 3 a 80 caracteres, solo letras (con acentos y ñ), espacios, punto, apóstrofo y guion. Se rechazan etiquetas, comillas, símbolos, dígitos, emojis y saltos de línea, con un mensaje de error asociado al campo. React escapa el texto y el mensaje se codifica con `encodeURIComponent`.
- Color de error como token `--danger` (claro y oscuro) en el bloque del portal en `clarity.css`.
- Pruebas: unitarias en `plans.test.mjs` y grupo `portal` en `tests/e2e/checks.mjs` (enlaces, pestaña nueva, validación, temas, teclado y cabecera sin desbordamiento de 320 a 1440 px).
- Footer: el botón de WhatsApp dice «Escríbenos» (nombre accesible «Escríbenos por WhatsApp»). El botón «WhatsApp» de «Estamos en El Botadero» (Cobertura) no cambió.
- Logo de la cabecera: 150 px en escritorio y tableta. En anchos menores ocupa todo el espacio libre y solo él se encoge, con un margen mínimo de 10 px en teléfonos (≈ 85 px a 320, 110 a 360, 116 a 390 y 150 desde 430). A 851 px, con la navegación de escritorio completa, mide unos 119 px. Hasta 430 px el enlace del portal no lleva icono, para dejarle ese espacio al logo.
- Nosotros: la introducción «Nuestro servicio a la comunidad» usa las mismas dos columnas que la historia (título a la izquierda, texto alineado con la columna de capítulos, ajustados por abajo). Se compararon tres opciones: a la izquierda (dejaba la mitad derecha vacía), centrada (rompía la alineación a la izquierda del resto de la página) y en dos columnas (elegida). En una columna (móvil, movimiento reducido o ventanas de 700 px de alto o menos) queda como antes.
- Planes: con el recomendador cerrado quedaba un hueco de unos 120 px bajo la foto. Se sumaban el padding de la sección y el margen superior del recomendador, que venía de cuando iba después del catálogo. Ahora el espacio es el mismo que en Ayuda, Legal y Cobertura (32 px en móvil, 44 en escritorio). Prueba e2e en el grupo `espaciado`.
- Diálogo de contacto (escritorio, sin View Transitions): el efecto que fija el origen de la animación cancela su animación al limpiarse. En desarrollo, StrictMode ejecutaba el efecto dos veces, medía la caja ya encogida y el diálogo crecía desde unos 30 px fuera del botón.

## Limpieza (rama `chore/limpieza-archivos`)

Lo que el sitio ya no usa se movió a `archive/` con su ruta original; `archive/README.md` lo detalla. Incluye el demo `demos/redesign`, los componentes e imágenes del sitio anterior, variantes de hero y logos, 4 fotos de comunidad sustituidas y el plan ya ejecutado. Se quitaron los scripts `dev:demo` y `build:demo`, y ESLint ignora `archive/`.

URLs publicadas: las seis páginas, `/about` (redirige a `/nosotros`) y la página «no encontrada». El sitio no lee parámetros de URL; `?tema=` y `?movimiento=` solo los usan las pruebas. Todo `public/` se publica, así que `src/site/public-files.test.mjs` (dentro de `npm test`) exige que cada archivo de `public/` se use en el sitio, ya sea por nombre o con un patrón declarado en la prueba.

Pendiente en otro PR: las dependencias que solo usaba el sitio anterior (Tailwind y su configuración, react-slick, slick-carousel, react-awesome-reveal, react-scroll y Emotion).

## Imagen para redes sociales

`public/og-image-redixc.jpg` (1200 × 630, JPEG de calidad 85, unos 190 KB) reemplaza a la PNG del sitio anterior, que queda en `archive/`. Sigue el hero de Inicio: panel claro con el logo, «FIBRA ÓPTICA · SANTIAGO IXCUINTLA», el eslogan «La fibra que te une al mundo.» con «al mundo.» en acento, «Planes de 30 a 150 Mbps para tu hogar, con atención local», «Desde $300 MXN / mes · impuestos incluidos» y redixc.net, junto a la foto `hero-planes.webp`. Va en JPEG para no pasar del límite aproximado de 300 KB de WhatsApp, y el nombre nuevo hace que las redes descarguen la imagen nueva en lugar de usar la anterior. `index.html` declara su tipo, sus dimensiones y un texto alternativo.
