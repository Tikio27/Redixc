# Redixc · Claridad para elegir y contactar — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar las direcciones A + B de la evaluación apple-design al sitio `src/site/` y verlas lado a lado con la versión actual en un comparador local.

**Architecture:** Se congela una copia del sitio actual en `demos/clarity-comparison/actual/` antes de tocar nada; los cambios se hacen sobre `src/site/` (la propuesta). El comparador sirve ambas versiones en iframes independientes (escritorio 1440 / móvil 390, claro/oscuro), reutilizando el patrón de `demos/apple-comparison`. La propuesta acepta `?movimiento=actual|propuesto`, de modo que las animaciones actuales y las propuestas se comparan sobre el mismo contenido. Los datos de planes y la fórmula del recomendador pasan a un módulo puro probado con `node:test`; el comportamiento visual se verifica con un script Playwright. La nueva fotografía de Planes la genera Codex y se convierte a WebP con el Chromium existente.

**Tech Stack:** React 18, React Router 6, Vite 4 (dependencias existentes de la raíz), `node:test`, `playwright-core` ya instalado en `/Users/tiquiorodriguez/projects/negora/node_modules/playwright-core` (sin instalar nada).

**Spec:** Evaluación apple-design de esta conversación (19/10/2026): problemas 1–7 y 9, direcciones A + B. Fuente de datos publicada: redixc.net, leída el 19/10/2026.

## Global Constraints

- No instalar dependencias, no hacer push, PR ni despliegue. **Commits solo si el usuario los autoriza en esta rama**; mientras tanto, el checkpoint de cada tarea es su verificación en verde.
- Rama de trabajo: `feat/redixc-clarity-updates`, creada desde el HEAD actual (5db248c). Los cambios sin confirmar de `src/site/` viajan con la rama; `demos/redesign` y `demos/apple-comparison` no se modifican.
- No inventar cobertura, promociones, testimonios, horarios ni promesas. Solo datos publicados en redixc.net:
  - «Número de inscripción IFT» por plan: Básico 2233240, Esencial 2233241, Plus 2233242, Premium 2233243, Ultra 2233244, Max 2233245.
  - Visor: `https://tarifas.ift.org.mx/ift_visor/` — texto: «Para mayor información respecto a las tarifas puede consultar el visor de tarifas de la Comisión Reguladora de Telecomunicaciones» (literal de redixc.net).
  - Dirección: «Rafael Mejía Amaral #55, El Botadero, Santiago Ixcuintla, Nayarit, C.P. 63575».
- **No cambiar sin validación del negocio:** eslogan («une»/«conecta»), lista de localidades (`El Botadero, Pueblo Nuevo, Villa Juárez, El Carrizo`), fórmula del recomendador, precios, beneficios.
- Conservar: #0151FD, Cerebri en títulos, fotografías, cabecera sticky opaca, seis rutas, temas claro/oscuro/sistema con la clave `redixc-theme`, vista previa del mensaje de WhatsApp, movimiento reducido, Escape y retorno de foco.
- Tamaños: ningún texto visible < 12 px; controles principales ≥ 44 × 44 px.
- Sin efectos de cristal nuevos.
- Movimiento: transiciones de interfaz ≤ 250 ms y resortes críticamente amortiguados (sin rebote); ningún contenido queda invisible si no hay JavaScript, si el navegador no soporta la técnica o si la persona salta por ancla o búsqueda; con movimiento reducido, solo fundidos de opacidad ≤ 150 ms.
- Archivos públicos compartidos por ambas variantes (`public/`): no sobrescribir ninguno; los nuevos llevan nombre nuevo.

## Review Focus

- Llegar a `/planes` desde el recomendador de Inicio con la cabecera sticky: la tarjeta recomendada debe quedar visible bajo la cabecera, no tapada → aserción en Task 4.
- Tema guardado en una vista del comparador que contamina la otra (comparten origen y `localStorage`): cada iframe fuerza su tema por `?tema=` → aserción en Task 1.
- Movimiento reducido activado tras cargar la página: el diálogo sigue cerrándose al instante y el foco vuelve → aserción en Task 8.
- Menú móvil con el selector de tema dentro: Escape cierra y devuelve el foco al botón del menú; cambiar de tema no cierra el menú → aserción en Task 6.
- Desplazamiento rápido, salto por ancla o búsqueda en la página hacia contenido que aún no «entró»: con el movimiento propuesto debe verse completo, sin quedar a media opacidad → aserción en Task 9.

