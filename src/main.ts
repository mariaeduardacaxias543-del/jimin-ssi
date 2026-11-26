import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories, products, groups, tiers, stockLabel, combos, coupons, labBases, labPearls, labTops, FREE_SHIPPING, brl, type CategoryId, type Group, type PriceTier, type LabOption, type Product } from './data';
import { store } from './store';
import { initFx, burst, reducedMotion, setPalette } from './fx';
import { track, report, resetAnalytics } from './analytics';
import { grupos, fotoGrupo, grupoPorId, creditoHtml, type GrupoInfo } from './grupos';
import { montarIcones, ico } from './icones';

/** Número do WhatsApp Business no formato internacional, só dígitos (ex.: 5599999999999). Vazio = demonstração. */
const WHATS = '';
const INSTAGRAM = ''; // ex.: https://instagram.com/seu_perfil

gsap.registerPlugin(ScrollTrigger);
montarIcones(); // sprite dos ícones próprios, antes de qualquer render

/** O mapa (MapLibre, ~1 MB) só é baixado quando a seção "Sobre nós" chega perto da tela. */
function bindMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  const io = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    io.disconnect();
    import('./mapa').then((m) => m.montarMapa(el, reducedMotion)).catch(() => {
      el.innerHTML = '<p class="about__loading">Não foi possível carregar o mapa agora.</p>';
    });
  }, { rootMargin: '400px 0px' });
  io.observe(el);
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll(sel)) as T[];
const img = (name: string) => `/img/${name}.webp`;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- utilitários de texto ---------- */
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.innerHTML = [...text].map((c) => `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  return $$('.ch', el);
}
function splitWords(el: HTMLElement) {
  // preserva <em> do título do hero
  const html = el.innerHTML;
  el.setAttribute('aria-label', el.textContent ?? '');
  el.innerHTML = html.replace(/(<em>.*?<\/em>|[^\s<]+)/g, (m) => `<span class="w"><span class="w__in" aria-hidden="true">${m}</span></span>`);
  return $$('.w__in', el);
}

/* ---------- toasts ---------- */
function toast(msg: string) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  $('#toasts').append(t);
  gsap.fromTo(t, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
  gsap.to(t, { y: -10, opacity: 0, delay: 2.4, duration: 0.35, onComplete: () => t.remove() });
}

/* ---------- intro ---------- */
function runIntro(): Promise<void> {
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('jimin-intro') === '1'; } catch { /* ignore */ }
  if (reducedMotion || seen) { intro.remove(); return Promise.resolve(); }
  try { sessionStorage.setItem('jimin-intro', '1'); } catch { /* ignore */ }
  document.body.classList.add('is-locked');
  const chars = splitChars($('.intro__word', intro));
  return new Promise((resolve) => {
    const done = () => { intro.remove(); document.body.classList.remove('is-locked'); resolve(); };
    const tl = gsap.timeline({ onComplete: done });
    tl.from('.intro__burst', { scale: 0.3, opacity: 0, duration: 0.8, ease: 'expo.out' })
      .from('.intro__crown', { y: -40, rotate: -25, opacity: 0, duration: 0.6, ease: 'back.out(3)' }, 0.2)
      .from(chars, { yPercent: 120, rotate: 12, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'back.out(2.2)' }, 0.3)
      .from('.intro__ko', { opacity: 0, y: 10, duration: 0.5 }, 0.9)
      .to(chars, { color: '#ffe9c7', stagger: 0.03, duration: 0.2, yoyo: true, repeat: 1 }, 1.2)
      .to(intro, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' }, 2.2);
    $('.intro__skip', intro).addEventListener('click', () => tl.progress(1));
  });
}

/* ---------- hero ---------- */
function heroIn() {
  const words = splitWords($('.hero__title'));
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero .hand', { opacity: 0, x: -20, duration: 0.8 })
    .from(words, { yPercent: 110, duration: 1, stagger: 0.05 }, 0.1)
    .from('.hero__lead, .hero__cta, .hero__tags', { opacity: 0, y: 24, stagger: 0.1, duration: 0.8 }, 0.5)
    .from('.hero__img', { scale: 0.85, opacity: 0, rotate: -4, duration: 1.2 }, 0.2)
    .from('.hero__blob', { scale: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 0.1)
    .from('.sticker, .hero__badge', { scale: 0, rotate: -40, stagger: 0.08, duration: 0.8, ease: 'back.out(3)' }, 0.7);

  if (reducedMotion) return;
  gsap.to('.sticker--heart', { y: -14, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.sticker--spark', { rotate: 180, duration: 6, repeat: -1, ease: 'none' });
  gsap.to('.hero__badge', { y: 10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  if (finePointer) {
    const stage = $('#heroStage');
    const layers = $$('[data-depth]', stage).map((el) => ({ el, d: Number(el.dataset.depth), x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }) }));
    $('#hero').addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left - r.width / 2) / r.width;
      const ny = (e.clientY - r.top - r.height / 2) / r.height;
      layers.forEach((l) => { l.x(nx * 40 * l.d); l.y(ny * 30 * l.d); });
    });
  }
  gsap.to('.hero__img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------- catálogo ---------- */
let activeCat: CategoryId = 'todos';
let activeGroup: Group | 'todos' = 'todos';
let activeTier: PriceTier = 'todas';
let query = '';

/** Monta os botões uma vez e depois só troca o estado, para a animação de preenchimento (CSS) acontecer na troca. */
function renderFilters() {
  const gRoot = $('#groupChips'), tRoot = $('#tierChips');
  if (!gRoot.childElementCount) {
    gRoot.innerHTML = (['todos', ...groups] as const).map((g) => {
      const info = g === 'todos' ? undefined : grupoPorId(g);
      const cor = info ? `--g:linear-gradient(100deg, ${info.cores[1]}, color-mix(in srgb, ${info.cores[1]} 65%, ${info.cores[0]}))` : '--g:var(--grad)';
      const capa = info ? `<img src="/img/grupos/mini/${info.slug}.webp" alt="" width="40" height="40" />` : `<span class="chip__all">${ico('tudo')}</span>`;
      return `<button type="button" class="chip chip--group" data-group="${g}" style="${cor}">${capa}<span>${g === 'todos' ? 'Todos os grupos' : g}</span></button>`;
    }).join('');
    tRoot.innerHTML = tiers.map((t) => `<button type="button" class="chip chip--tier" data-tier="${t.id}">${t.label}</button>`).join('');
  }
  $$<HTMLElement>('.chip--group', gRoot).forEach((b) => { const on = b.dataset.group === activeGroup; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
  $$<HTMLElement>('.chip--tier', tRoot).forEach((b) => { const on = b.dataset.tier === activeTier; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
}

function renderCats() {
  $('#cats').innerHTML = categories.map((c) => `
    <button class="cat${c.id === activeCat ? ' is-active' : ''}" role="tab" aria-selected="${c.id === activeCat}" data-cat="${c.id}">
      <span class="cat__icon">${ico(c.icon)}</span><span class="cat__label">${c.label}</span>
    </button>`).join('');
}

function cardHTML(p: Product) {
  const fav = store.isFav(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card__media">
      <img src="${img(p.image)}" alt="${p.name}" loading="lazy" width="600" height="600" ${p.hue ? `style="filter:hue-rotate(${p.hue}deg)"` : ''} />
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
      <span class="stock stock--${p.stock}">${stockLabel[p.stock]}</span>
      <button class="card__fav${fav ? ' is-on' : ''}" type="button" aria-pressed="${fav}" aria-label="Favoritar ${p.name}">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-8.6C1.6 8.3 3.7 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.3 0 5.4 3.3 4 6.4C19 15.6 12 20 12 20Z"/></svg>
      </button>
      <button class="card__quick" type="button">Ver detalhes</button>
    </div>
    <div class="card__body">
      <span class="card__group">${p.group ?? 'Cardápio'}</span>
      <h3>${p.name}</h3>
      <p class="card__price">${brl(p.price)}</p>
      <button class="btn btn--pink btn--block card__add" type="button">Adicionar ao carrinho</button>
    </div>
  </article>`;
}

