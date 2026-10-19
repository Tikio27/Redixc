# Redixc: comparativa local de diseño

Demo: http://127.0.0.1:5175/

- Actual: http://127.0.0.1:5175/actual/
- Propuesta: http://127.0.0.1:5175/propuesta/
- Selector de Inicio, Planes, Cobertura, Nosotros, Ayuda y Legal.
- Escritorio a 1440 px o móvil a 390 px, claro/oscuro/sistema y vistas individuales o lado a lado.
- Las vistas navegan de forma independiente. Cambiar página o tema reinicia los paneles.
- “Abrir completa” permite revisar cada versión sin el escalado del comparador.

La rama `feat/redixc-apple-design-comparison` conserva los cambios locales que ya existían en `feat/redixc-production-redesign`. No se hicieron commits, publicaciones ni instalaciones. La variante aprobada se integró después en `src/site/`; `demos/redesign` permanece intacto. Actual conserva la versión previa a la integración en `CurrentSnapshot.jsx`. Propuesta es una copia independiente para experimentar sin tocar la integración.

Desde la raíz del repositorio, usando las dependencias existentes:

```sh
node node_modules/vite/bin/vite.js demos/apple-comparison --host 127.0.0.1 --port 5175 --strictPort
node node_modules/vite/bin/vite.js build demos/apple-comparison --outDir /tmp/redixc-apple-comparison-build
```

## Diagnóstico y cambios

La identidad ya tiene una dirección clara: azul #0151FD, Cerebri, escenas familiares y atención local. Conviene conservarla. La propuesta aplica los fundamentos de Apple a una web: jerarquía, legibilidad, control de la persona y movimiento útil. No adopta navegación nativa ni materiales de iOS.

| Prioridad | Evidencia en el actual | Impacto | Cambio en el demo |
| --- | --- | --- | --- |
| Alta | El hero usa el eslogan sin identificar ubicación ni precio. `src/site/App.jsx`, sección hero. | Una visita nueva tarda en saber si Redixc atiende su zona y presupuesto. | Contexto de Santiago Ixcuintla, fibra óptica y precio desde $300 MXN; instalación y disponibilidad por confirmar. Imagen más amplia para conservar la escena familiar. |
| Alta | `planCard(..., full=false)` omite el botón, nombre y subida; el recomendador precede a los planes en Inicio. | Se ve una oferta, pero consultar ese plan requiere otro recorrido. | Planes antes del recomendador, nombre y subida visibles, consulta contextual por tarjeta y enlace al catálogo completo. |
| Alta | El botón de WhatsApp oculta su texto en móvil sin un `aria-label` propio. | Su función puede no tener un nombre accesible útil. | Nombre explícito, foco, aislamiento del contenido detrás del diálogo y restauración al cerrar. |
| Media | El recomendador compacto oculta el selector de personas; la fórmula conserva por defecto 1–2. | La orientación parece más personalizada de lo que permiten los datos solicitados. | Pregunta por uso simultáneo también en Inicio y presenta el resultado como orientación; lleva al catálogo y resalta la opción. La fórmula sigue siendo la existente, pendiente de validación del negocio. |
| Media | La comparación aparece después de las seis tarjetas; no hay acceso directo tras seleccionar. | Especialmente en móvil, es fácil no descubrir el resultado. | Contador, explicación del máximo de tres y botón que desplaza y lleva el foco a la tabla. |
| Media | El footer móvil usa texto de 12 px y filas de 30 px; algunos controles son compactos. | Se prioriza densidad sobre lectura y precisión táctil. | Texto y áreas táctiles mayores, manteniendo navegación horizontal y contacto en dos columnas. Se acepta algo más de altura. |
| Media | Se animan entrada de secciones y elevación de tarjetas informativas. | Añade espera visual y puede sugerir interacción en contenido estático. | Se conservan las entradas suaves de secciones y el feedback de tarjetas del rediseño actual, con soporte para movimiento reducido. |
| Media | El soporte prepara un saludo y localidad, sin capturar el problema. | Obliga a escribir el contexto después de abrir WhatsApp. | Descripción opcional que se incorpora a la vista previa; no se envía nada automáticamente. |

Las capturas comparativas de las seis páginas están en `/tmp/redixc-apple-review/sheet-{inicio,planes,cobertura,nosotros,ayuda,legal}.png`. Las primeras vistas documentan jerarquía; no prueban por sí solas los recorridos completos. Hay capturas adicionales de contacto, comparación y soporte.

## Referencias y alcance

Se consultó https://redixc.net/ el 18 de octubre de 2026 mediante navegador. Se comprobaron los seis planes: Básico 30/20 Mbps $300; Esencial 35/25 $350; Plus 50/40 $400; Premium 80/50 $500; Ultra 100/80 $600; Max 150/100 $800. El sitio publicado también indica impuestos incluidos, servicio mes a mes y técnicos locales. Se conservaron los datos existentes; consultar una localidad no equivale a confirmar cobertura de una dirección.