---

### Task 1: Rama, copia congelada y comparador

**Files:**
- Create: `demos/clarity-comparison/{package.json,vite.config.mjs,index.html,README.md}`
- Create: `demos/clarity-comparison/src/main.jsx`, `demos/clarity-comparison/src/comparison.css`
- Create: `demos/clarity-comparison/actual/` (copia de `src/site/*`)
- Create: `demos/clarity-comparison/tests/verify.mjs`

**Interfaces:**
- Produces: URLs `http://127.0.0.1:5176/` (comparador), `/actual/<ruta>?tema=light|dark`, `/propuesta/<ruta>?tema=…`. `verify.mjs` exporta un runner con `check(name, fn)` y acepta `--only=<task>`; las tareas siguientes añaden sus aserciones ahí.

- [ ] **Step 1:** `git switch -c feat/redixc-clarity-updates`. Esperado: `git status` muestra los mismos cambios que antes.
- [ ] **Step 2:** Copiar `src/site/` a `demos/clarity-comparison/actual/` y reescribir en la copia la importación `../assets/community/` → `../../../src/assets/community/`. Esperado: `diff -r src/site demos/clarity-comparison/actual` solo difiere en esas líneas de `CommunityStory.jsx`.
- [ ] **Step 3:** Crear `package.json` y `vite.config.mjs` como en `demos/apple-comparison` (puerto **5176**, `publicDir` `../../public`, `fs.allow` la raíz). `main.jsx`: variante = primer segmento de la ruta; `actual` importa `../actual/{styles,refinements,motion,community}.css` y `../actual/App.jsx`; `propuesta` importa `../../../src/index.css` y `../../../src/site/App.jsx`; ambas con `BrowserRouter basename="/<variante>"` y el tema de `?tema=` escrito en `redixc-theme` **antes** de montar. Sin variante: comparador con selector de página (6 rutas), dispositivo (1440/390), tema (claro/oscuro), **movimiento de la propuesta (actual/propuesto)**, botón «Repetir animaciones» (recarga ambos iframes), modo lado a lado o individual y enlace «Abrir completa ↗», copiando `Preview` y `Comparison` de `demos/apple-comparison/src/main.jsx` con solo las variantes `actual` («Versión actual») y `propuesta` («Propuesta · claridad»). La propuesta pasa `movimiento` a `<App motion="current|purposeful">` (por defecto `current` hasta la Task 9).
- [ ] **Step 4: Escribir `verify.mjs`** con las aserciones base:
  - para cada variante × 6 rutas × {1440, 390}: hay exactamente un `h1`, `scrollWidth - innerWidth === 0`, sin `pageerror`;
  - `/actual/?tema=dark` y `/propuesta/?tema=light` abiertas en el mismo contexto → `documentElement.dataset.theme` es `dark` y `light` respectivamente.
- [ ] **Step 5:** Arrancar `node node_modules/vite/bin/vite.js demos/clarity-comparison --host 127.0.0.1 --port 5176 --strictPort` en segundo plano y ejecutar `node demos/clarity-comparison/tests/verify.mjs`. Esperado: todas en PASS (actual y propuesta todavía idénticas).
- [ ] **Step 6:** README del comparador: URLs, comando de arranque y lista de cambios (se completa al final).

### Task 2: Módulo de datos de planes

**Files:**
- Create: `src/site/plans.js`, `src/site/plans.test.mjs`
- Modify: `src/site/App.jsx:42-145` (mover `plans`, `locales`, `documents`; importar), `App.jsx:1197-1225` (usar `recommendPlan`)

**Interfaces:**
- Produces: `plans: Array<{name, down, up, price, desc, use, ift: number}>`, `locales: string[]`, `documents: [title, desc, file][]`, `recommendPlan(activities: string[], people: "1-2"|"3-4"|"5+"): Plan`, `formatoUrl(plan): string` (→ `/docs/formatos/FormatoSimplificado_<ift>.pdf`), `IFT_VISOR_URL`, `ADDRESS`.

