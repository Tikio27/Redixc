import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const variant = location.pathname.split("/")[1];
const params = new URLSearchParams(location.search);

async function start() {
  if (variant === "actual" || variant === "propuesta") {
    // Both variants share this origin and localStorage, so the theme is passed
    // as a prop: concurrent panels never read each other's stored value.
    const tema = params.get("tema");
    const theme = ["light", "dark", "system"].includes(tema) ? tema : undefined;
    let App;
    if (variant === "actual") {
      // Cascade order matters: same order as src/index.css.
      await import("../actual/styles.css");
      await import("../actual/refinements.css");
      await import("../actual/motion.css");
      await import("../actual/community.css");
      ({ App } = await import("../actual/App.jsx"));
    } else {
      await import("../../../src/index.css");
      ({ App } = await import("../../../src/site/App.jsx"));
    }
    const motion =
      { propuesto: "purposeful", expresivo: "expressive" }[
        params.get("movimiento")
      ] || "current";
    // Each comparator load is a first visit: replay the one-per-session hero.
    sessionStorage.removeItem("redixc-hero-moment");
    createRoot(document.getElementById("root")).render(
      <BrowserRouter basename={`/${variant}`}>
        <App motion={motion} initialTheme={theme} />
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

function Preview({ variant, route, theme, device, motion, replay }) {
  const host = useRef(null),
    [size, setSize] = useState({ width: 600, height: 800 });
  const width = device === "mobile" ? 390 : 1440,
    scale = Math.min(size.width / width, 1),
    url =
      `/${variant}${route}?tema=${theme}` +
      (variant === "propuesta" ? `&movimiento=${motion}` : "");
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
          <i className={variant === "actual" ? "actual" : "emil"} />
          <strong>
            {variant === "actual"
              ? "Versión actual"
              : `Propuesta · claridad (movimiento ${motion})`}
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
            key={`${url}#${replay}`}
            title={
              variant === "actual"
                ? "Versión actual de Redixc"
                : "Propuesta de claridad de Redixc"
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
    [motion, setMotion] = useState("expresivo"),
    [replay, setReplay] = useState(0);
  const group = (label, values, value, set) => (
    <div className="segmented" role="group" aria-label={label}>
      {values.map(([k, v]) => (
        <button key={k} aria-pressed={value === k} onClick={() => set(k)}>
          {v}
        </button>
      ))}
    </div>
  );
  const preview = (v) => (
    <Preview
      variant={v}
      route={route}
      theme={theme}
      device={device}
      motion={motion}
      replay={replay}
    />
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
          <span>CLARIDAD PARA ELEGIR Y CONTACTAR</span>
          <h1>Actual vs. propuesta</h1>
        </div>
        <button className="notes-toggle" onClick={() => setReplay(replay + 1)}>
          Repetir animaciones ↻
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
          ],
          theme,
          setTheme,
        )}
        {group(
          "Movimiento de la propuesta",
          [
            ["actual", "Movimiento actual"],
            ["propuesto", "Sobrio"],
            ["expresivo", "Expresivo"],
          ],
          motion,
          setMotion,
        )}
        {group(
          "Modo de comparación",
          [
            ["split", "Lado a lado"],
            ["actual", "Actual"],
            ["propuesta", "Propuesta"],
          ],
          view,
          setView,
        )}
      </div>
      <main className={`preview-grid view-${view}`}>
        {view !== "propuesta" && preview("actual")}
        {view !== "actual" && preview("propuesta")}
      </main>
      <footer className="review-footer">
        <span>● Demo local · Sin publicación</span>
        <span>
          {device === "desktop"
            ? "Vista de 1440 px ajustada al panel"
            : "Vista móvil de 390 px"}{" "}
          · Navegación independiente · Cambiar página, tema o movimiento
          reinicia las vistas
        </span>
      </footer>
    </div>
  );
}