function renderGrid(animate = true) {
  const q = query.trim().toLowerCase();
  const tier = tiers.find((t) => t.id === activeTier)!;
  const list = products.filter((p) =>
    (activeCat === 'todos' || p.category === activeCat) &&
    (activeGroup === 'todos' || p.group === activeGroup) &&
    tier.test(p.price) &&
    (!q || `${p.name} ${p.description} ${p.group ?? ''}`.toLowerCase().includes(q)));
  const grid = $('#grid');
  grid.innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  $('#productsCount').textContent = `${list.length} ${list.length === 1 ? 'item' : 'itens'}`;
  const catLabel = activeCat === 'todos' ? '' : categories.find((c) => c.id === activeCat)!.label;
  const groupLabel = activeGroup === 'todos' ? '' : activeGroup;
  $('#productsTitle').textContent = q ? `Resultados para “${query.trim()}”` : [catLabel, groupLabel].filter(Boolean).join(' · ') || 'Produtos em destaque';
  if (animate && !reducedMotion) gsap.from('.card', { y: 40, opacity: 0, scale: 0.96, stagger: 0.05, duration: 0.6, ease: 'back.out(1.6)', clearProps: 'all' });
  atualizarBanner();
  bindTilt();
  refreshSoon(); // a grade mudou de altura: as seções abaixo (e o pin do cardápio) precisam de novas posições
}

