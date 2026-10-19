import { useEffect, useRef, useState } from "react";
import cordelesBotadero from "../assets/community/cordeles-botadero.jpg";
import {
  Buildings,
  GraduationCap,
  Heart,
  WifiHigh,
  ArrowUpRight,
} from "@phosphor-icons/react";

const chapters = [
  {
    id: "experiencia",
    label: "Nuestra historia",
    title: "Más de diez años conectando nuestra región.",
    body: "Somos parte de las comunidades a las que damos servicio. Comenzamos como Botanet y hoy seguimos cerca de nuestra gente como Redixc, con más de diez años de experiencia proporcionando internet.",
    note: "La misma empresa. Una historia que sigue conectando.",
    type: "years",
  },
  {
    id: "servicio",
    label: "Conexión para la comunidad",
    title: "Internet que también está al servicio de todos.",
    body: "Ofrecemos internet gratuito a las escuelas de la comunidad, a la clínica de salud y al comisariado ejidal. Acompañamos a los espacios que forman parte de nuestra vida cotidiana.",
    note: "Escuelas · Clínica de salud · Comisariado ejidal",
    type: "service",
  },
  {
    id: "tradiciones",
    label: "Lo que compartimos",
    title: "Estar presentes en nuestras tradiciones.",
    body: "Apoyamos eventos culturales, religiosos y deportivos de nuestras comunidades. En diciembre de 2024 aportamos pelotas para la posada infantil de El Botadero; Acción Cuidadana Botadero compartió públicamente el agradecimiento a Botanet.",
    image: "/assets/community/posada-collage.jpg",
    alt: "Collage de fotografías proporcionadas por Redixc: pelotas de colores, cajas de dulces y bolsas de golosinas",
    source: "Publicación del apoyo · 19 dic 2024",
    url: "https://www.facebook.com/accion.cuidadana.botadero/posts/pfbid02qzJPQhuxShDVk2Hr3kzUykWD2mJMcAAA24i9SV4GBnj98GNMx9F1ithNMiW65NNvl",
    width: 1448,
    height: 1086,
  },
  {
    id: "espacios",
    label: "Cuidar lo que es de todos",
    title: "Una comunidad también se construye en sus espacios.",
    body: "En noviembre de 2025 facilitamos pintura para el trabajo comunitario en la plaza de El Botadero. Nos sumamos al esfuerzo de quienes dedican tiempo y trabajo a cuidar los espacios públicos.",
    image: "/assets/community/plaza-botadero-limpia.jpg",
    alt: "Vista de la plaza de El Botadero con su quiosco y las letras del nombre de la localidad",
    source: "Publicación del apoyo · 25 nov 2025",
    url: "https://www.facebook.com/accion.cuidadana.botadero/posts/pfbid0Fo3d9Uptghestwqy9qSULj3CTpy7q2MxBGGLeqjBhvkqCUbjTeAtcADwMTwXtC2pl",
    width: 1464,
    height: 1075,
  },
  {
    id: "iglesia",
    label: "Nuestras celebraciones",
    title: "Cuidar los lugares donde nos reunimos.",
    body: "Apoyamos con pintura para la remodelación y el repintado de la iglesia de Nuestra Señora de Guadalupe, en El Botadero. Nos sumamos al cuidado de un espacio que forma parte de la historia y la vida de nuestra comunidad.",
    image: "/assets/community/iglesia-botadero-2022.jpg",
    alt: "Fachada y campanarios de la iglesia de El Botadero durante los trabajos de pintura, fotografía publicada por Jesús González",
    source: "Jesús González · 19 nov 2022",
    url: "https://www.facebook.com/jesus.gonzalez.919142/posts/pfbid0zcNiBBPEirCwxViGpgNig7dJEzGatEC9SqbyQHE3GmXY7k9CHDLjE4i6yarcNvJ1l",
    width: 960,
    height: 1280,
  },
  {
    id: "fiestas-patronales",
    label: "Tradiciones que nos unen",
    title: "Acompañar los días que celebramos juntos.",
    body: "Durante las fiestas patronales de El Botadero apoyamos con la decoración y los cordeles. Es otra manera de participar en las tradiciones y celebraciones que compartimos con nuestras familias y vecinos.",
    note: "Fotografía de El Botadero proporcionada por Redixc.",
    image: cordelesBotadero,
    alt: "Calle de El Botadero decorada con cordeles rojos, blancos y verdes durante las fiestas de la comunidad",
    width: 1536,
    height: 2048,
  },
  {
    id: "deporte",
    label: "Jugar en el mismo equipo",
    title: "También estamos del lado de nuestro deporte.",
    body: "Apoyamos a los equipos y las actividades deportivas de la comunidad. Águilas del Botadero es parte de esa historia: el equipo menciona a REDIXC.NET en una de sus publicaciones y muestra nuestra presencia en su espacio deportivo.",
    image: "/assets/community/aguilas-redixc.jpg",
    alt: "Muro con la marca Redixc en el espacio deportivo, fotografía publicada por Águilas del Botadero",
    source: "Águilas del Botadero",
    url: "https://www.facebook.com/aguilas.del.botadero.2025/posts/pfbid0AwHRWbcMVPo5qNa5R4K4oz4yruQnxZCZKQasSkyaVQbowFCwzbP2p7ABtB1mZk83l",
    width: 1280,
    height: 960,
  },
];
function Visual({ chapter }) {
  if (chapter.type === "years")
    return (
      <div className="community-years">
        <span>DE BOTANET A REDIXC</span>
        <strong>
          10<span>+</span>
        </strong>
        <p>
          años proporcionando
          <br />
          servicio de internet
        </p>
        <div>De aquí. Para nuestra gente.</div>
      </div>
    );
  if (chapter.type === "service")
    return (
      <div className="community-service">
        <WifiHigh size={52} weight="light" />
        <h3>
          Una conexión
          <br />
          que compartimos.
        </h3>
        <div>
          {[
            [GraduationCap, "Escuelas"],
            [Heart, "Clínica de salud"],
            [Buildings, "Comisariado ejidal"],
          ].map(([Icon, label]) => (
            <span key={label}>
              <Icon size={27} weight="light" />
              {label}
            </span>
          ))}
        </div>
        <p>Servicio de internet gratuito</p>
      </div>
    );
  return (
    <img
      src={chapter.image}
      alt={chapter.alt}
      width={chapter.width}
      height={chapter.height}
      loading="lazy"
    />
  );
}
export function CommunityStory() {
  const [active, setActive] = useState(0),
    root = useRef(null);
  useEffect(() => {
    const articles = [...root.current.querySelectorAll(".community-chapter")];
    if (!("IntersectionObserver" in window)) return;
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        const closest = [...visible].sort(
          (a, b) =>
            Math.abs(a.getBoundingClientRect().top - innerHeight * 0.25) -
            Math.abs(b.getBoundingClientRect().top - innerHeight * 0.25),
        )[0];
        if (closest) setActive(articles.indexOf(closest));
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0 },
    );
    articles.forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="community-story shell"
      ref={root}
      aria-labelledby="community-title"
    >
      <header className="community-intro">
        <span className="eyebrow">NUESTRO SERVICIO A LA COMUNIDAD</span>
        <h2 id="community-title">
          Somos de aquí.
          <br />
          <em>Y aquí nos involucramos.</em>
        </h2>
        <p>
          Conectar también significa estar presentes: en la escuela, en los
          espacios compartidos y en lo que nos reúne como comunidad.
        </p>
      </header>
      <div className="community-layout">
        <aside className="community-visual" aria-hidden="true">
          <div className="community-frames">
            {chapters.map((chapter, index) => (
              <div
                className="community-frame"
                data-active={active === index}
                key={chapter.id}
              >
                <Visual chapter={chapter} />
              </div>
            ))}
          </div>
          <div className="community-progress">
            <span>
              0{active + 1} / {String(chapters.length).padStart(2, "0")}
            </span>
            <span>{chapters[active].label}</span>
          </div>
        </aside>
        <div className="community-chapters">
          {chapters.map((chapter, index) => (
            <article
              className="community-chapter"
              key={chapter.id}
              onFocusCapture={() => setActive(index)}
            >
              <span className="community-chapter-label">
                <span>0{index + 1}</span>
                {chapter.label}
              </span>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
              {chapter.note && <p className="community-note">{chapter.note}</p>}
              <figure className="community-inline-visual">
                <Visual chapter={chapter} />
              </figure>
              {chapter.url && (
                <a
                  className="community-source"
                  href={chapter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    {chapter.source}
                    <strong>
                      Ver publicación original <ArrowUpRight size={16} />
                    </strong>
                  </span>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