Las fotografías se reutilizan como material visual del proyecto. No se comprobó que representen clientes reales; no se usan como testimonios. Tampoco se verificaron cobertura por domicilio, disponibilidad de instalación ni vigencia legal de los documentos.

Referencias leídas de la skill apple-design:

- `layout.md › Visual hierarchy`: “Order content by relative importance.” Oferta primero; ayuda para elegir después.
- `buttons.md › Content`: “Ensure that each button clearly communicates its purpose.” Acciones explícitas y nombre accesible en móvil.
- `buttons.md › Best practices`: regiones de interacción cómodas; referencia de 44 × 44 pt adaptada como objetivo práctico para controles web.
- `accessibility.md › Vision`: contraste y aumento de texto; `color.md › Inclusive color`: información adicional a color.
- `motion.md › Best practices`: “Add motion purposefully, supporting the experience without overshadowing it.” Se conservan entradas suaves y feedback, sin bloquear la interacción.
- `dark-mode.md › Best practices`: legibilidad y coherencia en ambos temas. Se conserva el selector claro/oscuro/sistema propio de esta web.
- `entering-data.md › Best practices`: claridad sobre datos solicitados y reducir escritura repetida.

Contrastes calculados de tokens, sin estimarlos desde imágenes: blanco sobre #0151FD **5.84:1**; #526078 sobre blanco **6.36:1**, sobre #F1F5FF **5.83:1**; #80AAFF sobre #0B1020 **8.21:1**. Estos pares no constituyen una auditoría completa de contraste de cada elemento.

## Direcciones viables

Estimaciones orientativas para una persona, sin incluir aprobaciones del negocio ni reemplazo de fotografías.

| Dirección | Ventajas | Desventajas | Esfuerzo estimado |
| --- | --- | --- | --- |
| Ajustar el actual | Conserva proporciones y composición; corrige etiquetas, botones y foco. | La oferta y el acceso a precios siguen menos visibles si no cambia la jerarquía. | 1–2 días |
| Claridad local — implementada en este demo | Mantiene identidad; explica ubicación y presupuesto, facilita consultar cada plan. | Hero con más información; controles cómodos ocupan más espacio. | 3–5 días para integrar y comprobar en producción |
| Cobertura como primera tarea | Útil para visitas que desconocen la disponibilidad; concentra localidad, plan y consulta. | Requiere validar la operación y los datos de cobertura; puede retrasar a quien quiere comparar precios. | 5–8 días, más validación del negocio |

Recomendación: **claridad local**. Conservar color, tipografía, fotos, navegación sticky opaca, seis rutas, documentos y confirmación humana de disponibilidad. Cambiar primero jerarquía, acceso a planes y estados accesibles. No añadir efectos de cristal, mapas de cobertura no comprobados ni recomendaciones con apariencia de garantía.

## Etapas de integración propuestas

1. Inmediatas: nombre accesible de WhatsApp, foco del diálogo, acciones por plan, contraste y tamaños táctiles; textos que aclaran cobertura y qué ocurre al abrir WhatsApp.
2. Posteriores: probar la nueva jerarquía con usuarios locales; observar si identifican zona, precio, subida y siguiente paso; decidir proporción de foto y extensión del hero, simplificar CSS heredado y medir rendimiento real.
3. Validación del negocio: criterios del recomendador, vigencia de tarifas y condiciones, costos de instalación, canales/horarios de atención y disponibilidad por dirección. No añadir promesas hasta confirmar esos datos.

## Comprobación realizada

- Compilación del demo con Vite, sin instalar dependencias, con salida temporal fuera del proyecto.
- 48 capturas: seis páginas × dos versiones × dos tamaños × dos temas, inspeccionadas mediante seis láminas. Una captura de Ayuda claro se repitió para aislarla de otra prueba de tema en una pestaña simultánea.
- Comprobación de ausencia de desbordamiento horizontal a 390 y 1440 px en esa matriz; comprobaciones adicionales de la propuesta a 320, 768 y 1024 px.
- Interacciones reales de clic y teclado: menú móvil, Escape, retorno del foco, Tab inverso en el diálogo, consulta desde tarjeta, contexto de plan/localidad, validación del recomendador, resultado y navegación, selección máxima de tres planes y acceso a la tabla, soporte con descripción, tema sistema y movimiento reducido. También controles móvil/oscuro del comparador.
- Ningún mensaje enviado ni solicitud de contratación ejecutada. La apertura externa de WhatsApp no forma parte de la prueba; se inspeccionó la URL y su mensaje preparado.
- Las imágenes lazy de Inicio no se consideran rotas por no haber cargado en la primera pantalla; se verificaron tras desplazar la página.

No se declara conformidad WCAG completa. Quedan fuera: lector de pantalla real, Safari/dispositivos físicos, zoom del navegador al 200 %, auditoría exhaustiva de contraste y pruebas de red lenta/Lighthouse. Las advertencias del build sobre Browserslist y `align-content:start` proceden de las dependencias/CSS existente; no se actualizaron para esta comparación.