/* banner do grupo filtrado, com o recorte da foto */
function atualizarBanner() {
  const banner = $('#groupBanner');
  const g = activeGroup === 'todos' ? undefined : grupoPorId(activeGroup);
  if (!g) { banner.hidden = true; return; }
  const era = banner.hidden || banner.dataset.g !== g.slug;
  banner.hidden = false;
  banner.dataset.g = g.slug;
  banner.style.setProperty('--g1', g.cores[0]);
  banner.style.setProperty('--g2', g.cores[1]);
  banner.style.setProperty('--foco', g.foco ?? '50% 20%');
  banner.style.setProperty('--ar', String(g.ar ?? 1.5));
  banner.classList.toggle('groupbanner--foto', g.modo === 'banner');
  $<HTMLImageElement>('#gbImg').src = fotoGrupo(g.slug);
  $<HTMLImageElement>('#gbImg').alt = `Integrantes do ${g.id}`;
  $('#gbFandom').innerHTML = `Para ${g.fandom} ${ico('coracao')}`;
  $('#gbName').textContent = g.id;
  if (era && !reducedMotion) {
    gsap.fromTo(banner, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
    gsap.fromTo('#gbImg', { y: 60, scale: 0.9 }, { y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.6)' });
  }
}

/** Filtra o catálogo por um grupo e rola até os produtos (usado pelo palco). */
function verGrupo(id: Group) {
  activeGroup = id; activeCat = 'todos'; activeTier = 'todas'; query = '';
  $<HTMLInputElement>('#search').value = '';
  renderCats(); renderFilters(); renderGrid();
  track('filter', { label: `grupo:${id}` });
  $('#produtos').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}

/* ---------- palco dos grupos ---------- */
function bindStage() {
  const stage = $('#grupos');
  const img = $<HTMLImageElement>('#stageImg');
  const bg = $<HTMLImageElement>('#stageBg');
  grupos.forEach((g) => { const pre = new Image(); pre.src = fotoGrupo(g.slug); }); // troca sem piscar
  $('#stageTabs').innerHTML = grupos.map((g, i) => `<button type="button" role="tab" class="stage__tab" data-i="${i}" aria-selected="${i === 0}">
    <span>${g.id}</span><i class="stage__bar"></i></button>`).join('');
  const tabs = $$('.stage__tab');
  let atual = 0, timer: gsap.core.Tween | null = null;

  // recorte: a foto sem fundo fica sobre o degradê; banner: a foto inteira vira o fundo do palco
  const mostrarFoto = (g: GrupoInfo) => {
    const banner = g.modo === 'banner';
    stage.classList.toggle('stage--banner', banner);
    stage.style.setProperty('--ar', String(g.ar ?? 1.5));
    stage.style.setProperty('--foco', g.foco ?? '50% 50%');
    if (banner) { bg.src = fotoGrupo(g.slug); bg.alt = `Integrantes do ${g.id}`; } else { img.src = fotoGrupo(g.slug); bg.alt = ''; }
  };
  const preencher = (g: GrupoInfo) => {
    $('#stageHuge').textContent = g.id;
    $('#stageName').textContent = g.id;
    $('#stageFandom').textContent = `Para ${g.fandom}`;
    $('#stageMeta').textContent = `${g.integrantes} integrantes · desde ${g.estreia}`;
    $('#stageCta').innerHTML = `Ver produtos ${g.id === 'MAMAMOO' || g.id === 'TWICE' || g.id === 'BLACKPINK' ? 'de' : 'do'} ${g.id} <span aria-hidden="true">→</span>`;
    $('#stageCredit').innerHTML = creditoHtml(g);
    img.alt = `Integrantes do ${g.id}`;
  };

  const ir = (i: number, auto = false) => {
    const g = grupos[i];
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    if (!auto) track('filter', { label: `palco:${g.id}` });
    atual = i;
    const cores = { '--g1': g.cores[0], '--g2': g.cores[1], '--g3': g.cores[2] };
    if (reducedMotion) { Object.entries(cores).forEach(([k, v]) => stage.style.setProperty(k, v)); mostrarFoto(g); preencher(g); return; }
    gsap.timeline()
      .to(img, { x: -80, opacity: 0, scale: 0.94, duration: 0.35, ease: 'power2.in' })
      .to(bg, { opacity: 0, scale: 1.04, duration: 0.4, ease: 'power2.in' }, 0)
      .to('#stageHuge, .stage__info > *', { y: -20, opacity: 0, stagger: 0.03, duration: 0.25, ease: 'power2.in' }, 0)
      .to(stage, { ...cores, duration: 0.6, ease: 'power2.inOut' }, 0.1)
      .add(() => { mostrarFoto(g); preencher(g); })
      .fromTo(bg, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' })
      .fromTo(img, { x: 100, opacity: 0, scale: 1.06 }, { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, '<')
      .fromTo('#stageHuge', { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, '<')
      .fromTo('.stage__info > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'expo.out' }, '<0.1');
    tocar();
  };

  // troca automática a cada 6 s, com a barra da aba enchendo; pausa no hover e fora da tela
  const tocar = () => {
    timer?.kill();
    $$('.stage__bar').forEach((b) => gsap.set(b, { scaleX: 0 }));
    if (reducedMotion) return;
    timer = gsap.to(tabs[atual].querySelector('.stage__bar'), { scaleX: 1, duration: 6, ease: 'none', onComplete: () => ir((atual + 1) % grupos.length, true) });
  };

  $('#stageTabs').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.stage__tab');
    if (b && Number(b.dataset.i) !== atual) ir(Number(b.dataset.i));
  });
  $('#stageTabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (atual + (e.key === 'ArrowRight' ? 1 : grupos.length - 1)) % grupos.length;
    ir(n); tabs[n].focus();
  });
  $('#stageCta').addEventListener('click', () => verGrupo(grupos[atual].id));
  stage.addEventListener('pointerenter', () => timer?.pause());
  stage.addEventListener('pointerleave', () => timer?.resume());
  ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? timer?.resume() : timer?.pause()) });

  if (finePointer && !reducedMotion) {
    const px = gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power3' }), bx = gsap.quickTo(bg, 'x', { duration: 1.4, ease: 'power3' }), hx = gsap.quickTo('#stageHuge', 'x', { duration: 1.2, ease: 'power3' });
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect(); const nx = (e.clientX - r.left) / r.width - 0.5;
      px(nx * 30); bx(nx * -18); hx(nx * -60);
    });
  }
  if (!reducedMotion) {
    gsap.from('.stage__photo', { yPercent: 18, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: stage, start: 'top 75%' } });
    gsap.to('#stageHuge', { yPercent: -25, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  const g0 = grupos[0];
  stage.style.setProperty('--g1', g0.cores[0]); stage.style.setProperty('--g2', g0.cores[1]); stage.style.setProperty('--g3', g0.cores[2]);
  mostrarFoto(g0); preencher(g0);
  tocar();
}

function bindCredits() {
  const dlg = $<HTMLDialogElement>('#credits');
  $('#creditsBody').innerHTML = `
    <p class="hand">Obrigado aos fotógrafos</p>
    <h3>Créditos das fotos</h3>
    <p class="muted">As fotos dos grupos são de divulgação, enviadas pela loja, e os direitos são dos respectivos titulares. Os produtos sem foto real, os drinks e as comidas ainda usam imagens ilustrativas, geradas por IA.</p>
    <ul class="credits">${grupos.map((g) => `<li><img src="${fotoGrupo(g.slug)}" alt="" /><div><b>${g.id}</b><span>${creditoHtml(g)}</span></div></li>`).join('')}</ul>
    <h3 class="credits__title">Fotos dos produtos</h3>
    <p class="muted">Capas e fotos reais do Wikimedia Commons. Capas só com texto e formas simples são de domínio público; a marca continua sendo dos titulares.</p>
    <ul class="credits">${products.filter((p) => p.foto).map((p) => `<li><img src="${img(p.image)}" alt="" /><div><b>${p.name}</b><span>${p.foto!.autor} · ${p.foto!.licenca} · <a href="${p.foto!.url}" target="_blank" rel="noopener">original</a></span></div></li>`).join('')}</ul>`;
  $('#openCredits').addEventListener('click', (e) => { e.preventDefault(); dlg.showModal(); });
  dlg.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t === dlg || t.closest('[data-close]')) dlg.close(); });
}

