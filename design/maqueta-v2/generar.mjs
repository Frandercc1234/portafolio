// Genera design/maqueta-v2/index.html (inglés) y es.html (español). Maqueta estática: no toca src/.
// Uso (desde la raíz): node design/maqueta-v2/generar.mjs
import fs from 'node:fs';

const joinLabel = (parts) => parts.join('<span aria-hidden="true"> · </span>');

// Textos de la interfaz tomados de messages/*.json; "Now" y "Looking for" los dio Frander.
const T = {
  en: {
    nav: ['Projects', 'Experience', 'Contact'], cv: 'Download CV', menu: 'Menu', contactBtn: 'Contact',
    role: 'Full stack developer',
    value: 'I build web apps and data dashboards for small businesses and public institutions.',
    facts: [
      ['Now', 'Systems Engineering graduate (UNA, 2025). Lately: microservices with Spring Boot and automated QA with Cypress. Costa Rica, UTC-6.'],
      ['Looking for', 'Full stack, back-end or QA roles, and freelance projects.'],
      ['Before', 'Internship at ASADA Gamalotal (2025) and a university project for the Municipality of Nicoya (2024–2025).'],
    ],
    work: 'Selected work', more: 'More projects',
    rows: [
      ['purareserva', 'PuraReserva', 'Tour booking for Guanacaste, with an AI assistant.', ['Web', 'Full stack developer', 'Next.js, Supabase', 'Personal'], 'PuraReserva home page'],
      ['payments-service', 'Payments service with microservices', 'Idempotent payments and a double-entry ledger, in two services.', ['Back-end', 'Back-end developer', 'Java 21, Spring Boot', 'Personal'], 'Architecture diagram: payments API, outbox relay, RabbitMQ and notifications service'],
      ['nicoya-zmt', 'Maritime Zone system, Nicoya', 'Citizen portal and admin dashboard for a municipal department.', ['Web', 'Full stack developer', 'Next.js, MariaDB', 'University'], 'Public home page of the Maritime Zone system'],
      ['pipeline-bccr', 'Costa Rica economic indicators pipeline', 'Daily Central Bank indicators, with a public API and a dashboard.', ['Data', 'Full stack and data engineer', 'Python, NestJS', 'Personal'], 'Dashboard of economic indicators'],
      ['asada-gamalotal', 'ASADA inventory system', 'Inventory system for a rural water association.', ['Web', 'Full stack developer', 'Next.js, Supabase', 'Internship'], 'Public page of the ASADA Gamalotal system'],
    ],
    minis: [
      ['Tourism arrivals dashboard', 'International arrivals from public ICT data. The demo may take ~30 s to wake up.', ['Data engineer', 'Python, DuckDB', 'Personal'], ['Case study', 'Demo', 'Repository']],
      ['QA suite for this portfolio', 'E2E and API tests that run against this live site.', ['QA automation', 'Cypress, TypeScript', 'Personal'], ['Case study', 'Repository']],
    ],
    experience: 'Experience and education',
    timeline: [
      ['Jul 2025 – Dec 2025', 'ASADA Gamalotal', 'Professional internship.'],
      ['2024 – 2025', 'Municipalidad de Nicoya', 'University project for the Maritime Zone department.'],
      ['2025', 'Systems Engineering, Universidad Nacional', ''],
      ['Certifications', '', 'DataCamp: AI Engineer for Developers, Data Engineer, Data Analyst, Python Developer, SQL Associate. Scrum Fundamentals Certified. PM4R Professional (IDB).'],
      ['Languages', '', 'Spanish, native. English, B1.'],
    ],
    aboutTitle: 'About me',
    about: 'I plan before I write code, and I test on a real phone before I call a feature done. I am looking for a full stack role where I can keep building and learning.',
    contact: 'Contact', fields: ['Name', 'Email', 'Message'], send: 'Send message', turnstile: 'Anti-spam check goes here',
    email: 'Email', built: 'Built with Next.js, deployed on Vercel.',
  },
  es: {
    nav: ['Proyectos', 'Experiencia', 'Contacto'], cv: 'Descargar CV', menu: 'Menú', contactBtn: 'Contacto',
    role: 'Desarrollador full stack',
    value: 'Construyo aplicaciones web y dashboards de datos para pymes e instituciones públicas.',
    facts: [
      ['Ahora', 'Graduado en Ingeniería en Sistemas (UNA, 2025). Últimamente: microservicios con Spring Boot y QA automatizado con Cypress. Costa Rica, UTC-6.'],
      ['Busco', 'Puestos full stack, back-end o QA, y proyectos freelance.'],
      ['Antes', 'Práctica en la ASADA Gamalotal (2025) y un proyecto universitario para la Municipalidad de Nicoya (2024–2025).'],
    ],
    work: 'Trabajo destacado', more: 'Más proyectos',
    rows: [
      ['purareserva', 'PuraReserva', 'Reservas de tours en Guanacaste, con un asistente de IA.', ['Web', 'Desarrollador full stack', 'Next.js, Supabase', 'Personal'], 'Página de inicio de PuraReserva'],
      ['payments-service.es', 'Servicio de pagos con microservicios', 'Pagos idempotentes y libro mayor de doble entrada, en dos servicios.', ['Back-end', 'Desarrollador back-end', 'Java 21, Spring Boot', 'Personal'], 'Diagrama de arquitectura: API de pagos, relay del outbox, RabbitMQ y servicio de notificaciones'],
      ['nicoya-zmt', 'Sistema de la Zona Marítimo Terrestre, Nicoya', 'Portal ciudadano y panel administrativo para un departamento municipal.', ['Web', 'Desarrollador full stack', 'Next.js, MariaDB', 'Universidad'], 'Página pública del sistema de la Zona Marítimo Terrestre'],
      ['pipeline-bccr', 'Pipeline de indicadores del BCCR', 'Indicadores diarios del Banco Central, con API pública y dashboard.', ['Datos', 'Full stack e ingeniero de datos', 'Python, NestJS', 'Personal'], 'Dashboard de indicadores económicos'],
      ['asada-gamalotal', 'Sistema de inventario de la ASADA', 'Sistema de inventario para un acueducto rural.', ['Web', 'Desarrollador full stack', 'Next.js, Supabase', 'Práctica'], 'Página pública del sistema de la ASADA Gamalotal'],
    ],
    minis: [
      ['Dashboard de llegadas de turistas', 'Llegadas internacionales con datos públicos del ICT. El demo puede tardar ~30 s en despertar.', ['Ingeniero de datos', 'Python, DuckDB', 'Personal'], ['Caso de estudio', 'Demo', 'Repositorio']],
      ['Suite de QA para este portafolio', 'Pruebas E2E y de API que corren contra este sitio en producción.', ['Automatización de QA', 'Cypress, TypeScript', 'Personal'], ['Caso de estudio', 'Repositorio']],
    ],
    experience: 'Experiencia y educación',
    timeline: [
      ['Jul 2025 – Dic 2025', 'ASADA Gamalotal', 'Práctica profesional.'],
      ['2024 – 2025', 'Municipalidad de Nicoya', 'Proyecto universitario para el departamento de Zona Marítimo Terrestre.'],
      ['2025', 'Ingeniería en Sistemas, Universidad Nacional', ''],
      ['Certificaciones', '', 'DataCamp: AI Engineer for Developers, Data Engineer, Data Analyst, Python Developer, SQL Associate. Scrum Fundamentals Certified. PM4R Professional del BID.'],
      ['Idiomas', '', 'Español, nativo. Inglés, B1.'],
    ],
    aboutTitle: 'Sobre mí',
    about: 'Planifico antes de escribir código y pruebo en un celular real antes de dar una función por terminada. Busco un puesto full stack donde pueda seguir construyendo y aprendiendo.',
    contact: 'Contacto', fields: ['Nombre', 'Correo', 'Mensaje'], send: 'Enviar mensaje', turnstile: 'Aquí va la verificación anti-spam',
    email: 'Correo', built: 'Hecho con Next.js, desplegado en Vercel.',
  },
};

