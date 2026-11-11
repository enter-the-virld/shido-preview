/* SHIDO® site behaviour: shared header/footer, four-language switch (EN · FR · ES · AR),
   right-to-left for Arabic, motion, the scroll-driven gallery, faculty profiles, contact form. */
(function () {
  "use strict";

  const BOOK_URL = "https://www.momoyoga.com/shidomindyoga/teacher-profile";
  const EMAIL = "contact@shidomindyoga.com";
  const PHONE_DISPLAY = "061 11 40 44 47";
  const PHONE_TEL = "06111404447"; // TODO: confirm. The live site shows 11 digits; Moroccan numbers have 10
  const INSTAGRAM = "https://www.instagram.com/shidomind.yoga";
  const LINKEDIN = "https://www.linkedin.com/company/shido-mind-yoga/";
  const MAPS = "https://www.google.com/maps/search/?api=1&query=36B+Boulevard+d%27Anfa+Casablanca+Morocco";
  const LANGS = ["en", "fr", "es", "it", "ar"];
  const AR_FONTS = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap";

  document.documentElement.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return "1"; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  // Translation helper: English is the default markup; the other languages live in data attributes.
  const esc = (s) => s.replace(/"/g, "&quot;");
  const t = (en, fr, es, ar, it) => `<span data-fr="${esc(fr)}" data-es="${esc(es)}" data-it="${esc(it)}" data-ar="${esc(ar)}">${en}</span>`;

  const icon = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94zM20.44 13.4c0-3.1-1.66-4.54-3.87-4.54-1.79 0-2.58.98-3.03 1.67V8.5h-3.38c.04.95 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.69.12-.93.27-.69.89-1.4 1.93-1.4 1.36 0 1.9 1.04 1.9 2.56V20h3.38l-.43-6.6z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>'
  };
  window.SHIDO_ICONS = icon;

  const pages = [
    { id: "home", href: "index.html", en: "Home", fr: "Accueil", es: "Inicio", ar: "الرئيسية", it: "Home" },
    { id: "house", href: "house.html", en: "The House", fr: "La Maison", es: "La Casa", ar: "الدار", it: "La Casa" },
    { id: "practice", href: "practice.html", en: "Yoga Practice", fr: "Pratique du Yoga", es: "Práctica de Yoga", ar: "ممارسة اليوغا", it: "Pratica dello Yoga" },
    { id: "education", href: "education.html", en: "Education", fr: "Formation", es: "Formación", ar: "التعليم", it: "Formazione" },
    { id: "faculty", href: "faculty.html", en: "Faculty", fr: "Corps enseignant", es: "Profesorado", ar: "هيئة التدريس", it: "Corpo docente" },
    { id: "events", href: "events.html", en: "Events &amp; Performance", fr: "Événements &amp; Performance", es: "Eventos y Rendimiento", ar: "الفعاليات والأداء", it: "Eventi e Performance" },
    { id: "contact", href: "contact.html", en: "Contact", fr: "Contact", es: "Contacto", ar: "اتصل بنا", it: "Contatti" }
  ];
  const current = document.body.dataset.page;
  const aria = (p) => (p.id === current ? ' aria-current="page"' : "");
  const navLabel = (p) => t(p.en, p.fr, p.es, p.ar, p.it);
  const BOOK = ["Book Your Practice", "Réserver votre pratique", "Reserve su práctica", "احجز حصتك", "Prenota la tua pratica"];
  const bookBtn = (cls = "") =>
    `<a class="btn ${cls}" href="${BOOK_URL}" target="_blank" rel="noopener">${t(...BOOK)}${icon.arrow}</a>`;
  const langSwitch = () =>
    `<div class="lang" role="group" aria-label="Language">${LANGS.map((l, i) =>
      `${i ? "<i></i>" : ""}<button type="button" data-lang="${l}" aria-pressed="false" lang="${l}">${l.toUpperCase()}</button>`).join("")}</div>`;

  // ---------- Header ----------
  const header = document.getElementById("site-header");
  if (header) {
    header.outerHTML = `
<a class="skip-link" href="#main">${t("Skip to content", "Aller au contenu", "Ir al contenido", "الانتقال إلى المحتوى", "Vai al contenuto")}</a>
<header class="header${current === "home" ? " on-hero" : ""}" id="header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="SHIDO® Home"><img class="logo-dark" src="assets/img/shido-logo-dark.png" alt="SHIDO Mind Yoga" width="818" height="564"><img class="logo-light" src="assets/img/shido-logo-light.png" alt="" aria-hidden="true" width="818" height="564"></a>
    <nav class="nav" aria-label="Main">
      ${pages.filter((p) => p.id !== "home").map((p) => `<a href="${p.href}"${aria(p)}>${navLabel(p)}</a>`).join("")}
    </nav>
    <div class="header-actions">
      ${langSwitch()}
      ${bookBtn("outline")}
      <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="Mobile">
    ${pages.map((p, i) => `<a href="${p.href}"${aria(p)}>${navLabel(p)}<small>0${i + 1}</small></a>`).join("")}
  </nav>
  <div class="mm-foot">
    ${langSwitch()}
    ${bookBtn()}
    <p>36B, Boulevard d'Anfa, Casablanca<br><a href="mailto:${EMAIL}">${EMAIL}</a></p>
  </div>
</div>
<div class="book-bar" id="book-bar">${bookBtn()}</div>`;
  }

  // ---------- Footer ----------
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.outerHTML = `
<footer class="footer on-dark">
  <img class="plate" src="assets/img/plate-orbit.svg" alt="" aria-hidden="true">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/img/shido-logo-light.png" alt="SHIDO Mind Yoga" width="818" height="564" loading="lazy">
        <p class="serif">${t("A House of Yoga Education", "Une Maison d'Enseignement du Yoga", "Una Casa de Enseñanza del Yoga", "دارٌ لتعليم اليوغا", "Una Casa di Insegnamento dello Yoga")}</p>
        <p class="mt-2">${t("Rooted in Yoga. Informed by Science. Dedicated to Longevity.", "Enraciné dans le Yoga. Éclairé par la science. Dédié à la longévité.", "Arraigada en el Yoga. Fundamentada en la ciencia. Dedicada a la longevidad.", "متجذّرة في اليوغا. مستنيرة بالعلم. مكرّسة لطول العمر.", "Radicata nello Yoga. Guidata dalla scienza. Dedicata alla longevità.")}</p>
      </div>
      <div>
        <h4>${t("The House", "La Maison", "La Casa", "الدار", "La Casa")}</h4>
        <ul>${pages.filter((p) => p.id !== "home").map((p) => `<li><a href="${p.href}">${navLabel(p)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>${t("Visit", "Nous rendre visite", "Visítenos", "زورونا", "Visitateci")}</h4>
        <address>SHIDO® · Casablanca<br>36B, Boulevard d'Anfa<br>${t("Casablanca, Morocco", "Casablanca, Maroc", "Casablanca, Marruecos", "الدار البيضاء، المغرب", "Casablanca, Marocco")}<br>
          <a href="mailto:${EMAIL}">${EMAIL}</a><br><a href="tel:${PHONE_TEL}" dir="ltr">${PHONE_DISPLAY}</a></address>
        <div class="socials">
          <a href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${icon.ig}</a>
          <a href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon.li}</a>
          <a href="${MAPS}" target="_blank" rel="noopener" aria-label="Google Maps">${icon.map}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} SHIDO®. ${t("All rights reserved.", "Tous droits réservés.", "Todos los derechos reservados.", "جميع الحقوق محفوظة.", "Tutti i diritti riservati.")}</span>
      <nav class="footer-legal" aria-label="Legal">
        <a href="confidentialite.html">${t("Privacy policy", "Politique de confidentialité", "Política de privacidad", "سياسة الخصوصية", "Informativa sulla privacy")}</a>
        <a href="non-responsabilite.html">${t("Disclaimer", "Clause de non-responsabilité", "Exención de responsabilidad", "إخلاء المسؤولية", "Esclusione di responsabilità")}</a>
      </nav>
      <span class="motto">${t("Rooted in tradition · Informed by science · Open to the world", "Enraciné dans la tradition · Éclairé par la science · Ouvert sur le monde", "Arraigada en la tradición · Fundamentada en la ciencia · Abierta al mundo", "متجذّرة في التقاليد · مستنيرة بالعلم · منفتحة على العالم", "Radicata nella tradizione · Guidata dalla scienza · Aperta al mondo")}</span>
    </div>
  </div>
</footer>`;
  }

  // Fill shared values used inside page markup
  document.querySelectorAll("[data-book]").forEach((a) => { a.href = BOOK_URL; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-maps]").forEach((a) => { a.href = MAPS; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-arrow]").forEach((el) => el.insertAdjacentHTML("beforeend", icon.arrow));

  // ---------- Language ----------
  const store = {
    get() { try { return localStorage.getItem("shido-lang"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("shido-lang", v); } catch (e) { /* private mode */ } }
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const titleEn = document.title;
  function loadArabicFonts() {
    if (document.getElementById("ar-fonts")) return;
    const l = document.createElement("link");
    l.id = "ar-fonts"; l.rel = "stylesheet"; l.href = AR_FONTS;
    document.head.appendChild(l);
  }
  function applyLang(lang) {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang === "ar") loadArabicFonts();
    document.querySelectorAll("[data-fr], [data-es], [data-it], [data-ar]").forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const v = lang === "en" ? el.dataset.en : el.dataset[lang];
      el.innerHTML = v === undefined ? el.dataset.en : v;
    });
    document.querySelectorAll("[data-fr-ph], [data-es-ph], [data-it-ph], [data-ar-ph]").forEach((el) => {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.placeholder;
      const v = lang === "en" ? el.dataset.enPh : el.dataset[lang + "Ph"];
      el.placeholder = v === undefined ? el.dataset.enPh : v;
    });
    const title = root.dataset["title" + cap(lang)];
    document.title = lang === "en" || !title ? titleEn : title;
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    document.dispatchEvent(new CustomEvent("shido:lang", { detail: lang }));
  }
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = LANGS.includes(urlLang) ? urlLang : (LANGS.includes(store.get()) ? store.get() : "en");
  if (urlLang === lang) store.set(lang);
  applyLang(lang);
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".lang button");
    if (!b) return;
    lang = b.dataset.lang; store.set(lang); applyLang(lang);
    if (gallery) gallery.measure();
  });
  window.SHIDO_LANG = () => lang;
  const isRTL = () => document.documentElement.dir === "rtl";

  // ---------- Header state, mobile menu, booking bar ----------
  const hdr = document.getElementById("header");
  const bar = document.getElementById("book-bar");
  const onScroll = () => {
    const y = window.scrollY;
    hdr && hdr.classList.toggle("scrolled", y > 24);
    bar && bar.classList.toggle("show", y > 480 && !document.body.classList.contains("menu-open"));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector(".menu-toggle");
  const mm = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    mm.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    onScroll();
  };
  toggle && toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 1320 && document.body.classList.contains("menu-open")) setMenu(false); });

  // ---------- First-visit intro (once per session) ----------
  if (!reduceMotion && !session.get("shido-intro")) {
    session.set("shido-intro", "1");
    document.documentElement.classList.add("has-intro");
    const line = { en: "House of Yoga Education", fr: "Maison d'Enseignement du Yoga", es: "Casa de Enseñanza del Yoga", it: "Casa di Insegnamento dello Yoga", ar: "دار تعليم اليوغا" }[lang];
    document.body.insertAdjacentHTML("afterbegin",
      `<div class="intro" aria-hidden="true"><div class="intro-inner"><img src="assets/img/shido-mark-light.png" alt=""><span></span><small>${line}</small></div></div>`);
    const intro = document.querySelector(".intro");
    setTimeout(() => intro.classList.add("done"), 1250);
    setTimeout(() => { intro.remove(); document.documentElement.classList.remove("has-intro"); }, 2600);
  }

  // ---------- Soft page transitions between internal pages ----------
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || reduceMotion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    document.documentElement.classList.add("leaving");
    setTimeout(() => { location.href = url.href; }, 380);
  });
  window.addEventListener("pageshow", () => document.documentElement.classList.remove("leaving"));
  // Safety net: if the page-in animation never runs (paused tab, odd embed), the page must still be visible
  setTimeout(() => { if (getComputedStyle(document.body).opacity === "0") document.body.style.animation = "none"; }, 1800);

  // ---------- One scroll loop: parallax on framed photography + the sideways gallery ----------
  const pxImgs = reduceMotion ? [] : [...document.querySelectorAll(".hero-arch img, .page-hero .hero-figure img, .framed img, .feature .f-media img")];
  pxImgs.forEach((img) => img.classList.add("parallax"));
  const parallax = () => {
    const vh = window.innerHeight;
    pxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 … 1 across the viewport
      img.style.translate = `0 ${(-p * r.height * 0.045).toFixed(1)}px`;
    });
  };

  // The gallery pins itself for the height of its own width, then slides as the page scrolls.
  // Each photograph opens like a curtain as it arrives. Reduced motion gets a plain horizontal strip.
  const gallery = (() => {
    const el = document.querySelector(".gallery");
    if (!el) return null;
    const track = el.querySelector(".gallery-track");
    const items = [...el.querySelectorAll(".g-item")];
    const count = el.querySelector(".gallery-count");
    const pad = (n) => String(n).padStart(2, "0");
    if (count) count.textContent = `${pad(1)} / ${pad(items.length)}`;
    if (reduceMotion) { el.classList.add("static"); return null; }
    const SPEED = 1.5; // 1px of page scroll moves the track 1.5px, so the gallery does not outstay its welcome
    let travel = 0, top = 0;
    const update = () => {
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / (travel / SPEED || 1)));
      const x = p * travel;
      track.style.transform = `translateX(${isRTL() ? x : -x}px)`;
      const vw = window.innerWidth;
      items.forEach((it) => {
        if (it.classList.contains("in")) return;
        const r = it.getBoundingClientRect();
        const entering = isRTL() ? r.right > vw * 0.08 : r.left < vw * 0.92;
        if (entering && r.top < window.innerHeight && r.bottom > 0) it.classList.add("in");
      });
      if (count) count.textContent = `${pad(Math.round(p * (items.length - 1)) + 1)} / ${pad(items.length)}`;
    };
    const measure = () => {
      track.style.transform = "";
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      el.style.height = travel / SPEED + window.innerHeight + "px";
      top = el.getBoundingClientRect().top + window.scrollY;
      update();
    };
    window.addEventListener("load", measure);
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
    measure();
    return { update, measure };
  })();

  let ticking = false;
  const frame = () => { parallax(); gallery && gallery.update(); ticking = false; };
  if (pxImgs.length || gallery) {
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    window.addEventListener("resize", frame);
    frame();
  }

  // ---------- Headline reveal: headings rise word by word from behind a mask ----------
  const headSel = "main h1, main h2, .dim-text h3, .triad h3, .manifesto .statement, .feature h3";
  const splitWords = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "w";
            const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("w") && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.querySelectorAll(".wi").forEach((w, i) => w.style.setProperty("--i", i));
  };
  if (!reduceMotion) {
    const heads = [...document.querySelectorAll(headSel)];
    heads.forEach((h) => { h.classList.add("hl"); splitWords(h); });
    const hio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); hio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    heads.forEach((h) => {
      if (h.closest(".hero-home")) setTimeout(() => h.classList.add("in"), document.documentElement.classList.contains("has-intro") ? 1500 : 200);
      else hio.observe(h);
    });
    document.addEventListener("shido:lang", () => heads.forEach(splitWords));

    // Scroll progress hairline and slowly turning study plates
    document.body.insertAdjacentHTML("beforeend", '<div class="scroll-progress" aria-hidden="true"></div>');
    const prog = document.querySelector(".scroll-progress");
    const plates = [...document.querySelectorAll(".page-hero .plate, .hero-home .plate, .footer .plate")];
    let pt = false;
    const onFrame = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      plates.forEach((pl) => { pl.style.rotate = `${(scrollY * 0.025).toFixed(2)}deg`; });
      pt = false;
    };
    addEventListener("scroll", () => { if (!pt) { pt = true; requestAnimationFrame(onFrame); } }, { passive: true });
    onFrame();

    // Magnetic buttons: they lean gently towards the pointer
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("pointermove", (e) => {
        const b = e.target.closest(".btn"); if (!b) return;
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 10}px ${((e.clientY - r.top) / r.height - 0.5) * 8}px`;
      });
      document.addEventListener("pointerout", (e) => { const b = e.target.closest(".btn"); if (b && !b.contains(e.relatedTarget)) b.style.translate = ""; });
    }
  }

  // ---------- Reveal on scroll ----------
  const revealables = document.querySelectorAll(".reveal, .img-reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  // ---------- Faculty profiles ----------
  const dlg = document.getElementById("profile");
  const faculty = window.SHIDO_FACULTY || {};
  const pick = (o) => (o == null ? "" : typeof o === "string" ? o : (o[lang] !== undefined ? o[lang] : o.en));
  function openProfile(id) {
    const f = faculty[id];
    if (!f || !dlg) return;
    const closeLabel = { en: "Close", fr: "Fermer", es: "Cerrar", it: "Chiudi", ar: "إغلاق" }[lang];
    const bio = [].concat(pick(f.bio)).map((p) => `<p>${p}</p>`).join("");
    dlg.innerHTML = `
      <button class="dialog-close" type="button" aria-label="${closeLabel}">${icon.close}</button>
      <div class="profile-inner">
        <img src="${f.img}" alt="${f.name}" style="object-position:${f.pos || "50% 20%"}">
        <div class="profile-body">
          <span class="eyebrow">${pick(f.role)}</span>
          <h2>${f.name}</h2>
          <span class="meta">${pick(f.country)}</span>
          ${f.desc ? `<p class="desc">${pick(f.desc)}</p>` : ""}
          <div class="bio">${bio}</div>
        </div>
      </div>`;
    dlg.querySelector(".dialog-close").addEventListener("click", () => dlg.close());
    dlg.showModal();
  }
  document.querySelectorAll("[data-profile]").forEach((b) => b.addEventListener("click", () => openProfile(b.dataset.profile)));

  // Full faculty profiles, always visible on the Education page (re-rendered when the language changes)
  const facList = document.getElementById("faculty-list");
  if (facList) {
    const renderFaculty = () => {
      facList.innerHTML = Object.entries(faculty).map(([id, f]) => `
        <article class="fac-profile" id="fac-${id}">
          <div class="fp-media"><img src="${f.img}" alt="${f.name}" loading="lazy" style="object-position:${f.pos || "50% 20%"}"></div>
          <div class="fp-body">
            <span class="eyebrow">${pick(f.role)}</span>
            <h3>${f.name}</h3>
            <span class="meta">${pick(f.country)}</span>
            ${f.desc ? `<p class="desc">${pick(f.desc)}</p>` : ""}
            <div class="bio">${[].concat(pick(f.bio)).map((p) => `<p>${p}</p>`).join("")}</div>
          </div>
        </article>`).join("");
    };
    renderFaculty();
    document.addEventListener("shido:lang", renderFaculty);

    // Portfolio-style index: rendered from the faculty data (behaviour is shared with the home strip below)
    const show = document.getElementById("faculty-showcase");
    if (show) {
      const renderShow = () => {
        show.innerHTML = Object.entries(faculty).map(([id, f], i) => `
          <li><a href="#fac-${id}" data-img="${f.img}" data-pos="${f.pos || "50% 20%"}">
            <span class="fs-n">${String(i + 1).padStart(2, "0")}</span>
            <img class="fs-thumb" src="${f.img}" alt="" loading="lazy" style="object-position:${f.pos || "50% 20%"}">
            <span class="fs-name">${f.name}</span>
            <span class="fs-meta">${pick(f.country)}<br>${pick(f.role)}</span>
            <span class="fs-arrow">${icon.arrow}</span>
          </a></li>`).join("");
      };
      renderShow();
      document.addEventListener("shido:lang", renderShow);
    }
    if (location.hash.startsWith("#fac-")) { const t = document.getElementById(location.hash.slice(1)); t && t.scrollIntoView(); }
  }
  dlg && dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // ---------- Faculty showcase: hover a name and the portrait follows the cursor ----------
  document.querySelectorAll(".fac-showcase").forEach((show) => {
    const float = show.parentElement.querySelector(".fs-float");
    if (!float || reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const frame = float.querySelector(".fs-frame");
    const imgFor = (a) => {
      let im = [...frame.querySelectorAll("img")].find((x) => x.dataset.src === a.dataset.img);
      if (!im) {
        im = document.createElement("img"); im.alt = ""; im.src = a.dataset.img; im.dataset.src = a.dataset.img;
        im.style.objectPosition = a.dataset.pos || "50% 20%"; frame.appendChild(im); im.getBoundingClientRect();
      }
      return im;
    };
    show.querySelectorAll("a[data-img]").forEach(imgFor);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14; float.style.transform = `translate(${x}px, ${y}px)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0; };
    show.addEventListener("pointermove", (e) => {
      // Keep the portrait in the gap right of the names, so it never covers the name being read
      const r = show.getBoundingClientRect(), w = float.offsetWidth;
      const lane = isRTL() ? r.left + r.width * 0.38 - w : r.left + r.width * 0.62;
      tx = isRTL() ? Math.min(e.clientX - w - 40, lane) : Math.max(e.clientX + 40, lane);
      ty = e.clientY - float.offsetHeight / 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    show.addEventListener("pointerover", (e) => {
      const a = e.target.closest("a[data-img]"); if (!a) return;
      const im = imgFor(a);
      show.classList.add("hovering"); float.classList.add("on");
      frame.querySelectorAll("img").forEach((x) => x.classList.toggle("on", x === im));
    });
    show.addEventListener("pointerleave", () => { show.classList.remove("hovering"); float.classList.remove("on"); });
  });

  // ---------- Home: sections recede as the next one slides over them ----------
  if (current === "home" && !reduceMotion) {
    const secs = [...document.querySelectorAll("main > section")].filter((sec) => !sec.classList.contains("gallery"));
    const layers = secs.map((sec) => [...sec.querySelectorAll(":scope > .wrap, :scope > .hero-foot")]);
    let rt = false;
    const recede = () => {
      const vh = innerHeight;
      secs.forEach((sec, i) => {
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.bottom) / vh)); // 0 until the section's foot enters the screen, 1 once it has left
        layers[i].forEach((el) => {
          if (p <= 0) { el.style.transform = ""; el.style.opacity = ""; return; }
          el.style.transform = `translate3d(0, ${(p * vh * 0.32).toFixed(1)}px, 0) scale(${(1 - p * 0.05).toFixed(4)})`;
          el.style.opacity = (1 - p * 0.75).toFixed(3);
        });
      });
      rt = false;
    };
    addEventListener("scroll", () => { if (!rt) { rt = true; requestAnimationFrame(recede); } }, { passive: true });
    addEventListener("resize", recede);
    recede();
  }

  // ---------- Contact form (mailto hand-off until a form backend is connected) ----------
  const form = document.getElementById("contact-form");
  if (form) {
    const topic = new URLSearchParams(location.search).get("topic");
    if (topic) {
      const r = form.querySelector(`input[name=category][value="${topic}"]`);
      if (r) r.checked = true;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const cat = form.querySelector("input[name=category]:checked");
      const catLabel = cat ? cat.nextElementSibling.textContent.trim() : "";
      const subject = `[SHIDO] ${catLabel ? catLabel + " : " : ""}${d.get("subject")}`;
      const body = `${d.get("message")}\n\n${d.get("name")}\n${d.get("email")}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.getElementById("form-status").textContent = {
        en: "Your email app is opening with your message ready to send. Thank you.",
        fr: "Votre messagerie s'ouvre avec votre message prêt à être envoyé. Merci.",
        es: "Su aplicación de correo se abre con el mensaje listo para enviar. Gracias.",
        it: "La vostra app di posta si apre con il messaggio pronto da inviare. Grazie.",
        ar: "يُفتح تطبيق البريد الإلكتروني لديك ورسالتك جاهزة للإرسال. شكرًا لك."
      }[lang];
    });
  }
})();
