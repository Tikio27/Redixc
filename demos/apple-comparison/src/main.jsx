import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
const variant = location.pathname.split("/")[1];
if (variant === "historia")
  location.replace(
    location.pathname.replace(/^\/historia/, "/emil") +
      location.search +
      location.hash,
  );
async function start() {
  if (variant === "historia") return;
  if (["actual", "propuesta", "emil"].includes(variant)) {
    const theme = new URLSearchParams(location.search).get("tema");
    if (["light", "dark", "system"].includes(theme))
      localStorage.setItem(
        variant === "actual" ? "redixc-theme" : "redixc-proposal-theme",
        theme,
      );
    await import("../../../src/site/styles.css");
    if (variant !== "actual") await import("./proposal.css");
    if (variant === "emil") await import("./emil.css");
    const { App } =
      variant === "actual"
        ? await import("./CurrentSnapshot.jsx")
        : await import("./Proposal.jsx");
    createRoot(document.getElementById("root")).render(
      <BrowserRouter basename={`/${variant}`}>
        <App fluid={variant === "emil"} />
      </BrowserRouter>,
    );
  } else {
    await import("./comparison.css");
    createRoot(document.getElementById("root")).render(<Comparison />);
  }
}
start();
const pages = [
  ["/", "Inicio"],
  ["/planes", "Planes"],
  ["/cobertura", "Cobertura"],
  ["/nosotros", "Nosotros"],
  ["/ayuda", "Ayuda"],
  ["/legal", "Legal"],
];
function Preview({ variant, route, theme, device }) {
  const host = useRef(null),
    [size, setSize] = useState({ width: 600, height: 800 });
  const width = device === "mobile" ? 390 : 1440,
    scale = Math.min(size.width / width, 1),
    url = `/${variant}${route}?tema=${theme}`;
  useEffect(() => {
    const observer = new ResizeObserver(([e]) =>
      setSize({ width: e.contentRect.width, height: e.contentRect.height }),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="preview-panel">
      <div className="panel-label">
        <div>
          <i className={variant} />
          <strong>
            {variant === "actual"
              ? "Rediseño actual"
              : variant === "historia"
                ? "Narrativa · al hacer scroll"
                : variant === "emil"
                  ? "Emil · interacción fluida"
                  : "Propuesta · claridad local"}
          </strong>
        </div>
        <a href={url} target="_blank" rel="noreferrer">
          Abrir completa ↗
        </a>
      </div>
      <div className={`preview-mat ${device}`} ref={host}>
        <div
          className="frame-bounds"
          style={{ width: width * scale, height: size.height }}
        >
          <iframe
            key={url}
            title={
              variant === "actual"
                ? "Rediseño actual de Redixc"
                : "Propuesta de mejora Redixc"
            }
            src={url}
            style={{
              width,
              height: size.height / scale,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
function Comparison() {
  const [route, setRoute] = useState("/"),
    [theme, setTheme] = useState("light"),
    [device, setDevice] = useState("desktop"),
    [view, setView] = useState("split"),
    [notes, setNotes] = useState(false),
    [candidate, setCandidate] = useState("emil");
  const group = (label, values, value, set) => (
    <div className="segmented" role="group" aria-label={label}>
      {values.map(([k, v]) => (
        <button key={k} aria-pressed={value === k} onClick={() => set(k)}>
          {v}
        </button>
      ))}
    </div>
  );
  return (
    <div className="comparison-app">
      <header className="review-header">
        <a className="review-brand" href="/">
          <img src="/assets/logo-mark-blue.svg" alt="Redixc" />
          <span>
            Estudio de diseño<small>Comparativa local</small>
          </span>
        </a>
        <div className="review-title">
          <span>MISMA IDENTIDAD. UNA DECISIÓN MÁS SENCILLA.</span>
          <h1>
            Actual vs.{" "}
            {candidate === "historia"
              ? "narrativa"
              : candidate === "emil"
                ? "Emil"
                : "propuesta"}
          </h1>
        </div>
        <button
          className="notes-toggle"
          onClick={() => setNotes(!notes)}
          aria-expanded={notes}
          aria-controls="design-notes"
        >
          {notes ? "Cerrar criterios −" : "Qué comparar +"}
        </button>
      </header>
      <div className="review-toolbar" aria-label="Controles de comparación">
        <label className="page-picker">
          Página
          <select value={route} onChange={(e) => setRoute(e.target.value)}>
            {pages.map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        {group(
          "Tamaño de pantalla",
          [
            ["desktop", "Escritorio"],
            ["mobile", "Móvil"],
          ],
          device,
          setDevice,
        )}
        {group(
          "Tema de las vistas",
          [
            ["light", "Claro"],
            ["dark", "Oscuro"],
            ["system", "Sistema"],
          ],
          theme,
          setTheme,
        )}
        <label className="page-picker">
          Variante
          <select
            value={candidate}
            onChange={(event) => setCandidate(event.target.value)}
          >
            <option value="emil">Emil · interacción fluida</option>
            <option value="propuesta">Claridad local · HIG</option>
          </select>
        </label>
        {group(
          "Modo de comparación",
          [
            ["split", "Lado a lado"],
            ["actual", "Actual"],
            ["propuesta", "Variante"],
          ],
          view,
          setView,
        )}
      </div>
      {notes && (
        <aside className="design-notes" id="design-notes">
          <div>
            <span>01 · COMPRENDER</span>
            <h2>Oferta y contexto al entrar</h2>
            <p>
              Fibra óptica, Santiago Ixcuintla y precio desde el hero. La
              familia sigue al centro de la identidad.
            </p>
          </div>
          <div>
            <span>02 · ELEGIR</span>
            <h2>Planes antes del cuestionario</h2>
            <p>
              Precio, subida y consulta directa. Recomendador opcional con
              personas conectadas a la vez.
            </p>
          </div>
          <div>
            <span>03 · CONTACTAR</span>
            <h2>Una conversación preparada</h2>
            <p>
              Consulta con contexto, soporte con descripción del problema y
              cobertura por confirmar. Foco visible y controles cómodos.
            </p>
          </div>
          <p className="notes-source">
            {candidate === "emil"
              ? "Emil: misma base visual de Claridad local, respuesta al presionar y diálogo móvil que puedes arrastrar, detener y cerrar. Sin dependencias nuevas. "
              : "Principios: jerarquía, claridad, accesibilidad y movimiento útil. "}
            Precios contrastados con redixc.net el 18/10/2026. Cobertura e
            instalación requieren confirmación del equipo.
          </p>
        </aside>
      )}
      <main className={`preview-grid view-${view}`}>
        {view !== "propuesta" && (
          <Preview
            variant="actual"
            route={route}
            theme={theme}
            device={device}
          />
        )}
        {view !== "actual" && (
          <Preview
            variant={candidate}
            route={route}
            theme={theme}
            device={device}
          />
        )}
      </main>
      <footer className="review-footer">
        <span>● Demo local · Sin publicación</span>
        <span>
          {device === "desktop"
            ? "Vista de 1440 px ajustada al panel"
            : "Vista móvil de 390 px"}{" "}
          · Navegación independiente · Cambiar página o tema reinicia las vistas
        </span>
      </footer>
    </div>
  );
}
