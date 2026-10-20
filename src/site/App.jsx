import { CommunityStory } from "./CommunityStory";
import { MotionPanel } from "./MotionPanel";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useId,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFluidControls, useFluidSheet } from "./fluidMotion";
import {
  canTransition,
  startTransition,
  useDisclosureMotion,
  useHeroMoment,
  useMenuCascade,
} from "./expressiveMotion";
import {
  plans,
  locales,
  documents,
  recommendPlan,
  formatoUrl,
  IFT_VISOR_URL,
  ADDRESS,
  MAPS_URL,
  MURAL_SOURCE_URL,
  PORTAL_URL,
  HOLDER_NAME_MAX,
  validateHolderName,
  adminWhatsappUrl,
} from "./plans";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  WifiHigh as Wifi,
  WhatsappLogo,
  Sun,
  Moon,
  Desktop,
  List,
  X,
  Check,
  UploadSimple,
  Laptop,
  GraduationCap,
  PlayCircle,
  House,
  CalendarCheck,
  Headset,
  ShieldCheck,
  CaretDown,
  Plus,
  FileText,
  Copy,
  CheckCircle,
  UserCircle,
  Users,
  Heart,
  Phone,
  Envelope,
  RadioButton,
  Tag,
  Wrench,
} from "@phosphor-icons/react";

const faqs = [
  [
    "¿Cómo puedo saber si llega a mi casa?",
    "Selecciona tu localidad y prepara una consulta para nuestro equipo. La disponibilidad se confirma para tu domicilio antes de contratar.",
  ],
  [
    "¿Cuál es el plan adecuado para mí?",
    "Depende de cuántas personas y dispositivos se conectan al mismo tiempo y de lo que hacen en internet. El recomendador es una orientación inicial; nuestro equipo puede ayudarte a decidir.",
  ],
  [
    "¿Cuánto cuesta la instalación?",
    "El costo y las condiciones de instalación se confirman al revisar tu domicilio. Solicita la información antes de contratar.",
  ],
  [
    "¿Qué velocidad de subida tiene mi plan?",
    "Cada plan muestra por separado su velocidad de descarga y subida. En la página Planes puedes consultar ambas y abrir su formato simplificado.",
  ],
  [
    "¿Cómo reporto un problema con mi servicio?",
    "Puedes contactar al equipo por WhatsApp al 311 144 7676. Ten a la mano tu nombre, localidad y una descripción de lo que ocurre.",
  ],
  [
    "¿Necesito un contrato de plazo forzoso?",
    "El servicio es mes a mes, sin plazo forzoso. Consulta el contrato y confirma las condiciones aplicables antes de contratar.",
  ],
];
const pageNames = {
  inicio: "Inicio",
  planes: "Planes",
  cobertura: "Cobertura",
  nosotros: "Nosotros",
  ayuda: "Ayuda",
  legal: "Legal",
};
const paths = {
  inicio: "/",
  planes: "/planes",
  cobertura: "/cobertura",
  nosotros: "/nosotros",
  ayuda: "/ayuda",
  legal: "/legal",
};
function getRoute(pathname) {
  const page = Object.keys(paths).find(
    (key) =>
      paths[key] === pathname.replace(/\/$/, "") ||
      (key === "inicio" && pathname === "/"),
  );
  return { page: page || "notFound" };
}