const stack = [
  ['Frontend', 'React, Next.js, TypeScript, Tailwind'],
  ['Backend', 'NestJS, Supabase, PostgreSQL, REST'],
  ['Data', 'Python, pandas, DuckDB, Streamlit, Plotly'],
  ['Quality', 'Playwright, Vitest, GitHub Actions'],
];
const stackEs = ['Frontend', 'Backend', 'Datos', 'Calidad'];

const row = ([slug, title, line, label, alt]) => `
      <li><a class="row" href="#">
        <img class="cover" src="portadas/${slug}.webp" width="1440" height="900" alt="${alt}">
        <div class="row-text">
          <h3 class="title">${title}</h3>
          <p class="line">${line}</p>
          <p class="label">${joinLabel(label)}</p>
        </div>
      </a></li>`;

const mini = ([title, line, label, links]) => `
        <li class="mini grid">
          <h4 class="mini-title">${title}</h4>
          <p class="mini-line">${line}</p>
          <div class="mini-meta">
            <p class="label">${joinLabel(label)}</p>
            <p class="links">${links.map((l) => `<a href="#">${l}</a>`).join('')}</p>
          </div>
        </li>`;

const page = (lang, t) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Maqueta v2: inicio (${lang})</title>
<link rel="stylesheet" href="maqueta.css">
</head>
<body>
<header class="header"><div class="wrap bar">
  <a class="brand" href="#">Frander Centeno</a>
  <nav class="nav"><a href="#projects">${t.nav[0]}</a><a href="#experience">${t.nav[1]}</a><a href="#contact">${t.nav[2]}</a></nav>
  <div class="tools"><span class="lang">${lang === 'en' ? '<b>EN</b> <span>ES</span>' : '<span>EN</span> <b>ES</b>'}</span><a class="btn btn-2 hide-s" href="#">${t.cv}</a><button class="btn btn-2 only-s">${t.menu}</button></div>