let refreshId = 0;
function refreshSoon() {
  clearTimeout(refreshId);
  refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

function bindTilt() {
  if (!finePointer || reducedMotion) return;
  $$('.card').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
      card.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

function flyToCart(from: HTMLElement) {
  const target = $('#cartBtn').getBoundingClientRect();
  const r = from.getBoundingClientRect();
  if (reducedMotion) return bumpCart();
  const clone = from.cloneNode(true) as HTMLElement;
  clone.className = 'fly';
  Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  document.body.append(clone);
  const dx = target.left + target.width / 2 - (r.left + r.width / 2);
  const dy = target.top + target.height / 2 - (r.top + r.height / 2);
  gsap.timeline({ onComplete: () => { clone.remove(); bumpCart(); burst(target.left + target.width / 2, target.top + target.height / 2, 12, 0.7); } })
    .to(clone, { x: dx * 0.5, y: dy - 120, scale: 0.5, rotate: 20, duration: 0.45, ease: 'power2.out' })
    .to(clone, { x: dx, y: dy, scale: 0.08, rotate: 40, opacity: 0.6, duration: 0.45, ease: 'power2.in' });
}

function bumpCart() {
  gsap.fromTo('#cartBtn', { scale: 1 }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
}

function bindCatalog() {
  $('#cats').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.cat');
    if (!btn) return;
    activeCat = btn.dataset.cat as CategoryId;
    renderCats();
    track('filter', { label: `categoria:${activeCat}` });
    gsap.fromTo(`.cat[data-cat="${activeCat}"] .cat__icon`, { scale: 0.6, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    renderGrid();
  });
  const filterClick = (root: string, attr: 'group' | 'tier') => $(root).addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.chip');
    if (!b) return;
    if (attr === 'group') { activeGroup = b.dataset.group as Group | 'todos'; if (activeGroup !== 'todos') track('filter', { label: `grupo:${activeGroup}` }); }
    else { activeTier = b.dataset.tier as PriceTier; if (activeTier !== 'todas') track('filter', { label: `preco:${activeTier}` }); }
    renderFilters(); renderGrid();
  });
  filterClick('#groupChips', 'group');
  filterClick('#tierChips', 'tier');

  let tId = 0;
  $<HTMLInputElement>('#search').addEventListener('input', (e) => {
    query = (e.target as HTMLInputElement).value;
    // a busca vale para a loja toda
    if (query.trim() && (activeCat !== 'todos' || activeGroup !== 'todos' || activeTier !== 'todas')) {
      activeCat = 'todos'; activeGroup = 'todos'; activeTier = 'todas'; renderCats(); renderFilters();
    }
    clearTimeout(tId);
    tId = window.setTimeout(() => { renderGrid(); if (query.trim()) $('#produtos').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }, 220);
  });
  $('#grid').addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const card = t.closest<HTMLElement>('.card');
    if (!card) return;
    const p = store.product(card.dataset.id!)!;
    if (t.closest('.card__add')) {
      store.addProduct(p);
      track('add_to_cart', { id: p.id, label: p.name, value: p.price });
      flyToCart($('.card__media img', card));
      toast(`${p.name} foi para o carrinho`);
    } else if (t.closest('.card__fav')) {
      const btn = t.closest<HTMLElement>('.card__fav')!;
      const on = store.toggleFav(p.id);
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      const r = btn.getBoundingClientRect();
      if (on) burst(r.left + r.width / 2, r.top + r.height / 2, 16);
      gsap.fromTo(btn, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
    } else if (t.closest('.card__quick') || t.closest('img')) {
      openQuick(p);
    }
  });
}