- [ ] **Step 1: Pruebas** en `plans.test.mjs` (`node:test` + `assert`):
  - `plans.map(p => p.ift)` igual a `[2233240, …, 2233245]`; nombres y precios `[300,350,400,500,600,800]`.
  - `recommendPlan(["Trabajar"], "1-2").name === "Básico"`; `recommendPlan(["Trabajar","Estudiar"], "1-2").name === "Plus"`; `recommendPlan(["Disfrutar"], "3-4").name === "Plus"`; `recommendPlan(["Disfrutar"], "5+").name === "Ultra"` (fórmula actual, sin cambios).
  - `formatoUrl(plans[2]) === "/docs/formatos/FormatoSimplificado_2233242.pdf"`.
- [ ] **Step 2:** `node --test src/site/plans.test.mjs` → FAIL (módulo inexistente).
- [ ] **Step 3:** Implementar `plans.js`; en `App.jsx` sustituir `choose` y el cálculo de `recommend` por `recommendPlan`, y el enlace `2233240 + i` por `formatoUrl(p)`.
- [ ] **Step 4:** `node --test src/site/plans.test.mjs` → PASS; `verify.mjs` → PASS.

### Task 3: Datos publicados (IFT, visor y dirección)

**Files:**
- Modify: `src/site/App.jsx` (`planCard` pie de tarjeta ~L309; fineprint de Planes ~L735; Legal ~L1030; footer ~L1074)

**Interfaces:**
- Consumes: `plan.ift`, `IFT_VISOR_URL`, `ADDRESS` (Task 2).

- [ ] **Step 1: Aserciones** en `verify.mjs --only=datos` (propuesta): en `/planes` cada tarjeta contiene «Número de inscripción IFT: <número>»; existe `a[href="https://tarifas.ift.org.mx/ift_visor/"]` en `/planes` y `/legal`; el footer de todas las rutas contiene `ADDRESS`.
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** En el pie de tarjeta completa añadir `<span className="plan-ift">Número de inscripción IFT: {p.ift}</span>` junto a «Ficha del plan». Añadir el texto y enlace del visor (Global Constraints) al fineprint de Planes y a la nota de Legal. Sustituir «Santiago Ixcuintla, Nayarit» del footer por `ADDRESS`.
- [ ] **Step 4:** Ejecutar → PASS.

### Task 4: Recomendador que lleva al plan

**Files:**
- Modify: `src/site/App.jsx` (`onRecommend` de Inicio ~L508 y de Planes ~L674; efecto de cambio de ruta ~L188; texto del resultado ~L1321)

**Interfaces:**
- Produces: `focusPlan(name: string): void` en `App` — desplaza hasta `[data-plan="<name>"]` con `block: "center"`, enfoca su botón «Consultar este plan» con `preventScroll`. Navegación desde Inicio: `navigate("/planes", { state: { focusPlan: name } })`.

- [ ] **Step 1: Aserciones** en `verify.mjs --only=recomendador`: en `/propuesta/` (390 y 1440) elegir «Trabajar», «Ver sugerencia», «Ver en los planes» → URL termina en `/planes`, `.plan.recommended` existe, su `getBoundingClientRect().top` ≥ altura de `.header` y su `bottom` ≤ `innerHeight`, y `document.activeElement` está dentro de esa tarjeta. El texto del resultado contiene «para trabajar» y no contiene «según uso de».
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** El efecto de ruta conserva `scrollTo(0)` salvo que `location.state?.focusPlan` exista; en ese caso, tras el render (`requestAnimationFrame`), llama a `focusPlan`. Planes también usa `focusPlan` en lugar de `scrollIntoView` de la sección. Texto: `Orientación para {people} personas conectadas a la vez, para {lista}.` con la lista en minúsculas unida por «, » y « y » final; se conserva la frase sobre uso simultáneo y Wi-Fi.
- [ ] **Step 4:** Ejecutar → PASS (incluye la aserción de cabecera sticky de Review Focus).

### Task 5: Planes primero y comparación estática

