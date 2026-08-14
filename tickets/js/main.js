/* ============================================================
   VAART — The Harbor · main.js (integration)
   Wires: loader · scrub hero · 3D harbor · card · panel · filters
   ============================================================ */

import { PROVIDERS, GROUPS, GROUP_ORDER } from './providers.js';
import { createScrub } from './scrub.js';
import { createHarbor } from './harbor.js';

const $ = (id) => document.getElementById(id);
gsap.registerPlugin(ScrollTrigger);

/* ---------- Provider card ---------- */
const cardEl = $('card'), cardCat = $('cardCat'), cardName = $('cardName');
const cardTag = $('cardTag'), cardPrice = $('cardPrice'), cardBook = $('cardBook'), cardClose = $('cardClose');

function openCard(p) {
  cardCat.textContent = p.cat;
  cardCat.style.color = (GROUPS[p.group] || {}).color || 'var(--coral)';
  cardName.textContent = p.name;
  cardTag.textContent = p.tag;
  cardPrice.textContent = p.price;
  cardBook.href = '#'; // TODO: real reseller/affiliate link
  cardEl.classList.add('open');
  cardEl.setAttribute('aria-hidden', 'false');
}
function closeCard() { cardEl.classList.remove('open'); cardEl.setAttribute('aria-hidden', 'true'); }
cardClose.addEventListener('click', closeCard);
cardEl.addEventListener('click', (e) => { if (e.target === cardEl) closeCard(); });

/* ---------- Full list panel ---------- */
const panelEl = $('panel'), panelList = $('panelList'), panelClose = $('panelClose'), listBtn = $('listBtn');
function openPanel() { panelEl.classList.add('open'); panelEl.setAttribute('aria-hidden', 'false'); }
function closePanel() { panelEl.classList.remove('open'); panelEl.setAttribute('aria-hidden', 'true'); }
listBtn.addEventListener('click', openPanel);
panelClose.addEventListener('click', closePanel);

PROVIDERS.forEach((p) => {
  const item = document.createElement('div');
  item.className = 'panel-item';
  item.innerHTML = `<div class="panel-item__cat">${p.cat}</div><div class="panel-item__name">${p.name}</div><div class="panel-item__price">${p.price}</div>`;
  item.querySelector('.panel-item__cat').style.color = (GROUPS[p.group] || {}).color;
  item.addEventListener('click', () => { closePanel(); openCard(p); });
  panelList.appendChild(item);
});
$('count').textContent = PROVIDERS.length;

/* ---------- Harbor (3D providers) ---------- */
let harbor = null;
try {
  harbor = createHarbor({ container: $('harbor'), onSelect: openCard });
} catch (err) {
  console.warn('harbor init failed:', err);
}

/* ---------- Category filters ---------- */
let activeFilter = null;
GROUP_ORDER.forEach((key) => {
  const g = GROUPS[key];
  const btn = document.createElement('button');
  btn.className = 'filter';
  btn.innerHTML = `<span class="filter__dot" style="background:${g.color}"></span>${g.label}`;
  btn.addEventListener('click', () => {
    if (activeFilter === key) {
      activeFilter = null;
      btn.classList.remove('active');
      harbor && harbor.setFilter(null);
    } else {
      document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = key;
      harbor && harbor.setFilter(key);
    }
  });
  $('filters').appendChild(btn);
});

/* ---------- Frame-count probing (robust to subagent's exact count) ---------- */
async function probeFrame(basePath, i, ext) {
  try {
    const r = await fetch(`${basePath}/frame-${String(i).padStart(4, '0')}.${ext}`, { method: 'HEAD', cache: 'no-store' });
    return r.ok;
  } catch { return false; }
}
async function detectFrames(basePath) {
  const ext = (await probeFrame(basePath, 1, 'webp')) ? 'webp'
            : (await probeFrame(basePath, 1, 'jpg')) ? 'jpg' : null;
  if (!ext) return { count: 0, ext: 'webp' };
  let lo = 1, hi = 300;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (await probeFrame(basePath, mid, ext)) lo = mid; else hi = mid - 1;
  }
  return { count: lo, ext };
}

/* ---------- Scroll-scrubbed hero ---------- */
async function initScrub() {
  const { count } = await detectFrames('video/frames');
  let scrub = null;

  if (count > 0) {
    scrub = createScrub({ container: $('heroScrub'), count, basePath: 'video/frames' });
    await scrub.ready;
  } else {
    // fallback: plain video loop
    const fb = $('heroFallback');
    fb.hidden = false;
    fb.play().catch(() => {});
  }

  ScrollTrigger.create({
    trigger: '#scrub',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.scrub__pin',
    scrub: 0.6,
    onUpdate: (self) => { if (scrub) scrub.setProgress(self.progress); }
  });
  ScrollTrigger.create({
    trigger: '#scrub', start: '4% top',
    onEnter: () => gsap.to('#hint', { opacity: 0, duration: 0.4 })
  });
  return scrub;
}

/* ---------- Mouse parallax on the hero ---------- */
if (window.matchMedia && matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
    gsap.to('#heroScrub', {
      x: mx * 14, y: my * 9, scale: 1.04,
      duration: 1.4, ease: 'power2.out', overwrite: 'auto'
    });
  });
}

/* ---------- Boot ---------- */
async function boot() {
  const t0 = performance.now();
  await initScrub();
  const wait = Math.max(0, 1500 - (performance.now() - t0));
  await new Promise((r) => setTimeout(r, wait));
  gsap.to('#loader', {
    opacity: 0, duration: 0.6,
    onComplete: () => { const l = $('loader'); l && l.remove(); }
  });
  ScrollTrigger.refresh();
}
boot();