</div></header>
<main>
  <section class="hero wrap grid">
    <div class="intro">
      <h1 class="display">Frander Centeno</h1>
      <p class="title soft">${t.role}</p>
      <p class="value">${t.value}</p>
      <p class="actions"><a class="btn btn-1" href="#">${t.cv}</a><a class="btn btn-2" href="#contact">${t.contactBtn}</a></p>
    </div>
    <dl class="facts grid">${t.facts.map(([k, v]) => `
      <div><dt class="label">${k}</dt><dd>${v}</dd></div>`).join('')}
    </dl>
  </section>
  <section id="projects" class="wrap section work">
    <h2 class="title">${t.work}</h2>
    <ul class="rows">${t.rows.map(row).join('')}
    </ul>
    <div class="more">
      <h3 class="label more-name">${t.more}</h3>
      <ul class="minis">${t.minis.map(mini).join('')}
      </ul>
    </div>
  </section>
  <section class="wrap section split grid">
    <h2 class="title">Stack</h2>
    <div class="content stack">${stack.map(([k, v], i) => `
      <div><h3 class="label">${lang === 'es' ? stackEs[i] : k}</h3><p>${v}</p></div>`).join('')}
    </div>
  </section>
  <section id="experience" class="wrap section split grid">
    <h2 class="title">${t.experience}</h2>
    <ul class="content">${t.timeline.map(([a, b, c]) => `
      <li class="entry"><p class="label">${a}</p><div>${b ? `<h3 class="entry-title">${b}</h3>` : ''}${c ? `<p class="soft">${c}</p>` : ''}</div></li>`).join('')}
    </ul>
  </section>
  <section class="wrap section split grid">
    <h2 class="title">${t.aboutTitle}</h2>
    <p class="content title about">${t.about}</p>
  </section>
  <section id="contact" class="wrap section split grid last">
    <h2 class="title">${t.contact}</h2>
    <form class="form">
      <label>${t.fields[0]}<input type="text"></label>
      <label>${t.fields[1]}<input type="email"></label>
      <label>${t.fields[2]}<textarea rows="5"></textarea></label>
      <div class="turnstile">${t.turnstile}</div>
      <button class="btn btn-1" type="button">${t.send}</button>
    </form>
    <ul class="direct">
      <li><span class="label">${t.email}</span><a href="#">centenofrander@gmail.com</a></li>
      <li><span class="label">LinkedIn</span><a href="#">frander-centeno</a></li>
      <li><span class="label">GitHub</span><a href="#">Frandercc1234</a></li>
    </ul>
  </section>
</main>
<footer class="footer"><div class="wrap">
  <p class="links"><a href="#">${t.email}</a><a href="#">GitHub</a><a href="#">LinkedIn</a></p>
  <p class="soft">© 2026 Frander Centeno. ${t.built}</p>
</div></footer>
<div class="overlay" aria-hidden="true"><div class="wrap grid">${'<i></i>'.repeat(12)}</div></div>
<script>if (location.search === '?grid') document.body.classList.add('show-grid');</script>
</body>
</html>
`;

fs.writeFileSync('design/maqueta-v2/index.html', page('en', T.en));
fs.writeFileSync('design/maqueta-v2/es.html', page('es', T.es));