/* ---------- quick view ---------- */
function openQuick(p: Product) {
  const dlg = $<HTMLDialogElement>('#quick');
  track('view_item', { id: p.id, label: p.name, value: p.price });
  $('#quickBody').innerHTML = `
    <img src="${img(p.image)}" alt="${p.name}" ${p.hue ? `style="filter:hue-rotate(${p.hue}deg)"` : ''} />
    <div>
      <p class="hand">${categories.find((c) => c.id === p.category)?.label}</p>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p class="quick__meta"><span class="stock stock--${p.stock}">${stockLabel[p.stock]}</span>${p.group ? `<span>${p.group}</span>` : ''}</p>
      <p class="quick__price">${brl(p.price)}</p>
      <p class="quick__pay">Pix ou cartão · Envio para todo o Brasil · Retirada grátis na loja em Caxias-MA</p>
      <button class="btn btn--dark" type="button" data-add="${p.id}">Adicionar ao carrinho</button>
    </div>`;
  dlg.showModal();
  if (!reducedMotion) gsap.from('.quick__body > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.8)' });
}

function bindQuick() {
  const dlg = $<HTMLDialogElement>('#quick');
  dlg.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === dlg || t.closest('[data-close]')) dlg.close();
    const add = t.closest<HTMLElement>('[data-add]');
    if (add) {
      const p = store.product(add.dataset.add!)!;
      store.addProduct(p);
      track('add_to_cart', { id: p.id, label: p.name, value: p.price });
      flyToCart($('#quickBody img'));
      toast(`${p.name} foi para o carrinho`);
      dlg.close();
    }
  });
}

/* ---------- carrinho ---------- */
function renderCart() {
  const list = $('#cartList');
  const cart = store.cart;
  list.innerHTML = cart.length ? cart.map((l) => `
    <li class="line" data-id="${l.id}">
      <img src="${img(l.image)}" alt="" ${l.hue ? `style="filter:hue-rotate(${l.hue}deg)"` : ''} />
      <div class="line__info"><p>${l.name}</p><strong>${brl(l.price)}</strong>
        <div class="qty"><button type="button" data-q="-1" aria-label="Diminuir">−</button><span>${l.qty}</span><button type="button" data-q="1" aria-label="Aumentar">+</button></div>
      </div>
      <button class="line__rm" type="button" aria-label="Remover ${l.name}">${ico('lixeira')}</button>
    </li>`).join('') : '<li class="drawer__empty">Seu carrinho está vazio.<br/>Que tal um Purple Dream?</li>';
  const sub = store.subtotal();
  const disc = store.discount();
  const missing = Math.max(0, FREE_SHIPPING - sub);
  $('#cartSubtotal').textContent = brl(sub);
  $('#discRow').hidden = disc === 0;
  $('#discLabel').textContent = store.coupon ? `Cupom ${store.coupon}` : 'Desconto';
  $('#cartDiscount').textContent = `− ${brl(disc)}`;
  $('#cartTotal').textContent = brl(sub - disc);
  $('#cartShip').textContent = missing === 0 && sub > 0 ? 'Grátis' : 'Calcular';
  $('#shipText').textContent = missing === 0 && sub > 0 ? 'Você ganhou frete grátis!' : `Faltam ${brl(missing)} para o frete grátis`;
  gsap.to('#shipBar', { width: `${Math.min(100, (sub / FREE_SHIPPING) * 100)}%`, duration: 0.6, ease: 'power3.out' });
  $('#cartCount').textContent = String(store.count());
  $('#favCount').textContent = String(store.favs.length);
}

function openDrawer(open: boolean) {
  const drawer = $('#drawer'); const scrim = $('#scrim');
  drawer.setAttribute('aria-hidden', String(!open));
  if (open) {
    scrim.hidden = false;
    gsap.to(scrim, { opacity: 1, duration: 0.3 });
    gsap.to(drawer, { xPercent: 0, duration: 0.55, ease: 'expo.out' });
    if (!reducedMotion) gsap.from('.line', { x: 40, opacity: 0, stagger: 0.05, duration: 0.4, delay: 0.15 });
    $<HTMLButtonElement>('#drawerClose').focus();
  } else {
    gsap.to(scrim, { opacity: 0, duration: 0.3, onComplete: () => { scrim.hidden = true; } });
    gsap.to(drawer, { xPercent: 105, duration: 0.45, ease: 'expo.in' });
  }
}