// Motion: purposeful foundations (motion-purposeful.css: nothing hidden, no
// hover lift on static cards) plus the expressive transitions in
// expressiveMotion.js and motion-expressive.css.
function App() {
  const fluid = true;
  const location = useLocation();
  const navigate = useNavigate();
  const route = useMemo(() => getRoute(location.pathname), [location.pathname]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("redixc-theme") || "system",
  );
  const [systemDark, setSystemDark] = useState(
    matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [openPlanDetails, setOpenPlanDetails] = useState([]);
  const dark = theme === "dark" || (theme === "system" && systemDark);
  const family = true;
  useEffect(() => {
    setMenu(false);
    setContact(null);
    const target = location.state?.focusPlan;
    if (target) requestAnimationFrame(() => focusPlan(target));
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("redixc-theme", theme);
  }, [dark, theme]);
  useEffect(() => {
    const m = matchMedia("(prefers-color-scheme: dark)");
    const f = (e) => setSystemDark(e.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  useEffect(() => {
    // Inicio keeps the full SEO title from index.html.
    const title =
      route.page === "inicio"
        ? "REDIXC - Internet de Fibra Óptica en Santiago Ixcuintla | Planes 30-150 Mbps"
        : `${pageNames[route.page] || "Página no encontrada"} · REDIXC`;
    const descriptions = {
      inicio:
        "Internet de fibra óptica en Santiago Ixcuintla. Planes de 30 a 150 Mbps, precios con impuestos incluidos y atención local.",
      planes:
        "Compara los planes de internet Redixc, velocidades de subida y bajada, precios y documentos del servicio.",
      cobertura:
        "Consulta la disponibilidad de internet de fibra óptica para tu domicilio en Santiago Ixcuintla y localidades cercanas.",
      nosotros:
        "Conoce Redixc: fibra óptica y atención cercana para hogares y negocios de Santiago Ixcuintla.",
      ayuda:
        "Contacta a Redixc para contratar internet o recibir soporte por teléfono y WhatsApp.",
      legal:
        "Consulta los contratos, derechos de los usuarios y documentos del servicio de Redixc.",
    };
    const url = `https://redixc.net${paths[route.page] || location.pathname}`;
    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      document.querySelector(selector)?.setAttribute("content", title);
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document
        .querySelector(selector)
        ?.setAttribute(
          "content",
          descriptions[route.page] ||
            "Encuentra tu próxima conexión con Redixc.",
        );
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", url);
  }, [route, location.pathname]);
  useFluidControls(
    fluid,
    route,
    ".motion-expressive :is(.locality-list button,.plan-table button)",
  );
  useHeroMoment(true, route);
  useDisclosureMotion(true, route);
  useMenuCascade(true, menu);
  const changeTheme = (next) =>
    startTransition(
      true,
      () => setTheme(next),
      () => {
        document.documentElement.dataset.theme =
          next === "dark" || (next === "system" && systemDark) ? "dark" : "light";
      },
    );
  const href = (p = "inicio") => paths[p] || "/";
  // Brings a plan card into view below the sticky header and focuses its action.
  const focusPlan = (name) => {
    const card = document.querySelector(`[data-plan="${name}"]`);
    if (!card) return;
    card.scrollIntoView({ block: "center", behavior: "instant" });
    card.querySelector(".plan-button")?.focus({ preventScroll: true });
  };
  // Safari does not focus buttons on click, so remember the last pressed
  // control as the dialog's origin when focus stays on <body>.
  const lastPressed = useRef(null);
  useEffect(() => {
    const press = (e) => (lastPressed.current = e.target.closest?.("button, a"));
    document.addEventListener("pointerdown", press, true);
    return () => document.removeEventListener("pointerdown", press, true);
  }, []);
  const openContact = (plan = null, locality = "", kind = "contratación") => {
    const focused = document.activeElement;
    const source =
      focused && focused !== document.body ? focused : lastPressed.current;
    const next = {
      plan,
      locality,
      kind,
      origin: source?.getBoundingClientRect() || null,
    };
    // Desktop: the card (or button) that opened it becomes the dialog.
    const morphFrom = source?.closest(".plan") || source;
    if (
      morphFrom &&
      canTransition() &&
      matchMedia("(min-width: 601px)").matches
    ) {
      // Never leave two elements with the same name (e.g. after an aborted close).
      document
        .querySelectorAll(".app [style*='view-transition-name']")
        .forEach((el) => (el.style.viewTransitionName = ""));
      morphFrom.style.viewTransitionName = "contact-morph";
      startTransition(true, () => {
        morphFrom.style.viewTransitionName = "";
        setContact({ ...next, morphFrom });
      });
    } else setContact(next);
  };
  // One plan card for every page, fed by plans.js. Both variants share the
  // head (name and download speed left, price right). Summary cards (Inicio,
  // Cobertura) follow with upload, description and button; the full card
  // (Planes) with description, upload, button and its documents. On phones
  // the full card folds description, use and documents into «Detalles del
  // plan»: the description is rendered in both places and CSS shows one, so
  // the DOM order always matches what is on screen.
  const planCard = (p, full = false) => {
    const detailsOpen = openPlanDetails.includes(p.name);
    const detailsId = `plan-detalles-${p.ift}`;
    const isRecommended = recommended === p.name;
    const summary = (
      <>
        <p className="plan-description">{p.desc}</p>
        {full && <p className="plan-use">{p.use}</p>}
      </>
    );
    const upload = (
      <p className={full ? "plan-up" : "plan-up preview-upload"}>
        {full && <UploadSimple size={16} aria-hidden="true" />}
        {p.up} Mbps de subida
      </p>
    );
    const buttonLabel = full ? "Consultar este plan" : "Consultar plan";
    return (
      <article
        className={`plan ${isRecommended ? "recommended" : ""} ${detailsOpen ? "details-open" : ""}`}
        key={p.name}
        data-plan={p.name}
      >
        {isRecommended && (
          <p className="recommend-label">
            <Check size={14} aria-hidden="true" /> Tu recomendación
          </p>
        )}
        <div className="plan-head">
          <div className="plan-head-main">
            <div className="plan-top">
              <span className="eyebrow">{p.name}</span>
            </div>
            <h3>
              <span>{p.down}</span> <small>Mbps</small>{" "}
              <small className="plan-down-label">de bajada</small>
            </h3>
          </div>
          <p className="plan-price">
            ${p.price}
            <small className="plan-unit">MXN / mes</small>
            {full && <small className="plan-tax">Impuestos incluidos</small>}
          </p>
        </div>
        {full ? (
          <>
            <div className="plan-summary">{summary}</div>
            {upload}
          </>
        ) : (
          <>
            {upload}
            {summary}
          </>
        )}
        <button
          className="button plan-button"
          aria-label={`${buttonLabel} ${p.name}`}
          onClick={() => openContact(p)}
        >
          {buttonLabel} <ArrowRight size={17} aria-hidden="true" />
        </button>
        {full && (
          <>
            <button
              type="button"
              className="plan-details-toggle"
              aria-expanded={detailsOpen}
              aria-controls={detailsId}
              aria-label={`Detalles del plan ${p.name}`}
              onClick={() =>
                setOpenPlanDetails((open) =>
                  open.includes(p.name)
                    ? open.filter((name) => name !== p.name)
                    : [...open, p.name],
                )
              }
            >
              Detalles del plan
              <CaretDown size={16} aria-hidden="true" />
            </button>
            <div className="plan-details" id={detailsId}>
              <div className="plan-details-summary">{summary}</div>
              <div className="plan-foot">
                <a
                  href={formatoUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Formato de información simplificada de ${p.name}`}
                >
                  Ficha del plan <ArrowUpRight size={13} />
                </a>
                <span className="plan-ift">Folio de inscripción: {p.ift}</span>
              </div>
            </div>
          </>
        )}
      </article>
    );
  };
  const hero = (
    <section className={`hero shell ${family ? "hero-family" : "hero-fiber"}`}>
      {!family && (
        <picture className="fiber-visual">
          <img
            src={`/assets/fiber-faithful-${dark ? "dark" : "light"}.webp`}
            alt="Filamentos de fibra óptica iluminados en azul"
          />
        </picture>
      )}
      {family && (
        // Phones show the approved photo before the copy; DOM order matches
        // the visual order, and only one of the two hero images is rendered.
        <picture className="family-visual-mobile">
          <img
            src="/assets/hero-planes.webp"
            alt="Familia compartiendo un momento con una laptop en casa"
            width="1200"
            height="800"
            fetchpriority="high"
          />
        </picture>
      )}
      <div className="hero-copy">
        <span className="eyebrow hero-eyebrow">
          FIBRA ÓPTICA · SANTIAGO IXCUINTLA
        </span>
        <h1>
          {family ? (
            <>
              Internet para lo que pasa <em>en tu casa.</em>
            </>
          ) : (
            <>
              Tu mundo,
              <br />
              <em>mejor conectado.</em>
            </>
          )}
        </h1>
        <p>
          Internet de fibra óptica para tu hogar, con atención local en Santiago
          Ixcuintla y localidades cercanas.
        </p>
        <div className="hero-offer">
          <strong>
            Desde $300<span> MXN / mes</span>
          </strong>
          <span>Planes de 30 a 150 Mbps · Impuestos incluidos</span>
        </div>
        <div className="hero-buttons">
          <Link className="button" to={href("cobertura")}>
            Consultar cobertura <ArrowRight size={19} />
          </Link>
          <Link className="button secondary" to={href("planes")}>
            Ver planes y precios
          </Link>
        </div>
        <p className="hero-footnote">
          Disponibilidad y costo de instalación sujetos a revisión de tu
          domicilio.
        </p>
      </div>
      {family && (
        <div className="family-visual">
          <picture>
            <source
              media="(max-width: 600px)"
              srcSet="/assets/hero-planes.webp"
            />
            <img
              src="/assets/hero-planes.webp"
              alt="Familia compartiendo un momento con una laptop en casa"
              fetchpriority="high"
            />
          </picture>
        </div>
      )}
    </section>
  );
  return (
    <div
      className={`app family fiber hybrid header-compact emil motion-purposeful motion-expressive ${route.page === "inicio" ? "homepage-v5" : ""} page-${route.page}`}
    >
      <a
        href="#contenido"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("contenido").focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="header">
        <div className="shell header-inner">
          <Link to={href()} className="brand" aria-label="Redixc, inicio">
            <img
              src={`/assets/logo-mark-${dark ? "white" : "blue"}.svg`}
              alt="REDIXC"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {["planes", "cobertura", "nosotros", "ayuda"].map((p) => (
              <Link
                key={p}
                to={href(p)}
                aria-current={route.page === p ? "page" : undefined}
              >
                {pageNames[p]}
              </Link>
            ))}
            <a
              className="nav-portal"
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
            >
              <UserCircle size={19} aria-hidden="true" />
              Portal de clientes
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </nav>
          <div className="header-actions">
            <a
              className="header-portal"
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
            >
              <UserCircle size={18} aria-hidden="true" />
              Portal de clientes
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            <button
              className="whatsapp-nav"
              aria-label="Preparar consulta por WhatsApp"
              onClick={() => openContact()}
            >
              <WhatsappLogo size={21} aria-hidden="true" /> <span>Escríbenos</span>
            </button>
            <ThemeControl theme={theme} setTheme={changeTheme} />
            <button
              className="icon-button menu-toggle"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menu}
              onKeyDown={(event) => {
                if (event.key === "Escape") setMenu(false);
              }}
              aria-controls="mobile-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={24} /> : <List size={25} />}
            </button>
          </div>
        </div>
        <MotionPanel enabled={fluid} open={menu} kind="menu">
          <nav
            id="mobile-navigation"
            className="mobile-nav shell"
            aria-label="Menú móvil"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMenu(false);
                document.querySelector(".menu-toggle")?.focus();
              }
            }}
          >
            {Object.entries(pageNames).map(([k, v]) => (
              <Link
                key={k}
                to={href(k)}
                aria-current={route.page === k ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                {v}
                <ArrowRight size={17} />
              </Link>
            ))}
            <a
              className="mobile-nav-portal"
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenu(false)}
            >
              <span>
                Portal de clientes
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </span>
              <ArrowUpRight size={17} />
            </a>
            <div className="mobile-appearance">
              <span aria-hidden="true">Apariencia</span>
              <ThemeControl theme={theme} setTheme={changeTheme} />
            </div>
          </nav>
        </MotionPanel>
      </header>
      <main id="contenido" tabIndex={-1}>
        {route.page === "inicio" && (
          <>
            {hero}
            <HomeBenefits />
            <section className="section shell home-plans" id="home-plans">
              <div className="section-heading centered">
                <h2>Nuestros planes de internet</h2>
                <p>Precios en MXN al mes, con impuestos incluidos.</p>
              </div>
              <div className={`plans-grid preview-plans`}>
                {[plans[0], plans[2], plans[4]].map((p) =>
                  planCard(p),
                )}
              </div>
              <div className="plans-note">
                <Link className="text-link" to={href("planes")}>
                  Ver los 6 planes <ArrowRight size={18} />
                </Link>
              </div>
            </section>
            <div className="shell hero-after">
              <Recommender
                fluid={fluid}
                compact
                onRecommend={(p, resultCard) => {
                  const go = () => {
                    setRecommended(p.name);
                    navigate(href("planes"), { state: { focusPlan: p.name } });
                  };
                  if (!resultCard || !canTransition()) return go();
                  // The result card travels to the plan card on /planes.
                  resultCard.style.viewTransitionName = "reco-morph";
                  let card;
                  startTransition(true, go, () => {
                    resultCard.style.viewTransitionName = "";
                    card = document.querySelector(`[data-plan="${p.name}"]`);
                    if (card) card.style.viewTransitionName = "reco-morph";
                    focusPlan(p.name);
                  })?.finished.finally(() => {
                    if (card) card.style.viewTransitionName = "";
                  });
                }}
              />
            </div>
            <section
              className="connection-steps shell"
              aria-labelledby="steps-title"
            >
              <div className="section-heading centered">
                <h2 id="steps-title">Cómo contratar</h2>
                <p>
                  Primero revisamos la cobertura de tu domicilio; después eliges
                  plan y acordamos la instalación.
                </p>
              </div>
              <ol className="connection-step-grid">
                {[
                  [
                    House,
                    "Confirma tu cobertura",
                    "Selecciona tu localidad. Revisamos si podemos conectar tu domicilio.",
                    "Consultar cobertura",
                    "cobertura",
                  ],
                  [
                    FileText,
                    "Elige tu plan",
                    "Compara velocidades y precios. Si lo necesitas, te ayudamos a decidir.",
                    "Ver los planes",
                    "planes",
                  ],
                  [
                    Wrench,
                    "Agenda tu instalación",
                    "Con la cobertura confirmada, acordamos contigo la fecha y las condiciones.",
                    "Hablar con Redixc",
                    null,
                  ],
                ].map(([Icon, title, desc, label, page], i) => (
                  <li key={title}>
                    <div className="connection-step-top">
                      <span className="connection-step-number">
                        Paso {i + 1}
                      </span>
                      <Icon size={36} weight="light" aria-hidden="true" />
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    {page ? (
                      <Link className="connection-step-action" to={href(page)}>
                        {label}
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <button
                        className="connection-step-action"
                        onClick={() => openContact()}
                      >
                        {label}
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </li>
                ))}
              </ol>
              <p className="fineprint centered">
                La disponibilidad de instalación y las condiciones se confirman
                con nuestro equipo.
              </p>
            </section>
            <section
              className="home-written shell"
              aria-labelledby="written-title"
            >
              <h2 id="written-title">Lo que contratas, por escrito</h2>
              <div className="home-written-body">
                {/* Names as they appear in the published documents. */}
                <ul>
                  {[
                    [
                      Tag,
                      "Precio con impuestos incluidos y velocidad de bajada y subida de cada plan.",
                    ],
                    [
                      FileText,
                      "Formato de información simplificada y folio de inscripción de cada tarifa.",
                    ],
                    [
                      ShieldCheck,
                      "Contrato de adhesión registrado ante Profeco y Carta de derechos mínimos de los usuarios.",
                    ],
                  ].map(([Icon, text]) => (
                    <li key={text}>
                      <Icon size={28} weight="light" aria-hidden="true" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="hero-buttons">
                  <Link className="button" to={href("planes")}>
                    Comparar planes <ArrowRight size={18} />
                  </Link>
                  <Link className="button secondary" to={href("legal")}>
                    Consultar documentos
                  </Link>
                </div>
              </div>
            </section>
            <section
              className="home-attention shell"
              aria-labelledby="attention-title"
            >
              <figure>
                <img
                  src="/assets/community/aguilas-redixc.jpg"
                  alt="Mural azul de Redixc con el teléfono 311 144 7676 en el espacio deportivo de El Botadero"
                  loading="lazy"
                  width="1280"
                  height="960"
                />
                <figcaption>
                  Mural de Redixc en el espacio deportivo de El Botadero · Foto:{" "}
                  <a href={MURAL_SOURCE_URL} target="_blank" rel="noreferrer">
                    Águilas del Botadero
                  </a>
                </figcaption>
              </figure>
              <div className="home-attention-copy">
                <h2 id="attention-title">
                  Atención por teléfono, WhatsApp o en persona
                </h2>
                <p>Elige tu localidad para preparar tu consulta por WhatsApp.</p>
                <div className="locality-list">
                  {locales.map((l) => (
                    <button key={l} onClick={() => openContact(null, l)}>
                      <MapPin size={20} aria-hidden="true" />
                      {l}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <p className="coverage-disclaimer">
                  <ShieldCheck size={18} aria-hidden="true" />
                  Seleccionar una localidad no confirma cobertura: la revisamos
                  para tu domicilio.
                </p>
                <div className="home-attention-contact">
                  <a className="home-help-phone" href="tel:+523111447676">
                    <Phone size={26} weight="light" aria-hidden="true" />
                    311 144 7676
                  </a>
                  <address>
                    <MapPin size={20} aria-hidden="true" />
                    <span>
                      Punto de atención: {ADDRESS}
                    </span>
                  </address>
                  <a
                    className="button secondary"
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cómo llegar <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </section>
            <section className="section shell faq-section home-faq">
              <div className="section-heading">
                <h2>Preguntas frecuentes</h2>
              </div>
              <Faq
                items={[
                  [
                    "¿Cómo puedo saber si hay cobertura en mi domicilio?",
                    faqs[0][1],
                  ],
                  faqs[2],
                  [
                    "¿Qué tipo de soporte ofrecen?",
                    "Te atienden técnicos locales. Contacta al equipo por teléfono o WhatsApp al 311 144 7676 y comparte tu nombre, localidad y una descripción de lo que ocurre.",
                  ],
                ]}
              />
            </section>
          </>
        )}
        {route.page === "planes" && (
          <>
            <PageIntro
              page={route.page}
              title="Planes de internet"
              text="Desde $300 MXN al mes, con impuestos incluidos. Compara velocidades y consulta la disponibilidad para tu domicilio."
            />
            <section className="section shell" id="todos-planes">
              <details className="recommender-disclosure">
                <summary>
                  ¿No sabes cuál elegir? Te ayudamos a orientarte
                  <CaretDown size={18} aria-hidden="true" />
                </summary>
                <Recommender
                  fluid={fluid}
                  inDisclosure
                  onRecommend={(p) => {
                    setRecommended(p.name);
                    requestAnimationFrame(() => focusPlan(p.name));
                  }}
                />
              </details>
              <div className="plan-filter-row">
                <h2>Compara los 6 planes</h2>
              </div>
              <div className="plans-grid all-plans">
                {plans.map((p) => planCard(p, true))}
              </div>
              <p className="fineprint">
                Precios mensuales en MXN, con impuestos incluidos. Consulta las
                condiciones de instalación y disponibilidad antes de contratar.
                Para mayor información respecto a las tarifas puede consultar el{" "}
                <a href={IFT_VISOR_URL} target="_blank" rel="noreferrer">
                  visor de tarifas de la Comisión Reguladora de Telecomunicaciones
                </a>.
              </p>
              <PlanTable openContact={openContact} />
              <div className="benefits-line">
                <span>
                  <CheckCircle /> Servicio mes a mes*
                </span>
                <span>
                  <Headset /> Atención local
                </span>
                <Link to={href("legal")}>
                  Consulta condiciones <ArrowUpRight />
                </Link>
              </div>
              <p className="fineprint">
                *Consulta las condiciones en el contrato del servicio.
              </p>
            </section>
            <ContactBanner openContact={openContact} />
          </>
        )}
        {route.page === "cobertura" && (
          <>
            <PageIntro
              page={route.page}
              title="Cobertura por localidad"
              text="Cuéntanos dónde necesitas internet. Nuestro equipo confirmará la disponibilidad para tu domicilio."
            />
            <section className="shell coverage-page">
              <div className="coverage-panel">
                <div className="card-heading">
                  <span className="card-heading-icon" aria-hidden="true">
                    <MapPin size={30} weight="light" />
                  </span>
                  <h2>¿Dónde quieres conectarte?</h2>
                </div>
                <p>
                  Elige tu localidad para preparar tu consulta por WhatsApp.
                </p>
                <div className="locality-list">
                  {locales.map((l) => (
                    <button key={l} onClick={() => openContact(null, l)}>
                      <MapPin size={20} aria-hidden="true" />
                      {l}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <p className="coverage-disclaimer">
                  <ShieldCheck size={18} aria-hidden="true" />
                  Seleccionar una localidad no confirma cobertura: la revisamos
                  para tu domicilio.
                </p>
              </div>
              <aside className="coverage-info" aria-labelledby="steps-coverage">
                <h2 id="steps-coverage">Así confirmamos tu cobertura</h2>
                <ol className="coverage-steps">
                  {[
                    [
                      MapPin,
                      "Elige tu localidad",
                      "Toca tu localidad para preparar la consulta por WhatsApp.",
                    ],
                    [
                      House,
                      "Envíanos una referencia",
                      "Calle, número o un punto cercano. En WhatsApp también puedes compartir tu ubicación.",
                    ],
                    [
                      CheckCircle,
                      "Te confirmamos",
                      "Nuestro equipo revisa tu domicilio y te confirma la disponibilidad y el costo de instalación.",
                    ],
                  ].map(([Icon, title, desc], i) => (
                    <li key={title}>
                      <span className="coverage-step-icon" aria-hidden="true">
                        <Icon size={22} weight="light" />
                      </span>
                      <div>
                        <span className="coverage-step-number">Paso {i + 1}</span>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </section>
            <section
              className="shell coverage-office"
              aria-labelledby="office-title"
            >
              <figure>
                <img
                  src="/assets/community/aguilas-redixc.jpg"
                  alt="Mural azul de Redixc con el teléfono 311 144 7676 en el espacio deportivo de El Botadero"
                  loading="lazy"
                  width="1280"
                  height="960"
                />
                <figcaption>
                  Mural de Redixc en el espacio deportivo de El Botadero · Foto:{" "}
                  <a href={MURAL_SOURCE_URL} target="_blank" rel="noreferrer">
                    Águilas del Botadero
                  </a>
                </figcaption>
              </figure>
              <div className="coverage-office-copy">
                <h2 id="office-title">Nuestro punto de atención</h2>
                <p>
                  Te atienden técnicos locales, de tu comunidad. Escríbenos,
                  llámanos o visítanos.
                </p>
                <address>
                  <MapPin size={20} aria-hidden="true" />
                  {ADDRESS}
                </address>
                <div className="coverage-office-actions">
                  <a
                    className="button secondary"
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cómo llegar <ArrowUpRight size={17} />
                  </a>
                  <a className="button secondary" href="tel:+523111447676">
                    <Phone size={18} /> 311 144 7676
                  </a>
                  <button className="button" onClick={() => openContact()}>
                    <WhatsappLogo size={20} /> WhatsApp
                  </button>
                </div>
              </div>
            </section>
            <section
              className="section shell coverage-plans"
              aria-labelledby="coverage-plans-title"
            >
              <div className="section-heading centered">
                <h2 id="coverage-plans-title">
                  Mientras confirmamos, conoce los planes
                </h2>
                <p>Precios en MXN al mes, con impuestos incluidos.</p>
              </div>
              <div className="plans-grid preview-plans">
                {[plans[0], plans[2], plans[4]].map((p) => planCard(p))}
              </div>
              <div className="plans-note">
                <Link className="text-link" to={href("planes")}>
                  Ver los 6 planes <ArrowRight size={18} />
                </Link>
              </div>
            </section>
            <section className="section shell faq-section">
              <div className="section-heading">
                <h2>Preguntas sobre cobertura</h2>
              </div>
              <Faq items={[faqs[0], faqs[2], faqs[5]]} />
            </section>
          </>
        )}
        {route.page === "nosotros" && (
          <>
            <PageIntro
              page={route.page}
              title="La fibra que te une al mundo."
              text="Más de diez años proporcionando internet en nuestra región. Antes como Botanet, hoy como Redixc: la misma empresa, cerca de nuestras comunidades."
            />
            <CommunityStory />
            <ContactBanner openContact={openContact} />
          </>
        )}
        {route.page === "ayuda" && (
          <>
            <PageIntro
              page={route.page}
              title="¿En qué te ayudamos?"
              text="Llámanos al 311 144 7676 o escríbenos por WhatsApp para contratar o recibir ayuda con tu servicio."
            />
            <section className="shell help-options">
              <article>
                <div className="card-heading">
                  <span className="card-heading-icon" aria-hidden="true">
                    <Wifi size={30} weight="light" />
                  </span>
                  <h2>Quiero contratar</h2>
                </div>
                <p>
                  Consulta cobertura, compara planes y prepara tus preguntas
                  para nuestro equipo.
                </p>
                <button className="button" onClick={() => openContact()}>
                  Consultar servicio <ArrowRight size={18} />
                </button>
              </article>
              <article>
                <div className="card-heading">
                  <span className="card-heading-icon" aria-hidden="true">
                    <Headset size={30} weight="light" />
                  </span>
                  <h2>Ya soy cliente</h2>
                </div>
                <p>
                  Cuéntanos qué ocurre. Ten a la mano tu nombre y localidad para
                  facilitar la atención.
                </p>
                <button
                  className="button secondary"
                  onClick={() => openContact(null, "", "soporte")}
                >
                  Necesito soporte <ArrowRight size={18} />
                </button>
              </article>
              <article className="help-portal" id="portal-clientes">
                <div className="card-heading">
                  <span className="card-heading-icon" aria-hidden="true">
                    <UserCircle size={30} weight="light" />
                  </span>
                  <h2>Portal de clientes</h2>
                </div>
                <p>
                  Consulta tus estados de cuenta, facturas y pagos, o levanta un
                  ticket de soporte.
                </p>
                <a
                  className="button"
                  href={PORTAL_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ingresar al portal
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  <ArrowUpRight size={18} />
                </a>
                <PortalAccessHelp />
              </article>
            </section>
            <section className="section shell faq-section">
              <div className="section-heading">
                <h2>Preguntas frecuentes</h2>
                <p>
                  También puedes llamarnos al{" "}
                  <a href="tel:+523111447676">311 144 7676</a> o escribir a{" "}
                  <a href="mailto:info@redixc.net">info@redixc.net</a>. Para
                  mayor información respecto a las tarifas puede consultar el{" "}
                  <a href={IFT_VISOR_URL} target="_blank" rel="noreferrer">
                    visor de tarifas de la Comisión Reguladora de Telecomunicaciones
                  </a>.
                </p>
              </div>
              <Faq items={faqs} />
            </section>
          </>
        )}
        {route.page === "legal" && (
          <>
            <PageIntro
              page={route.page}
              title="Contratos y documentos"
              text="Consulta los documentos del servicio, tus derechos y las características de los paquetes."
            />
            <section className="shell documents">
              <h2>Documentos del servicio</h2>
              {documents.map(([title, desc, file]) => (
                <a
                  className="document-row"
                  key={file}
                  href={`/docs/${file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={27} weight="light" />
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                  <span>
                    Ver PDF <ArrowUpRight size={18} />
                  </span>
                </a>
              ))}
              <div className="legal-note">
                <ShieldCheck size={24} />
                <p>
                  Consulta los documentos del servicio de Redixc. Para dudas
                  sobre condiciones o contratación, contacta a{" "}
                  <a href="mailto:info@redixc.net">info@redixc.net</a>. Para
                  mayor información respecto a las tarifas puede consultar el{" "}
                  <a href={IFT_VISOR_URL} target="_blank" rel="noreferrer">
                    visor de tarifas de la Comisión Reguladora de Telecomunicaciones
                  </a>.
                </p>
              </div>
              <Link to={href("planes")} className="text-link">
                Ver fichas de cada plan <ArrowRight size={18} />
              </Link>
            </section>
          </>
        )}
        {route.page === "notFound" && (
          <section className="section shell">
            <h1>Página no encontrada</h1>
            <p>Encuentra tu próxima conexión desde el inicio.</p>
            <Link className="button" to="/">
              Volver al inicio <ArrowRight size={18} />
            </Link>
          </section>
        )}
      </main>
      <footer className={`footer shell footer-fiber`}>
        <div className="footer-columns">
          <div className="footer-navigation">
            <h3>Navegación</h3>
            {["planes", "cobertura", "nosotros", "ayuda", "legal"].map((p) => (
              <Link key={p} to={href(p)}>
                {pageNames[p]}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <h3>Contáctanos</h3>
            <a href="tel:+523111447676">
              <Phone size={17} />
              311 144 7676
            </a>
            <a href="mailto:info@redixc.net">
              <Envelope size={17} />
              info@redixc.net
            </a>
            <span className="footer-address">
              <MapPin size={17} />
              {ADDRESS}
            </span>
            <button
              className="footer-whatsapp"
              aria-label="Escríbenos por WhatsApp"
              onClick={() => openContact()}
            >
              <WhatsappLogo size={19} aria-hidden="true" />
              Escríbenos
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} REDIXC. La fibra que te une al mundo.
          </span>
          <Link to={href("legal")}>Documentos y condiciones del servicio</Link>
        </div>
      </footer>
      {contact && (
        <ContactModal
          fluid={fluid}
          data={contact}
          close={() => setContact(null)}
        />
      )}
    </div>
  );
}
function PlanTable({ openContact }) {
  return (
    <div className="plan-table-block">
      <h3>Los 6 planes de un vistazo</h3>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Tabla de planes, desplaza para ver todas las columnas"
      >
        <table className="plan-table">
          <caption className="sr-only">
            Precio mensual, bajada y subida de cada plan
          </caption>
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Precio mensual</th>
              <th scope="col">Bajada</th>
              <th scope="col">Subida</th>
              <th scope="col">Ficha</th>
              <th scope="col" aria-label="Consulta" />
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.name}>
                <th scope="row">{p.name}</th>
                <td>${p.price} MXN</td>
                <td>{p.down} Mbps</td>
                <td>{p.up} Mbps</td>
                <td>
                  <a
                    href={formatoUrl(p)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ficha del plan ${p.name}`}
                  >
                    PDF <ArrowUpRight size={13} />
                  </a>
                </td>
                <td>
                  <button
                    className="text-link"
                    onClick={() => openContact(p)}
                    aria-label={`Consultar plan ${p.name}`}
                  >
                    Consultar <ArrowRight size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ThemeControl({ theme, setTheme }) {
  return (
    <div
      className="theme-control"
      role="group"
      aria-label="Apariencia del sitio"
    >
      {[
        ["light", "Claro", Sun],
        ["dark", "Oscuro", Moon],
        ["system", "Sistema", Desktop],
      ].map(([key, label, Icon]) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          aria-pressed={theme === key}
          className={theme === key ? "active" : ""}
          aria-label={label}
          title={label}
        >
          <Icon size={15} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
const joinList = (items) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`
    : items.join("");
function Recommender({
  onRecommend,
  compact = false,
  fluid = false,
  inDisclosure = false,
}) {
  const [activities, setActivities] = useState([]);
  const [people, setPeople] = useState("1-2");
  const peopleId = useId();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const previousResult = useRef(null);
  if (result) previousResult.current = result;
  const shown = result || (fluid ? previousResult.current : null);
  const select = (k) => {
    const next = activities.includes(k)
      ? activities.filter((value) => value !== k)
      : [...activities, k];
    setActivities(next);
    setError(false);
    setResult(fluid && result && next.length ? recommendPlan(next, people) : null);
  };
  const recommend = () => {
    if (!activities.length) {
      setError(true);
      return;
    }
    setResult(recommendPlan(activities, people));
  };
  return (
    <section
      className={`recommender ${compact ? "compact" : ""}`}
      id="recomendador"
      aria-label="Recomendador de planes"
    >
      <div className="recommender-header">
        <div>
          {!inDisclosure && (
            <h2>¿No sabes cuál elegir?</h2>
          )}
          <p>
            Selecciona tus actividades y cuántas personas se conectan a la vez.
            La sugerencia es orientativa.
          </p>
        </div>
        <fieldset className="people-selector">
          <legend>Personas conectadas a la vez</legend>
          <div className="segmented-choice">
            {["1-2", "3-4", "5+"].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`${peopleId}-people`}
                  value={value}
                  checked={people === value}
                  onChange={() => {
                    setPeople(value);
                    setResult(
                      fluid && result && activities.length
                        ? recommendPlan(activities, value)
                        : null,
                    );
                  }}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="activity-grid">
        {[
          [Laptop, "Trabajar", "Videollamadas, correo y productividad."],
          [
            GraduationCap,
            "Estudiar",
            "Clases en línea, investigación y tareas.",
          ],
          [
            PlayCircle,
            "Disfrutar",
            "Streaming, redes sociales y entretenimiento.",
          ],
        ].map(([Icon, title, desc]) => (
          <button
            className={`activity ${activities.includes(title) ? "selected" : ""}`}
            key={title}
            onClick={() => select(title)}
            aria-pressed={activities.includes(title)}
          >
            <Icon size={29} weight="light" />
            <span>
              <strong>{title}</strong>
              <small>{desc}</small>
            </span>
            <span className="activity-check">
              {activities.includes(title) ? (
                <CheckCircle size={20} weight="fill" />
              ) : (
                <RadioButton size={19} />
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="recommender-action">
        <button className="button" onClick={recommend}>
          Ver sugerencia <ArrowRight size={18} />
        </button>
        {error && <span role="alert">Elige al menos una actividad.</span>}
      </div>
      {fluid && (
        <p className="sr-only" role="status" aria-atomic="true">
          {result
            ? `Sugerencia orientativa: ${result.name}, ${result.down} Mbps, $${result.price} al mes.`
            : ""}
        </p>
      )}
      <div aria-live={fluid ? "off" : "polite"} aria-atomic="true">
        <MotionPanel enabled={fluid} open={!!result} kind="result">
          {shown && (
            <div className="recommend-result">
              <div>
                <span className="recommend-kicker">Sugerencia orientativa</span>
                <h3>
                  {shown.name} · {shown.down} Mbps{" "}
                  <span>${shown.price}/mes</span>
                </h3>
                <p>
                  Orientación para {people} personas conectadas a la vez, para{" "}
                  {joinList(activities.map((a) => a.toLowerCase()))}. La
                  experiencia depende del uso simultáneo y de tu red Wi-Fi.
                </p>
              </div>
              <button
                className="button"
                onClick={(e) =>
                  onRecommend(shown, e.currentTarget.closest(".recommend-result"))
                }
              >
                Ver en los planes <ArrowRight size={17} />
              </button>
            </div>
          )}
        </MotionPanel>
      </div>
    </section>
  );
}
// Imágenes propias por página cuando el archivo no sigue el patrón hero-<página>.
const heroImages = { planes: "/assets/hero-planes-eleccion.webp" };
const heroAlts = {
  planes: "Una señora y su hijo eligen un plan de internet en la laptop, en casa",
  cobertura: "Familia revisando un teléfono en el porche de su casa",
  nosotros: "Personas de la comunidad conectándose desde casa",
  ayuda: "Atención cercana para resolver dudas sobre internet",
  legal: "Consulta de un contrato junto a una laptop",
};
function PageIntro({ page, tag, title, text }) {
  return (
    <section className="page-intro shell">
      <div className="page-intro-copy">
        {tag && <span className="eyebrow">{tag}</span>}
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <img
        className="page-intro-image"
        src={heroImages[page] || `/assets/hero-${page}.webp`}
        alt={heroAlts[page]}
        fetchpriority="high"
      />
    </section>
  );
}
function Faq({ items }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <Plus size={19} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
function PortalAccessHelp() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const submit = (event) => {
    event.preventDefault();
    const result = validateHolderName(name);
    setError(result.error);
    if (result.error) {
      inputRef.current?.focus();
      return;
    }
    setName(result.name);
    window.open(adminWhatsappUrl(result.name), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="help-portal-form" noValidate onSubmit={submit}>
      <p className="help-portal-note">
        Si no conoces tu usuario o contraseña, escribe a nombre de quién está
        el servicio y te comunicamos con Administración de Redixc por WhatsApp.
      </p>
      <label htmlFor="portal-holder">Nombre del titular del servicio</label>
      <div className="help-portal-row">
        <input
          ref={inputRef}
          id="portal-holder"
          type="text"
          autoComplete="name"
          maxLength={HOLDER_NAME_MAX}
          placeholder="Como aparece en tu contrato"
          value={name}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "portal-holder-error" : undefined}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
        />
        <button className="button secondary" type="submit">
          <WhatsappLogo size={18} aria-hidden="true" /> Escribir a Administración
          <span className="sr-only"> (se abre WhatsApp en una pestaña nueva)</span>
        </button>
      </div>
      <p id="portal-holder-error" className="help-portal-error" aria-live="polite">
        {error}
      </p>
    </form>
  );
}

function ContactBanner({ openContact }) {
  return (
    <section className="contact-banner shell">
      <div>
        <h2>¿Dudas antes de contratar?</h2>
        <p>Escríbenos por WhatsApp: te ayudamos a elegir y resolvemos tus dudas.</p>
      </div>
      <button className="button" onClick={() => openContact()}>
        <WhatsappLogo size={24} /> Hablemos por WhatsApp{" "}
        <ArrowUpRight size={20} />
      </button>
    </section>
  );
}
function ContactModal({
  data,
  close: onClose,
  fluid = false,
}) {
  const [locality, setLocality] = useState(
    locales.includes(data.locality) ? data.locality : "",
  );
  const locationText = locality;
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [copyError, setCopyError] = useState(false);
  const ref = useRef(null);
  const firstRef = useRef(null);
  // Without View Transitions, on desktop the dialog grows from the button that
  // opened it and returns there on close. Mobile keeps the bottom sheet.
  const morphFrom = data.morphFrom;
  const [anchored] = useState(
    () =>
      !morphFrom &&
      !!data.origin &&
      matchMedia("(min-width: 601px)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const closing = useRef(false);
  useLayoutEffect(() => {
    if (!anchored) return;
    const el = ref.current;
    const box = el.getBoundingClientRect();
    const o = data.origin;
    el.style.transformOrigin = `${o.left + o.width / 2 - box.left}px ${o.top + o.height / 2 - box.top}px`;
    const animation = el.animate(
      [
        { opacity: 0, transform: "scale(.96)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 200, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
    // If the effect re-runs (StrictMode), measure the unscaled box again.
    return () => animation.cancel();
  }, [anchored]);
  const closeAnchored = () => {
    if (closing.current) return;
    closing.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    ref.current
      .animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "scale(.96)" },
        ],
        { duration: 200, easing: "cubic-bezier(.8,0,.8,.2)", fill: "forwards" },
      )
      .finished.then(onClose, onClose);
  };
  // Reverse the morph back into the card or button it came from.
  const closeMorph = () => {
    if (closing.current) return;
    closing.current = true;
    // Reduced motion may have been enabled while open: close without naming.
    if (!canTransition()) return onClose();
    startTransition(true, () => {
      morphFrom.style.viewTransitionName = "contact-morph";
      onClose();
    })?.finished.finally(() => (morphFrom.style.viewTransitionName = ""));
  };
  const sheet = useFluidSheet(fluid && !anchored && !morphFrom, ref, onClose);
  const close = morphFrom
    ? closeMorph
    : anchored
      ? closeAnchored
      : fluid
        ? sheet.dismiss
        : onClose;
  useEffect(() => {
    const previous = document.activeElement;
    firstRef.current?.focus();
    document.body.style.overflow = "hidden";
    const background = [
      ...document.querySelectorAll(
        ".app > header, .app > main, .app > footer, .app > .skip-link",
      ),
    ];
    background.forEach((el) => (el.inert = true));
    return () => {
      document.body.style.overflow = "";
      background.forEach((el) => (el.inert = false));
      previous?.focus();
    };
  }, []);
  const plan = data.plan;
  // Message as parts so the phrase a person just changed can be highlighted.
  const change = (key, text) => ({ key, text });
  const parts =
    data.kind === "soporte"
      ? [
          "Hola Redixc, necesito ayuda con mi servicio.",
          ...(locationText
            ? [" Mi localidad es ", change(`loc-${locationText}`, locationText), "."]
            : []),
          ...(details.trim()
            ? [" Lo que ocurre: ", change(`det-${details.trim()}`, details.trim())]
            : []),
        ]
      : [
          `Hola Redixc, me interesa ${plan ? `el plan ${plan.name}, $${plan.price} al mes, con ${plan.down} Mbps de descarga y ${plan.up} Mbps de subida` : "su servicio de internet de fibra óptica"}.`,
          ...(locationText
            ? [
                " Mi localidad es ",
                change(`loc-${locationText}`, locationText),
                ".",
              ]
            : []),
          ...(address.trim()
            ? [" Mi domicilio o referencia: ", change("addr", address.trim()), "."]
            : []),
          " ¿Podrían confirmar la cobertura, el costo de instalación y las condiciones para contratar?",
        ];
  const message = parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
  const keydown = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const f = ref.current.querySelectorAll("button,a[href],input,select");
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        ref={ref}
        style={morphFrom ? { viewTransitionName: "contact-morph" } : undefined}
        onKeyDown={keydown}
      >
        {fluid && (
          <div className="sheet-grab" aria-hidden="true" {...sheet.handlers}>
            <span />
          </div>
        )}
        <button
          ref={firstRef}
          className="icon-button modal-close"
          onClick={close}
          aria-label="Cerrar consulta"
        >
          <X size={22} />
        </button>
        <WhatsappLogo className="modal-symbol" size={36} />
        <span className="eyebrow">HABLEMOS DE TU CONEXIÓN</span>
        <h2 id="contact-title">
          {data.kind === "soporte"
            ? "Prepara tu consulta de soporte"
            : plan
              ? `${plan.name} · ${plan.down} Mbps`
              : "Consulta con nuestro equipo"}
        </h2>
        {plan && (
          <p className="modal-plan">
            ${plan.price}
            <span> MXN al mes · Impuestos incluidos</span>
          </p>
        )}
        <fieldset className="contact-locality">
          <legend>Tu localidad</legend>
          <div className="choice-group">
            {locales.map((name) => (
              <label className="choice" key={name}>
                <input
                  type="radio"
                  name="contact-locality"
                  value={name}
                  checked={locality === name}
                  onChange={() => {
                    setLocality(name);
                    setCopied(false);
                    setCopyError(false);
                  }}
                />
                <MapPin size={18} aria-hidden="true" />
                <span>{name}</span>
                <Check className="choice-check" size={18} aria-hidden="true" />
              </label>
            ))}
          </div>
        </fieldset>
        {data.kind !== "soporte" && (
          <>
            <label htmlFor="contact-address">
              Calle, número o referencia (opcional)
            </label>
            <input
              id="contact-address"
              type="text"
              autoComplete="street-address"
              maxLength={160}
              placeholder="Ej. calle y número, o «frente a la plaza»"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setCopied(false);
              }}
            />
            <p className="fineprint">
              En WhatsApp también puedes compartir tu ubicación. Nuestro equipo
              confirma la cobertura para tu domicilio.
            </p>
          </>
        )}
        {data.kind === "soporte" && (
          <>
            <label htmlFor="support-details">¿Qué ocurre? (opcional)</label>
            <textarea
              id="support-details"
              rows={3}
              maxLength={600}
              placeholder="Ej. no tengo conexión desde esta mañana"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </>
        )}
        <div className="message-preview">
          <span>ASÍ EMPEZARÁ TU CONVERSACIÓN</span>
          <p>
            {parts.map((p) =>
              typeof p === "string" ? (
                p
              ) : (
                <mark className="message-change" key={p.key}>
                  {p.text}
                </mark>
              ),
            )}
          </p>
        </div>
        <p className="fineprint">
          Al continuar se abrirá WhatsApp con tu consulta preparada. Tú decides
          cuándo enviar el mensaje.
        </p>
        <p className="sr-only" role="status">
          {copied ? "Mensaje copiado" : ""}
        </p>
        {copyError && (
          <p role="alert">
            No se pudo copiar. Selecciona el texto del mensaje o abre WhatsApp.
          </p>
        )}
        <div className="modal-actions">
          <a
            className="button"
            href={`https://wa.me/523111447676?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir WhatsApp <ArrowUpRight size={18} />
          </a>
          <button
            className="button secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(message);
                setCopied(true);
                setCopyError(false);
              } catch {
                setCopied(false);
                setCopyError(true);
              }
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </section>
    </div>
  );
}
export { App };

function HomeBenefits() {
  return (
    <section
      className="home-benefits shell"
      aria-label="Beneficios del servicio"
    >
      {[
        [
          CalendarCheck,
          "Mes a mes, sin sorpresas",
          "Sin plazos forzosos y con precios fijos cada mes.",
        ],
        [Users, "Técnicos locales", "Atención de personas de tu comunidad."],
        [
          Heart,
          "Parte de tu comunidad",
          "Internet gratuito para escuelas, la clínica y el comisariado ejidal.",
          ["/nosotros", "Conoce nuestra historia"],
        ],
      ].map(([Icon, title, desc, link]) => (
        <div className="home-benefit" key={title}>
          <Icon size={43} weight="light" />
          <div>
            <h2>{title}</h2>
            <p>{desc}</p>
            {link && (
              <Link className="text-link home-benefit-link" to={link[0]}>
                {link[1]} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