**Files:**
- Modify: `src/site/App.jsx` (bloque `route.page === "planes"` ~L657-819; `planCard` pie; estado `compare`/`filters`; `CompareTray` ~L1091)
- Modify: `src/site/PlanMotion.jsx` (eliminar `usePlanMotion` y `CompareTray`; conservar `useHeroEntrance`)
- Create: `src/site/clarity.css`; Modify: `src/index.css` (importarlo al final)

**Interfaces:**
- Produces: `PlanTable({ openContact })` en `App.jsx`; clase `.recommender-disclosure` (`<details>`).

- [ ] **Step 1: Aserciones** en `verify.mjs --only=planes` (propuesta, 390 y 1440): en `/planes` el primer `.plan` está por encima del `#recomendador`; `#recomendador` está dentro de `details.recommender-disclosure` cerrado por defecto, con `summary` «¿No sabes cuál elegir? Te ayudamos a orientarte»; no existen `.filter-tabs`, `.compare-tray` ni `input[type=checkbox]`; `table` tiene 6 filas de cuerpo con precio, bajada, subida, enlace a ficha y botón «Consultar» cuyo diálogo muestra el plan de su fila; a 320 px la tabla se desplaza dentro de `.table-scroll` y `scrollWidth - innerWidth === 0` en la página.
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** Orden: `PageIntro` → `details.recommender-disclosure` (contiene `Recommender`) → «Todos nuestros planes» con las 6 tarjetas → `PlanTable` («Los 6 planes de un vistazo», dentro de `.table-scroll` con primera columna fija) → fineprint, beneficios y `ContactBanner`. Quitar filtros, casillas, `compare`, `CompareTray`, `usePlanMotion` y el texto `comparison-hint`. Al recomendar dentro del `details`, `focusPlan` (Task 4).
- [ ] **Step 4:** Ejecutar → PASS; `node --test` sigue en PASS.

### Task 6: Cobertura en un toque y cabecera móvil

> **Choca con V4** (`demos/redesign/AGENTS.md`: «Theme selector is icon-only after WhatsApp»). La parte de la cabecera se implementa detrás de la clase `.header-compact` para poder retirarla con una sola línea si, al compararla, prefieres la cabecera actual.

**Files:**
- Modify: `src/site/App.jsx` (bloque `cobertura` ~L821-882; eliminar `CoverageCompact` ~L1140; cabecera ~L433 y menú móvil ~L456)
- Modify: `src/site/clarity.css`

**Interfaces:**
- Consumes: `locales`, `openContact(plan, locality)`.

- [ ] **Step 1: Aserciones** en `verify.mjs --only=cobertura`: en `/cobertura` el panel «¿Dónde quieres conectarte?» contiene 4 botones (uno por localidad), cada uno ≥ 56 px de alto, y no hay `select` ni segundo botón «Preparar consulta»; pulsar «Pueblo Nuevo» abre el diálogo con `#contact-locality` = «Pueblo Nuevo». A 390 px: `.header .theme-control` no visible; `.whatsapp-nav` muestra el texto «WhatsApp» y mide ≥ 44 px de alto; el menú abierto contiene el grupo «Apariencia del sitio»; cambiar a «Oscuro» desde el menú pone `data-theme="dark"` y el menú sigue abierto; Escape cierra el menú y el foco vuelve a `.menu-toggle`. `.brand` mide ≥ 44 px de alto.
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** El panel principal muestra los 4 botones de localidad (se retiran del `aside`, que conserva su texto explicativo y la letra pequeña). La sección inferior conserva título, texto y FAQ, sin botón. En el menú móvil, renderizar `ThemeControl` al final con su etiqueta visible «Apariencia»; en CSS, ocultar el de la cabecera por debajo de 851 px y mostrar la etiqueta de `.whatsapp-nav`.
- [ ] **Step 4:** Ejecutar → PASS.

### Task 7: Tipografía y tamaños mínimos

> **Choca con la nota del footer móvil** («compact 10px legal copy»). Subirlo a 12 px añade unos 8 px de altura al footer; se conservan las filas de 28 px y los dos bloques.

**Files:**
- Modify: `src/site/clarity.css`; `src/site/App.jsx` (quitar `<small>Desliza para cerrar</small>` ~L1462)