function bindCart() {
  gsap.set('#drawer', { xPercent: 105 });
  $('#cartBtn').addEventListener('click', () => openDrawer(true));
  $('#drawerClose').addEventListener('click', () => openDrawer(false));
  $('#keepShopping').addEventListener('click', () => openDrawer(false));
  $('#scrim').addEventListener('click', () => openDrawer(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#drawer').getAttribute('aria-hidden') === 'false') openDrawer(false); });
  $('#cartList').addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const line = t.closest<HTMLElement>('.line');
    if (!line) return;
    const id = line.dataset.id!;
    const l = store.cart.find((x) => x.id === id);
    if (!l) return;
    if (t.closest('[data-q]')) store.setQty(id, l.qty + Number(t.closest<HTMLElement>('[data-q]')!.dataset.q));
    if (t.closest('.line__rm')) gsap.to(line, { x: 60, opacity: 0, duration: 0.3, onComplete: () => store.remove(id) });
  });
  $('#checkout').addEventListener('click', (e) => {
    if (!store.count()) return toast('Seu carrinho está vazio.');
    track('begin_checkout', { value: store.subtotal() - store.discount() });
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 30, 1.3);
    // Demonstração: em produção o pedido só é "purchase" depois que o pagamento for confirmado pelo servidor.
    if (confirm('Checkout de demonstração. Simular pedido pago para alimentar o painel de indicadores?')) {
      track('purchase', { value: store.subtotal() - store.discount() });
      store.clear();
      openDrawer(false);
      toast('Pedido de demonstração registrado. Veja o painel no rodapé.');
    }
  });
  $('#couponForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $<HTMLInputElement>('#couponInput');
    if (store.applyCoupon(input.value)) {
      track('coupon', { label: store.coupon });
      toast(`Cupom aplicado: ${coupons[store.coupon].label}`);
      input.value = '';
    } else {
      toast('Cupom inválido.');
      gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    }
  });
  $('#favBtn').addEventListener('click', () => {
    const favs = store.favs.map((id) => store.product(id)?.name).filter(Boolean);
    toast(favs.length ? `Favoritos: ${favs.join(', ')}` : 'Toque no coração dos produtos para favoritar.');
  });
  store.subscribe(renderCart);
  renderCart();
}

/* ---------- combos, Instagram, WhatsApp e painel ---------- */
function bindCombos() {
  $('#combosGrid').innerHTML = combos.map((c) => {
    const items = c.items.map((id) => store.product(id)!);
    const full = items.reduce((s, p) => s + p.price, 0);
    const price = Math.round(full * (1 - c.discount) * 100) / 100;
    return `<article class="combo reveal" data-combo="${c.id}">
      <img src="${img(c.image)}" alt="" loading="lazy" width="600" height="600" />
      <div class="combo__body">
        <span class="combo__tag">${c.tag}</span>
        <h3>${c.name}</h3>
        <ul>${items.map((p) => `<li>${p.name}</li>`).join('')}</ul>
        <p><s>${brl(full)}</s> <strong>${brl(price)}</strong></p>
        <button class="btn btn--dark btn--block" type="button">Quero o combo</button>
      </div>
    </article>`;
  }).join('');
  $('#combosGrid').addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const el = t.closest<HTMLElement>('.combo');
    if (!el || !t.closest('button')) return;
    const c = combos.find((x) => x.id === el.dataset.combo)!;
    const full = c.items.reduce((s, id) => s + store.product(id)!.price, 0);
    store.addLine({ id: c.id, name: c.name, price: Math.round(full * (1 - c.discount) * 100) / 100, image: c.image, qty: 1 });
    track('add_to_cart', { id: c.id, label: c.name });
    flyToCart($('img', el));
    toast(`${c.name} no carrinho`);
  });
}

function bindInsta() {
  const posts = ['instagram', 'drink-purple', 'keychains', 'food-tteok', 'posters', 'drink-galaxy'];
  $('#instaGrid').innerHTML = posts.map((p, i) => `<a class="insta__post reveal" href="#" data-insta style="--d:${i}"><img src="${img(p)}" alt="" loading="lazy" width="600" height="600" /><span>Ver no Instagram ${ico('coracao')}</span></a>`).join('');
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('[data-insta], [data-whats]');
    if (!t) return;
    const whats = t.hasAttribute('data-whats');
    const url = whats ? (WHATS ? `https://wa.me/${WHATS}?text=${encodeURIComponent('Olá! Vim pelo site da Jimin-ssi.')}` : '') : INSTAGRAM;
    if (url) { (t as HTMLAnchorElement).href = url; (t as HTMLAnchorElement).target = '_blank'; (t as HTMLAnchorElement).rel = 'noopener'; return; }
    e.preventDefault();
    toast(whats ? 'Demonstração: defina o número do WhatsApp Business em src/main.ts (WHATS)' : 'Demonstração: defina o perfil do Instagram em src/main.ts (INSTAGRAM)');
  });
}

const num = (v: number, d = 1) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

function bindPanel() {
  const dlg = $<HTMLDialogElement>('#panel');
  const render = () => {
    const r = report();
    const name = (id: string) => store.product(id)?.name ?? combos.find((c) => c.id === id)?.name ?? id;
    const list = (rows: [string, number][], fmt = name) => rows.length ? `<ol>${rows.map(([k, v]) => `<li><span>${fmt(k)}</span><b>${v}</b></li>`).join('')}</ol>` : '<p class="muted">Sem dados ainda: navegue pelo site.</p>';
    $('#panelBody').innerHTML = `
      <p class="hand">Sistema de Informações Gerenciais</p>
      <h3>Painel de indicadores</h3>
      <p class="muted">Demonstração com os eventos deste navegador. Em produção, os mesmos eventos vão para o Google Analytics 4 (view_item, add_to_cart, begin_checkout, purchase).</p>
      <div class="kpis">
        <div><b>${r.visits}</b><span>Visitas ao site</span></div>
        <div><b>${num(r.conversion)}%</b><span>Taxa de conversão (pedidos ÷ visitas)</span></div>
        <div><b>${r.orders}</b><span>Pedidos · ${brl(r.revenue)}</span></div>
        <div><b>${num(r.abandonment, 0)}%</b><span>Desistência no checkout</span></div>
        <div><b>${num(r.cartRate / 100)}</b><span>Adições ao carrinho por visita</span></div>
        <div><b>${r.coupons}</b><span>Cupons usados</span></div>
      </div>
      <div class="panel__cols">
        <div><h4>Mais vistos</h4>${list(r.topViews)}</div>
        <div><h4>Mais adicionados</h4>${list(r.topAdds)}</div>
        <div><h4>Filtros mais usados</h4>${list(r.topFilters, (k) => k.replace(':', ': '))}</div>
      </div>
      <button class="btn btn--ghost" type="button" data-reset>Zerar dados da demonstração</button>`;
  };
  $('#openPanel').addEventListener('click', (e) => { e.preventDefault(); render(); dlg.showModal(); });
  dlg.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === dlg || t.closest('[data-close]')) dlg.close();
    if (t.closest('[data-reset]')) { resetAnalytics(); render(); }
  });
}

