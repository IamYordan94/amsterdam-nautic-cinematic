/* ============================================================
   VAART — The Harbor · main.js
   Wires: loader · static art hero · 3D harbor · card · panel · filters
   (scroll-scrub video engine removed — hero is generated artwork)
   ============================================================ */

import { PROVIDERS, GROUPS, GROUP_ORDER } from './providers.js';
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

/* ---------- Mouse parallax on the static hero ---------- */
if (window.matchMedia && matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
    gsap.to('#heroBg', {
      x: mx * 16, y: my * 10, scale: 1.05,
      duration: 1.4, ease: 'power2.out', overwrite: 'auto'
    });
  });
}

/* ---------- Hero hint fades once you scroll ---------- */
ScrollTrigger.create({
  trigger: '#hero', start: '8% top',
  onEnter: () => gsap.to('#hint', { opacity: 0, duration: 0.4 })
});

/* ---------- Boot ---------- */
function boot() {
  // deterministic, gsap-independent loader removal
  setTimeout(() => {
    const l = $('loader');
    if (!l) return;
    l.style.transition = 'opacity 0.6s ease';
    l.style.opacity = '0';
    setTimeout(() => l.remove(), 700);
  }, 900);
  ScrollTrigger.refresh();
}
boot();
