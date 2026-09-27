const data = window.PORTFOLIO_DATA;
const byId = id => document.getElementById(id);
const clone = id => byId(id).content.firstElementChild.cloneNode(true);
const put = (id, value) => { byId(id).textContent = value; };

function projectCard(p) {
  const el = clone('project-card-template');
  el.href = `projet-detail.html?id=${encodeURIComponent(p.id)}`;
  const img = el.querySelector('img'); img.src = p.cover; img.alt = p.title;
  el.querySelector('.tag').textContent = p.category;
  el.querySelector('h3').textContent = p.title;
  el.querySelector('p').textContent = p.summary;
  return el;
}
function tutorialCard(t) {
  const el = clone('tutorial-card-template');
  el.href = `instruction-detail.html?id=${encodeURIComponent(t.id)}`;
  const img = el.querySelector('img'); img.src = t.cover; img.alt = t.title;
  el.querySelector('.tag').textContent = `${t.level} · ${t.duration}`;
  el.querySelector('h3').textContent = t.title;
  el.querySelector('p').textContent = t.intro;
  return el;
}
function appendCards(target, items, render) { byId(target).replaceChildren(...items.map(render)); }

const pages = window.PORTFOLIO_PAGES;
let gallery = [], galleryIndex = 0, galleryTitle = '';
const lb = byId('lightbox');
function updateLightbox() { byId('lightboxImage').src = gallery[galleryIndex]; byId('lightboxImage').alt = galleryTitle; put('lightboxCaption', `${galleryTitle} — ${galleryIndex + 1} / ${gallery.length}`); }
function closeLightbox() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
function updateActiveLink(page) {
  const target = { home: 'index.html', projects: 'projets.html', 'project-detail': 'projets.html', tutorials: 'instructions.html', 'tutorial-detail': 'instructions.html', about: 'about.html' }[page];
  document.querySelectorAll('.nav-main .nav-link').forEach(link => {
    const active = link.getAttribute('href') === target;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
function currentRoute() {
  return { filename: location.pathname.split('/').pop() || 'index.html', search: location.search };
}
function renderPage() {
  const { filename, search } = currentRoute();
  const entry = pages[filename];
  if (!entry) return;
  const page = entry.page;
  const params = new URLSearchParams(search);
  document.body.dataset.page = page;
  document.title = entry.title;
  updateActiveLink(page);
  gallery = []; galleryIndex = 0; galleryTitle = '';
  closeLightbox();
  byId('app').innerHTML = entry.html;
  if (page === 'home') {
  put('artist-name', data.artist.name); put('artist-intro', data.artist.intro);
  put('project-count', data.projects.length); put('tutorial-count', data.tutorials.length);
  appendCards('featured-projects', data.projects.filter(p => p.featured).slice(0, 3), projectCard);
  appendCards('recent-tutorials', data.tutorials, tutorialCard);
}
if (page === 'projects') {
  const selected = data.categories.includes(params.get('categorie')) ? params.get('categorie') : 'Tous';
  function filter(category) {
    const url = new URL(location.href);
    const query = new URLSearchParams(currentRoute().search);
    if (category === 'Tous') query.delete('categorie');
    else query.set('categorie', category);
    url.search = query.toString();
    try { history.replaceState(null, '', url); } catch (_) { /* Certains navigateurs bloquent l'historique des fichiers locaux. */ }
    byId('filters').querySelectorAll('button').forEach(b => b.classList.toggle('active', b.textContent === category));
    appendCards('projects-list', category === 'Tous' ? data.projects : data.projects.filter(p => p.category === category), projectCard);
    byId('projects-list').querySelectorAll('a').forEach(a => { if (category !== 'Tous') a.href += `&categorie=${encodeURIComponent(category)}`; });
  }
  data.categories.forEach(category => { const button = clone('filter-template'); button.textContent = category; button.addEventListener('click', () => filter(category)); byId('filters').append(button); });
  filter(selected);
}
if (page === 'tutorials') appendCards('tutorials-list', data.tutorials, tutorialCard);
if (page === 'about') { put('artist-tagline', data.artist.tagline); put('artist-about', data.artist.about); }

if (page === 'project-detail') {
  const p = data.projects.find(x => x.id === params.get('id'));
  if (!p) { navigate('projets.html', true); return; }
  else {
    document.title = `${p.title} — L'Atelier Médiéval`;
    const category = params.get('categorie');
    if (data.categories.includes(category)) byId('back-projects').href += `?categorie=${encodeURIComponent(category)}`;
    byId('project-cover').src = p.cover; byId('project-cover').alt = p.title;
    put('project-tag', `${p.category} · ${p.year}`); put('project-title', p.title); put('project-description', p.details);
    p.meta.forEach(item => { const el = clone('meta-template'); el.textContent = item; byId('project-meta').append(el); });
    const sections = p.gallerySections || [{ title: null, imageNumbers: p.images.map((_, index) => index + 1) }];
    gallery = sections.flatMap(section => section.imageNumbers.map(number => p.images[number - 1]));
    galleryTitle = p.title;
    let galleryPosition = 0;
    sections.forEach(section => {
      const container = section.title ? document.createElement('section') : byId('project-gallery');
      if (section.title) {
        container.className = 'gallery-section';
        const heading = document.createElement('h3');
        heading.className = 'gallery-section-title';
        heading.textContent = section.title;
        container.append(heading);
      }
      const grid = section.title ? document.createElement('div') : container;
      if (section.title) grid.className = 'gallery';
      section.imageNumbers.forEach(number => {
        const src = p.images[number - 1];
        if (!src) return;
        const index = galleryPosition++;
        const el = clone('gallery-template');
        const img = el.querySelector('img');
        img.src = src;
        img.alt = `${p.title} — vue ${number}`;
        el.addEventListener('click', () => { galleryIndex = index; updateLightbox(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); });
        grid.append(el);
      });
      if (section.title) { container.append(grid); byId('project-gallery').append(container); }
    });
  }
}
if (page === 'tutorial-detail') {
  const t = data.tutorials.find(x => x.id === params.get('id'));
  if (!t) { navigate('instructions.html', true); return; }
  else {
    document.title = `${t.title} — L'Atelier Médiéval`;
    put('tutorial-level', `${t.level} · ${t.duration}`); put('tutorial-title', t.title); put('tutorial-intro', t.intro);
    t.tools.forEach(tool => { const li = document.createElement('li'); li.textContent = tool; byId('tutorial-tools').append(li); });
    t.steps.forEach((step, index) => {
      const el = clone('step-template'); el.querySelector('.step-number').textContent = String(index + 1).padStart(2, '0'); el.querySelector('h3').textContent = step.title || `Étape ${index + 1}`;
      const blocks = step.content || (step.text || step.image ? [{ text: step.text || '', image: step.image || '' }] : []);
      blocks.forEach(block => { const content = clone('content-template'); if (block.text) content.querySelector('p').textContent = block.text; else content.querySelector('p').remove(); const images = block.images || (block.image ? [block.image] : []); if (!images.length) content.querySelector('.step-content-images').remove(); else images.forEach(src => { const img = document.createElement('img'); img.src = src; img.alt = step.title || t.title; img.loading = 'lazy'; content.querySelector('.step-content-images').append(img); }); el.querySelector('.step-blocks').append(content); });
      byId('tutorial-steps').append(el);
    });
  }
}
}
function navigate(href, replace = false) {
  if (replace) location.replace(href);
  else location.href = href;
}
renderPage();
byId('menuBtn').addEventListener('click', () => byId('sidebar').classList.toggle('open'));
byId('themeBtn').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
if (localStorage.getItem('portfolio-theme') === 'dark') document.body.classList.add('dark');
byId('lightboxClose').addEventListener('click', closeLightbox);
byId('lightboxPrev').addEventListener('click', () => { if (gallery.length) { galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length; updateLightbox(); } });
byId('lightboxNext').addEventListener('click', () => { if (gallery.length) { galleryIndex = (galleryIndex + 1) % gallery.length; updateLightbox(); } });
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