/* ---------- drink lab ---------- */
function bindLab() {
  const sel = { base: labBases[0], pearl: labPearls[1], top: labTops[0] };
  const chips = (root: string, opts: LabOption[], key: keyof typeof sel) => {
    $(root).innerHTML = opts.map((o, i) => `<button type="button" class="chip${o.id === sel[key].id ? ' is-on' : ''}" data-i="${i}" aria-pressed="${o.id === sel[key].id}">
      ${o.colors ? `<i style="background:linear-gradient(${o.colors[0]},${o.colors[1]})"></i>` : o.color ? `<i style="background:${o.color}"></i>` : ''}${o.label}${o.price ? ` <small>+${brl(o.price)}</small>` : ''}</button>`).join('');
    $(root).addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('.chip');
      if (!b) return;
      (sel as Record<string, LabOption>)[key] = opts[Number(b.dataset.i)];
      $$('.chip', $(root)).forEach((c) => { const on = c === b; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
      update(key === 'base');
    });
  };

  const names: Record<string, string> = { taro: 'Purple Dream', morango: 'Pink Blossom', manga: 'Mango Pop', galaxia: 'Galáxia' };
  const pearlsG = $('#pearls');
  const topG = $('#topping');
  const svgNS = 'http://www.w3.org/2000/svg';

  function drawPearls() {
    pearlsG.innerHTML = '';
    if (!sel.pearl.color) return;
    for (let i = 0; i < 22; i++) {
      const c = document.createElementNS(svgNS, sel.pearl.id === 'estrela' ? 'path' : 'circle');
      const x = 100 + Math.random() * 100, y = 345 + Math.random() * 50;
      if (sel.pearl.id === 'estrela') c.setAttribute('d', `M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y - 2} L${x + 3} ${y + 2} L${x + 5} ${y + 7} L${x} ${y + 4} L${x - 5} ${y + 7} L${x - 3} ${y + 2} L${x - 7} ${y - 2} L${x - 2} ${y - 2} Z`);
      else { c.setAttribute('cx', String(x)); c.setAttribute('cy', String(y)); c.setAttribute('r', String(8 + Math.random() * 3)); }
      c.setAttribute('fill', sel.pearl.color);
      c.setAttribute('class', 'pearl');
      pearlsG.append(c);
    }
    if (!reducedMotion) gsap.from('.pearl', { y: -260, duration: 0.9, stagger: 0.02, ease: 'bounce.out' });
  }

  function drawTop() {
    topG.innerHTML = '';
    if (sel.top.id === 'nada') return;
    if (sel.top.id === 'chantilly') {
      topG.innerHTML = `<path class="cream" d="M70 112 Q80 70 110 82 Q118 48 150 58 Q178 40 192 78 Q226 70 230 112 Z" />`;
    } else {
      topG.innerHTML = [0, 1, 2, 3, 4].map((i) => `<use class="ico heart-top" href="#i-coracao" x="${83 + i * 30}" y="${74 - (i % 2) * 14}" width="30" height="30"/>`).join('');
    }
    if (!reducedMotion) gsap.from('#topping > *', { y: -80, scale: 0.4, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'back.out(2)', transformOrigin: '50% 100%' });
  }

  function update(refill: boolean) {
    const [a, b] = sel.base.colors!;
    gsap.to('#liqTop', { attr: { 'stop-color': a }, duration: 0.6 });
    gsap.to('#liqBot', { attr: { 'stop-color': b }, duration: 0.6 });
    if (refill && !reducedMotion) gsap.fromTo('#liquid', { attr: { transform: 'translate(0 400)' } }, { attr: { transform: 'translate(0 118)' }, duration: 1.4, ease: 'power2.out' });
    drawPearls(); drawTop();
    const price = sel.base.price + sel.pearl.price + sel.top.price;
    $('#labName').textContent = names[sel.base.id];
    $('#labPrice').textContent = brl(price);
    document.documentElement.style.setProperty('--lab-a', a);
    document.documentElement.style.setProperty('--lab-b', b);
  }

  chips('#labBase', labBases, 'base');
  chips('#labPearl', labPearls, 'pearl');
  chips('#labTop', labTops, 'top');
  gsap.set('#liquid', { attr: { transform: reducedMotion ? 'translate(0 118)' : 'translate(0 400)' } });
  if (!reducedMotion) {
    gsap.to('#wave', { x: -150, duration: 2.4, repeat: -1, ease: 'none' });
    ScrollTrigger.create({ trigger: '#drink-lab', start: 'top 60%', once: true, onEnter: () => update(true) });
  } else update(false);

  $('#labAdd').addEventListener('click', () => {
    const price = sel.base.price + sel.pearl.price + sel.top.price;
    const id = `lab:${sel.base.id}-${sel.pearl.id}-${sel.top.id}`;
    const imgName = { taro: 'drink-purple', morango: 'drink-pink', manga: 'drink-mango', galaxia: 'drink-galaxy' }[sel.base.id]!;
    store.addLine({ id, name: `${names[sel.base.id]} (${sel.pearl.label}, ${sel.top.label})`, price, image: imgName, qty: 1 });
    track('add_to_cart', { id: `lab:${sel.base.id}`, label: `Drink Lab ${names[sel.base.id]}`, value: price });
    flyToCart($('#cup') as unknown as HTMLElement);
    toast(`${names[sel.base.id]} montado com sucesso`);
  });
}