- [ ] **Step 1: Aserciones** en `verify.mjs --only=tipografia` (propuesta, 6 rutas × 390/1440 × claro/oscuro): ningún nodo de texto visible con `font-size` < 12 px; el nombre del plan (`.plan-top .eyebrow`) ≥ 15 px y `font-weight` ≥ 700; `.activity small` ≥ 14 px; descripciones de `.document-row p` ≥ 14 px; ningún par texto/fondo sólido medido < 4.5:1 (< 3:1 si ≥ 24 px o ≥ 18.66 px en negrita), con la función de contraste de la auditoría inicial.
- [ ] **Step 2:** Ejecutar → FAIL (hoy: 9–11 px).
- [ ] **Step 3:** En `clarity.css`: `.eyebrow` y equivalentes 12 px con `letter-spacing: .06em`; nombre de plan 15 px (16 px en móvil) en negrita; `.activity small` y descripciones de documentos 14 px; footer y fineprint ≥ 13 px. Sin cambiar colores de marca.
- [ ] **Step 4:** Ejecutar → PASS; repetir las capturas de la matriz para revisión visual.

### Task 8: Cierre breve del diálogo y detalles técnicos

**Files:**
- Modify: `src/site/fluidMotion.js:5` (`spring`) y `:209` (`dismiss`)
- Modify: `src/site/App.jsx` (`fetchPriority` ~L393 y ~L1355; efecto de título ~L206)

**Interfaces:**
- Produces: `spring(render, initial = 0, response = 0.35, tolerance = 0.001)`; el diálogo usa `tolerance: 0.5` (px).

- [ ] **Step 1: Aserciones** en `verify.mjs --only=detalles`: en `/planes` abrir «Consultar este plan» con Enter y pulsar Escape → `.contact-modal` desaparece en ≤ 350 ms y el foco vuelve a ese botón (1440 y 390); lo mismo con `reducedMotion: "reduce"` → ≤ 50 ms; tras emular `reducedMotion` después de cargar, el cierre sigue funcionando; en `/` el `document.title` es «REDIXC - Internet de Fibra Óptica en Santiago Ixcuintla | Planes 30-150 Mbps»; no aparece el aviso de React sobre `fetchPriority`.
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** Usar `tolerance` en la condición de asentamiento de `spring`; en el diálogo, `response` 0.25 y `tolerance` 0.5. Inicio conserva el título de `index.html`; las demás rutas mantienen «<Página> · REDIXC». Atributo `fetchpriority` en minúsculas.
- [ ] **Step 4:** Ejecutar `verify.mjs` completo y `node --test` → todo PASS. `npm run build` → sin errores nuevos.

### Task 9: Movimiento propuesto («con propósito»), comparable con el actual

`motion="current"` conserva exactamente las animaciones de hoy (entrada del hero, aparición al hacer scroll con 24 px y escalonado, elevación al pasar el cursor, resorte al presionar, menú, resultado y hoja arrastrable). `motion="purposeful"` aplica cuatro cambios:

| Hoy | Propuesto | Por qué |
|---|---|---|
| Entrada coordinada del hero en cada carga | Hero estático y listo desde el primer fotograma | Respuesta inmediata: lo primero que se ve no debe esperar |
| Cada sección y tarjeta aparece por JavaScript (oculta hasta que entra), 24 px y escalonado | Aparición ligada al scroll con CSS (`animation-timeline: view()`, rango `entry 0% entry 35%`, 8 px y opacidad 0.4→1), solo en fotos y grupos de tarjetas, nunca en títulos ni texto; sin soporte → sin animación | Nada queda invisible; sin observadores ni estados pendientes |
| Elevación al pasar el cursor en tarjetas informativas (valores, pasos) | Solo en elementos accionables | Una elevación promete un clic que no existe |
| Diálogo sin relación con su origen | En escritorio, el diálogo crece desde el botón que lo abrió (`transform-origin` en el botón, escala .96→1, 200 ms) y vuelve a él al cerrar; en móvil sigue siendo una hoja inferior | Continuidad espacial: se ve de dónde vino |

Y dos señales nuevas que sí comunican algo:
- **Llegada al plan recomendado** (Task 4): el contorno de la tarjeta aparece en 200 ms y la etiqueta «Tu recomendación» se funde; sin desplazar el contenido.
- **Vista previa del mensaje de WhatsApp:** al cambiar localidad o descripción, la frase que cambió se resalta con un fondo azul tenue que se desvanece en 600 ms (`<mark className="message-change" key={…}>`).