## Ajuste tras la comparación

Se restauraron las animaciones existentes en la propuesta: `useScrollReveal`, entradas del hero y del resultado, y feedback de tarjetas. La desactivación inicial fue una decisión de diseño del demo, no una obligación de apple-design. Se mantiene `prefers-reduced-motion`. La skill local de revisión HIG es distinta de `emilkowalski/skills/skills/apple-design`, que se centra en interacción y movimiento fluido para web.

## Variante Emil Kowalski

URL directa: http://127.0.0.1:5175/emil/

En el comparador, el selector **Variante** permite elegir **Emil · interacción fluida** o la propuesta **Claridad local · HIG**. El actual permanece como referencia a la izquierda. La variante Emil reutiliza la propuesta como base para que se pueda juzgar el efecto de la interacción sin mezclarlo con nuevos precios, fotografías o contenido comercial.

Se leyó y aplicó directamente la skill de https://github.com/emilkowalski/skills/tree/main/skills/apple-design el 18/10/2026. No se reemplazó la skill instalada ni se instalaron dependencias.

Qué probar:

1. Presionar un botón sin soltar: el feedback empieza al presionar; liberar fuera cancela la acción con el comportamiento normal del navegador.
2. En móvil, abrir WhatsApp y arrastrar desde la agarradera superior. El diálogo sigue el dedo; un recorrido corto vuelve a su posición y uno suficiente lo cierra. Se puede invertir el gesto o interrumpir el resorte desde su posición visible. La velocidad de salida se incorpora al resorte y a la decisión de cierre.
3. Cerrar con Escape o el botón: mantiene el mismo recorrido de salida, devuelve el foco y libera el contenido del fondo.
4. Activar movimiento reducido: elimina desplazamiento y escala, conserva la consulta y sus controles. También se contemplan contraste elevado y transparencia reducida.

La integración del resorte usa `requestAnimationFrame`, posición y velocidad persistentes y amortiguación crítica. El bucle se detiene al asentarse y se limpia al cambiar de ruta o desmontar. Los gestos están limitados a la agarradera; la consulta sigue desplazándose de forma nativa. No hay rebotes decorativos, sonido ni vibración. La navegación permanece opaca por la decisión previa de Redixc; los títulos conservan Cerebri por identidad y el cuerpo usa la fuente del sistema.

El alcance es una exploración de interacción, no una aplicación de todos los patrones de la skill: no se añadieron carruseles, gestos ni transparencias donde no hay una necesidad del sitio.

## Exploración de movimiento: hero estable, planes y comparación

URL: http://127.0.0.1:5175/emil/ y http://127.0.0.1:5175/emil/planes

Se retiró la narrativa del hero a petición del usuario. `/historia/` redirige a `/emil/` para conservar los enlaces previos. El comparador abre Emil por defecto y conserva Actual y Claridad local.

- Hero: entrada coordinada breve de título, descripción, oferta y botones; fotografía con aparición suave. Después permanece estable y no depende del scroll.
- Planes: al filtrar se conserva la posición visible de las tarjetas que continúan y se animan hacia su nuevo lugar. Las nuevas aparecen con un desplazamiento pequeño. Al interrumpir un filtro se parte de la posición visible actual.
- Recomendación: contorno destacado sin cambiar el ancho de borde ni desplazar el contenido.
- Comparación: barra fija con contador, nombres seleccionados, acciones para quitar/limpiar y acceso a la tabla. Entrada y salida breves. La consulta por WhatsApp conserva su diálogo arrastrable.

Las preferencias de movimiento reducido omiten las entradas y transiciones de tarjetas. No se instalaron dependencias. La variante aprobada se integró posteriormente en el sitio principal. Se usan Web Animations para secuencias sin gestos y el resorte existente para la respuesta al presionar y el diálogo.

La barra se comprueba en escritorio y móvil; el diálogo vuelve inerte también la barra para mantener el foco dentro de la consulta. No se enviaron mensajes ni se publicaron cambios.

## Menú móvil y resultado del recomendador

La variante Emil añade un menú móvil con apertura/cierre sobre el contenido desde la cabecera. El panel permanece montado al invertir la interacción; el resorte conserva posición y velocidad, y el contenido cerrado queda oculto e inerte. Escape y la navegación siguen disponibles.

El resultado del recomendador expande su espacio dentro del bloque. Después de la primera sugerencia, cambiar actividades o personas actualiza el resultado; quitar todas las actividades lo cierra. Se conserva la fórmula orientativa existente y el aviso de alcance, sin añadir garantías comerciales. El resultado se anuncia mediante una región de estado.

El componente `MotionPanel.jsx` ajusta la altura cuando cambia el contenido o el ancho disponible; respeta cambios en vivo de movimiento reducido y limpia observadores y resortes al desmontarse. No se instalaron dependencias ni se cambió el hero.