/* ---------- cardápio horizontal ---------- */
function bindMenu() {
  const items = products.filter((p) => p.category === 'drinks' || p.category === 'comidas');
  $('#menuTrack').innerHTML = items.map((p, i) => `
    <article class="menu-card" style="--i:${i}">
      <img src="${img(p.image)}" alt="${p.name}" loading="lazy" width="600" height="600" />
      <div><h3>${p.name.replace(/^(Drink|Bowl de) /, '')}</h3><p>${p.description}</p><strong>${brl(p.price)}</strong></div>
    </article>`).join('');
  if (reducedMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = $('#menuTrack');
    const dist = () => track.scrollWidth - innerWidth + 64;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#cardapio', start: 'top top', end: () => `+=${dist()}`, pin: '.menu__pin', scrub: 0.6, invalidateOnRefresh: true } });
  });
}

/* ---------- seções reveal, contadores, army ---------- */
function bindReveals() {
  if (reducedMotion) { $$('.reveal').forEach((el) => el.classList.add('is-in')); return; }
  ScrollTrigger.batch('.reveal', { start: 'top 88%', onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'expo.out', overwrite: true }) });
  $$<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count); const suf = el.dataset.suffix ?? '';
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = `${Math.round(o.v)}${suf}`; } }) });
  });
  const ko = $('.army__ko');
  const chars = splitChars(ko);
  gsap.from(chars, { yPercent: 100, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: '#army', start: 'top 70%' } });
  gsap.fromTo('.army__bg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#army', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- header, botões magnéticos, cursor ---------- */
function bindChrome() {
  ScrollTrigger.create({ start: 80, end: 'max', onToggle: (s) => $('#header').classList.toggle('is-scrolled', s.isActive) });
  if (finePointer && !reducedMotion) {
    $$('.magnetic').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' }); const y = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
      btn.addEventListener('pointermove', (e) => { const r = btn.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.4); });
      btn.addEventListener('pointerleave', () => { x(0); y(0); });
    });
    const cur = $('#cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' }); const cy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', (e) => cur.classList.toggle('is-hover', !!(e.target as HTMLElement).closest('a, button, .card')));
    document.body.classList.add('has-cursor');
  }
  $('#year').textContent = String(new Date().getFullYear());
}

/* ---------- tema Borahae ---------- */
function bindTheme() {
  const btn = $('#themeToggle');
  const apply = (on: boolean) => {
    document.documentElement.dataset.theme = on ? 'borahae' : '';
    btn.setAttribute('aria-pressed', String(on));
    setPalette(on ? ['#b98cff', '#7b3fe4', '#ff8fd0', '#e0ccff'] : ['#ff1f8e', '#ff7a1a', '#ffb26b', '#b98cff']);
    try { localStorage.setItem('jimin-theme', on ? '1' : '0'); } catch { /* ignore */ }
  };
  let on = false;
  try { on = localStorage.getItem('jimin-theme') === '1'; } catch { /* ignore */ }
  apply(on);
  btn.addEventListener('click', (e) => {
    on = !on; apply(on);
    burst((e as MouseEvent).clientX, (e as MouseEvent).clientY, 24);
    toast(on ? 'Modo noite ativado' : 'De volta ao rosa e laranja');
  });
}

/* ---------- newsletter ---------- */
function bindNews() {
  $('#newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $<HTMLInputElement>('#newsEmail');
    const msg = $('#newsMsg');
    if (!input.checkValidity() || !input.value) { msg.textContent = 'Digite um e-mail válido.'; gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }); return; }
    const r = input.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 40, 1.4);
    msg.textContent = 'Prontinho! Seu cupom é BEMVINDO10 — use no carrinho. (Demonstração: conecte aqui o seu serviço de e-mail.)';
    input.value = '';
  });
}

/* ---------- boot ---------- */
async function boot() {
  track('page_view');
  renderCats(); renderFilters(); renderGrid(false);
  bindCatalog(); bindQuick(); bindCart(); bindCombos(); bindInsta(); bindPanel(); bindStage(); bindCredits(); bindMapa();
  $('#gbClear').addEventListener('click', () => { activeGroup = 'todos'; renderFilters(); renderGrid(); }); bindLab(); bindMenu(); bindChrome(); bindTheme(); bindNews();
  initFx();
  await runIntro();
  heroIn();
  bindReveals();
  if (!reducedMotion) gsap.from('.card', { y: 40, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'back.out(1.6)', clearProps: 'all', scrollTrigger: { trigger: '#grid', start: 'top 85%' } });
  // fontes e imagens mudam as alturas; o "load" pode já ter acontecido durante a intro
  if (document.readyState === 'complete') refreshSoon(); else addEventListener('load', refreshSoon);
  document.fonts?.ready.then(refreshSoon);
}

boot();