**Files:**
- Create: `src/site/motion-purposeful.css`
- Modify: `src/site/App.jsx` (prop `motion`; clase `motion-purposeful` en `.app`; `useScrollReveal` y `useHeroEntrance` solo con `current`; `ContactModal` recibe `origin: DOMRect | null`)
- Modify: `src/site/useScrollReveal.js` (sin cambios de lógica; solo se deja de llamar en `purposeful`)
- Modify: `src/index.css` (importar `motion-purposeful.css`; todas sus reglas bajo `.motion-purposeful`)

**Interfaces:**
- Consumes: `focusPlan` (Task 4), `?movimiento=` del comparador (Task 1).
- Produces: `<App motion="current" | "purposeful">`; producción (`src/App.tsx`) sigue con `current` hasta que elijas.

- [ ] **Step 1: Aserciones** en `verify.mjs --only=movimiento` (propuesta, `?movimiento=propuesto`, 1440 y 390): tras `networkidle`, ningún elemento de `main` tiene opacidad < 1 en el primer viewport ni `.scroll-pending`; tras `scrollIntoView({block:"center", behavior:"instant"})` hacia la última `.connection-step-grid > li` y un fotograma, su opacidad ≥ 0.99; simulando un navegador sin soporte (inyectar `<style>.motion-purposeful *{animation:none!important}</style>`), todo `main` tiene opacidad 1; `document.getAnimations()` en el hero = 0 tras la carga; `.values-grid article:hover` no cambia `transform` ni `box-shadow`; en escritorio, al abrir el diálogo desde la tercera tarjeta, el `transform-origin` calculado de `.contact-modal` cae dentro del rectángulo de ese botón; al elegir «Pueblo Nuevo» en el diálogo aparece un `mark.message-change` con ese texto. Con `reducedMotion:"reduce"`: sin `transform` en ninguna animación activa. Con `?movimiento=actual` siguen pasando las aserciones previas de Tasks 1–8.
- [ ] **Step 2:** Ejecutar → FAIL.
- [ ] **Step 3:** Implementar según la tabla. `openContact` guarda `document.activeElement?.getBoundingClientRect()` como `origin`. La salida del diálogo en escritorio invierte la entrada (mismo recorrido, 200 ms).
- [ ] **Step 4:** Ejecutar `verify.mjs` completo → PASS. Grabar dos vídeos cortos (actual / propuesto) con Playwright `recordVideo` del recorrido Inicio → recomendador → plan → diálogo, para verlos a cámara lenta.

### Task 10: Nueva fotografía para el hero de Planes

La genera Codex (`codex exec` con `hero-legal`, `hero-ayuda` y `hero-cobertura` como referencias de estilo): hogar rural modesto de la costa de Nayarit, muros encalados, mesa de madera, cerámica azul y blanca, camino de mesa tejido, plantas, luz cálida y puerta abierta al patio; personas distintas de las demás fotos, eligiendo un plan juntas; sin texto, logotipos, pantallas legibles, uniformes ni lujo.

**Files:**
- Create: `public/assets/hero-planes-eleccion.webp` (1200 × 800, ≤ 180 KB)
- Modify: `src/site/App.jsx` (`PageIntro` de Planes usa la nueva imagen; `heroAlts.planes` describe a las personas reales de la foto)

- [ ] **Step 1:** Revisar la imagen elegida a tamaño completo: manos, rostros, texto accidental, pantallas, coherencia con las otras cinco fotos. Si falla, pedir a Codex una variante con la corrección concreta.
- [ ] **Step 2:** Recortar a 3:2 y convertir a WebP (calidad 0.82) con `canvas.toDataURL("image/webp")` en el Chromium existente, sin instalar nada.
- [ ] **Step 3: Aserciones** en `verify.mjs --only=imagen`: en `/propuesta/planes` `.page-intro-image` carga `hero-planes-eleccion.webp` con `naturalWidth === 1200`; `/actual/planes` sigue con `hero-planes.webp`; ningún hero de la propuesta repite el archivo de otro.
- [ ] **Step 4:** Ejecutar → PASS.

