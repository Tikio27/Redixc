# Redixc · Claridad para elegir y contactar (comparativa local)

Comparador: http://127.0.0.1:5176/

- Actual (copia congelada de `src/site/` del 19/10/2026): http://127.0.0.1:5176/actual/
- Propuesta (el `src/site/` vivo): http://127.0.0.1:5176/propuesta/ — `?movimiento=actual|propuesto|expresivo`
- Parámetro común `?tema=light|dark`.

Desde la raíz del repositorio, con las dependencias existentes:

```sh
node node_modules/vite/bin/vite.js demos/clarity-comparison --host 127.0.0.1 --port 5176 --strictPort
node demos/clarity-comparison/tests/verify.mjs            # todas las comprobaciones
node demos/clarity-comparison/tests/verify.mjs --only=base
node --test src/site/plans.test.mjs
```

`verify.mjs` usa el `playwright-core` ya instalado en `/Users/tiquiorodriguez/projects/negora` (variable `PLAYWRIGHT_CORE` para cambiarlo). No se instaló nada.

Plan: `docs/superpowers/plans/2026-10-19-redixc-claridad.md`.

## Qué cambió en la propuesta

| Área | Cambio |
| --- | --- |
| Datos publicados | «Número de inscripción IFT» en cada plan (2233240–2233245), enlace al visor de tarifas de la Comisión Reguladora de Telecomunicaciones en Planes y Legal, y dirección de El Botadero en el footer. Textos tomados de redixc.net el 19/10/2026. |
| Recomendador | Desde Inicio lleva a `/planes` con la tarjeta sugerida a la vista y el foco en «Consultar este plan». Texto: «… personas conectadas a la vez, para trabajar y estudiar». La fórmula no cambió. |
| Planes | Las 6 tarjetas van primero. El recomendador queda plegado después de ellas. Se retiran filtros, casillas y bandeja de comparación; en su lugar, la tabla «Los 6 planes de un vistazo». |
| Cobertura | Una sola acción: un botón por localidad que abre la consulta con la localidad elegida. Sin selector ni botones duplicados. |
| Cabecera móvil | WhatsApp muestra su texto; el selector de tema pasa al final del menú («Apariencia»). Se revierte quitando la clase `header-compact` en `src/site/App.jsx`. |
| Tipografía | Ningún texto visible por debajo de 12 px (antes 8–11 px en etiquetas, diálogo y footer). Nombre del plan a 15–16 px en negrita. |
| Diálogo | Se cierra en ≤ 350 ms (antes 720–912 ms). Sin «Desliza para cerrar» (la agarradera y el botón ✕ siguen). |
| Imagen | Planes usa `hero-planes-eleccion.webp`: una señora y su hijo eligen un plan en casa. Generada con Codex siguiendo las fotos de la campaña; no representa clientes reales. |
| Selectores | Sin desplegables nativos: en la consulta, la localidad se elige con cuatro fichas (2 × 2) y en el recomendador las personas con un control segmentado «1-2 · 3-4 · 5+». Son radios nativos, con flechas del teclado y lector de pantalla. |
| Otros | Inicio conserva el título SEO de `index.html`; `fetchpriority` sin aviso de React. |

## Movimiento: actual frente a propuesto

Con `?movimiento=actual` la propuesta mantiene las animaciones de hoy. Con `?movimiento=propuesto`:

- El hero se muestra completo desde el primer fotograma.
- Las fotos y los grupos de tarjetas acompañan el scroll con CSS (`animation-timeline: view()`, 8 px, opacidad 0.4→1). Los títulos y el texto nunca se ocultan, y un salto directo a una sección la muestra completa (con el movimiento actual queda en opacidad 0 hasta que actúa el observador).
- Sin elevación al pasar el cursor por tarjetas que no son botones.
- En escritorio, el diálogo crece desde el botón que lo abrió y vuelve a él (200 ms). En móvil sigue siendo la hoja inferior.
- El contorno del plan recomendado aparece al llegar, y la frase que cambia en el mensaje de WhatsApp se resalta 600 ms.

### Expresivo (`?movimiento=expresivo`, opción por defecto del comparador)

Parte de «sobrio» (nada queda invisible, sin elevación en tarjetas estáticas) y añade:

1. En escritorio, la tarjeta o el botón que abre la consulta se transforma en el diálogo y vuelve a su sitio al cerrar (View Transitions; en móvil sigue la hoja con arrastre).
2. El resultado del recomendador viaja hasta la tarjeta del plan en `/planes`.
3. Un único momento en el hero por sesión: la foto se asienta (escala 1.03→1) y el titular entra por líneas.
4. Cambio de tema con fundido de 300 ms.
5. Plegables y preguntas frecuentes con altura animada, reversibles a mitad de camino; el + gira.
6. Entradas al scroll por tarjeta y foto (20 px, escala .97→1), nunca invisibles tras un salto.
7. Menú móvil en cascada.
8. Respuesta al pulsar con resorte en localidades y botones de la tabla.

Con movimiento reducido no hay View Transitions ni desplazamientos. Sin soporte de View Transitions (navegadores antiguos), los cambios son inmediatos.

El usuario eligió el movimiento expresivo: `src/App.tsx` usa `motion="expressive"`. En el comparador, la propuesta sin parámetro sigue mostrando el movimiento actual para poder comparar.

## Pendiente de validar con el negocio

Eslogan confirmado: «La fibra que te une al mundo.» (redixc.net aún dice «te conecta»).


Cobertura en la cabecera municipal de Santiago Ixcuintla, criterios del recomendador, costo de instalación y horarios de atención.

## Decisiones del usuario que la propuesta contradice

- V4: selector de tema en la cabecera tras WhatsApp → aquí pasa al menú en móvil.
- Footer móvil con texto legal de 10 px → aquí 13 px.