### Task 11: Cierre y comparativa

**Files:**
- Modify: `demos/clarity-comparison/README.md`, `REDESIGN.md` (sección nueva «Claridad para elegir y contactar»)

- [ ] **Step 1:** Repetir las 48 capturas para `actual` y `propuesta` y montar una lámina por página (actual | propuesta) en el scratchpad.
- [ ] **Step 2:** Documentar en ambos README: qué cambió, qué no cambió, las dos opciones de movimiento, el origen de la foto (generada, no clientes reales) y lo pendiente de validación (eslogan, cobertura de la cabecera municipal, fórmula del recomendador, costo de instalación, horarios).
- [ ] **Step 3:** Entregar las URLs del comparador, las láminas y los vídeos al usuario para su revisión. Sin commit hasta su autorización.

## Fuera de este plan (decisiones del negocio)

- Cobertura de la cabecera municipal, fórmula del recomendador, costo de instalación y horarios de atención.

---

## Addendum 2026-10-19 · Task 12: Movimiento expresivo (tercera opción)

El usuario pidió ver animaciones nuevas y más visibles (las 8 propuestas). `motion="expressive"` (`?movimiento=expresivo`) se construye sobre «sobrio» (nada invisible, sin elevación en tarjetas estáticas) y añade:

1. Origen → diálogo con View Transitions (`view-transition-name: contact-morph`): en escritorio el botón/tarjeta que abre la consulta se transforma en el diálogo y vuelve al cerrar. Móvil conserva la hoja con arrastre. Sin soporte → diálogo anclado de «sobrio».
2. Resultado del recomendador → tarjeta del plan en `/planes` (`reco-morph`), con la tarjeta ya enfocada.
3. Momento del hero una vez por sesión (`sessionStorage["redixc-hero-moment"]`): foto 1.03→1 + opacidad, titular por líneas (16 px, 50 ms de escalonado). El comparador borra la marca en cada carga para poder repetirlo.
4. Cambio de tema con fundido (`::view-transition-*(root)`, 300 ms).
5. Plegables (`.recommender-disclosure`, `.faq-list details`) con altura animada (280 ms), reversibles a mitad de camino; el icono + gira 45°.
6. Entradas al scroll más visibles por tarjeta y foto: 20 px, escala .97→1, opacidad .3→1, rango `entry 0% entry 50%`; nunca invisibles tras un salto.
7. Menú móvil en cascada: enlaces −6 px→0 y opacidad, 200 ms, 30 ms de escalonado.
8. Respuesta al pulsar con resorte en localidades, botones de la tabla y `summary` de los plegables.

**Files:** Create `src/site/expressiveMotion.js`, `src/site/motion-expressive.css`; Modify `src/site/App.jsx`, `src/site/fluidMotion.js` (selector extra en `useFluidControls`), `src/index.css`, `demos/clarity-comparison/src/main.jsx`, `tests/checks.mjs` (grupo `expresivo`).

**Interfaces:** `<App motion="current|purposeful|expressive">`; `useFluidControls(enabled, route, extraSelector?)`; `startTransition(enabled, update): ViewTransition | null`; `useHeroMoment(enabled, route)`; `useDisclosureMotion(enabled, route)`; `useMenuCascade(enabled, open)`.

**Verificación (grupo `expresivo`):** pseudo-animaciones `contact-morph`, `reco-morph` y `root` presentes al abrir/cerrar, recomendar y cambiar tema; cierre ≤ 450 ms con foco devuelto; hero animado en la primera carga y no al volver a Inicio en la misma sesión; plegable abre/cierra y termina cerrado si se pulsa dos veces seguidas; ≥ 6 animaciones en el menú móvil; `--fluid-scale` < 1 al presionar una localidad; las comprobaciones de «sobrio» (primera pantalla y salto) también en expresivo; con movimiento reducido no hay View Transitions ni `transform`.

---

**Cierre (19/10/2026):** el usuario aprobó la propuesta con movimiento expresivo como diseño final. Se retiraron los comparadores; las comprobaciones viven ahora en `tests/e2e/` contra el sitio principal y el código ya no tiene variantes de movimiento.
